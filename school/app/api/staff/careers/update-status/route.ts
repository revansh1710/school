import { NextResponse } from "next/server";
import { getStaffUser } from "@/lib/adminAuth";
import { serverClient } from "@/app/lib/sanity/serverClient";

export async function POST(req: Request) {
  try {
    // 1. Session-Bound Role Verification (Least Privilege)
    const user = await getStaffUser();
    if (!user || user.role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized. Staff login required." }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Document ID and status are required." }, { status: 400 });
    }

    const allowedStatuses = ["reviewed", "interview_scheduled", "offered", "hired", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    // 2. Perform Mutation in Sanity
    await serverClient.patch(id).set({ status }).commit();

    return NextResponse.json({ success: true, updatedStatus: status });
  } catch (error: any) {
    console.error("Failed to update career application status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
