import { NextResponse } from "next/server";
import { client } from "../../../../sanity/lib/client";
import { startOfDay, endOfDay, setHours, setMinutes, isBefore } from "date-fns";
import { getCurrentUser } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');
    if (!dateParam) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const targetDate = new Date(dateParam);
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const start = startOfDay(targetDate).toISOString();
    const end = endOfDay(targetDate).toISOString();

    // Fetch existing bookings for this day
    const existingBookings = await client.fetch(
      `*[_type == "admissionEnquiry" && defined(interviewDate) && interviewDate >= $start && interviewDate <= $end && interviewApprovalStatus != "rejected"]{
        interviewDate
      }`,
      { start, end }
    );

    const bookedTimes = existingBookings.map((b: any) => new Date(b.interviewDate).getTime());

    // Generate all possible slots for the day (09:00 to 15:30)
    const availableSlots = [];
    let currentSlot = setMinutes(setHours(targetDate, 9), 0); // 9:00 AM
    const EndSlot = setMinutes(setHours(targetDate, 16), 0); // 4:00 PM (Exclusive)
    const now = new Date(); // To prevent booking past times on the current day 

    while (isBefore(currentSlot, EndSlot)) {
      // Check if slot is booked
      const isBooked = bookedTimes.includes(currentSlot.getTime());
      
      // Check if slot is in the past
      const isPast = isBefore(currentSlot, now);

      if (!isBooked && !isPast) {
        availableSlots.push(currentSlot.toISOString());
      }
      
      // Advance by 30 mins
      currentSlot = new Date(currentSlot.getTime() + 30 * 60000);
    }

    return NextResponse.json({ availableSlots });

  } catch (error) {
    console.error("Available slots api error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
