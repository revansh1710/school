import { NextResponse } from "next/server";
import { serverClient } from "../../../lib/sanity/serverClient";
import { getCurrentUser } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { interviewDate } = await req.json();
    if (!interviewDate) {
      return NextResponse.json({ error: "interviewDate is required" }, { status: 400 });
    }

    // Check if user has an enquiry
    const enquiry = await serverClient.fetch(
      `*[_type == "admissionEnquiry" && email == $email][0]`,
      { email: user.email }
    );

    if (!enquiry) {
      return NextResponse.json({ error: "No admission data found" }, { status: 404 });
    }

    // Check concurrency: ensure this exact time hasn't been taken by someone else
    const existing = await serverClient.fetch(
      `*[_type == "admissionEnquiry" && interviewDate == $interviewDate && interviewApprovalStatus != "rejected" && _id != $id][0]`,
      { interviewDate, id: enquiry._id }
    );

    if (existing) {
       return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });
    }

    // Update the document to tentatively hold the interview slot
    await serverClient.patch(enquiry._id)
      .set({ 
        interviewDate,
        interviewApprovalStatus: "pending" 
      })
      .commit();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Request interview api error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
