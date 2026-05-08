import { NextResponse } from "next/server"
import { getCurrentUser } from "../../../../lib/auth"
import { serverClient } from "../../../lib/sanity/serverClient"
import { sendStatusUpdateMail } from "../../../lib/utils/mailService"
import { query } from "../../../../lib/db"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enquiryId } = await req.json();
    
    if (!enquiryId) {
      return NextResponse.json({ error: "enquiryId is required" }, { status: 400 });
    }

    // 1. Delete specific enquiry from Sanity
    const sanityQuery = `*[_type == "admissionEnquiry" && email == $email && _id == $enquiryId][0]`
    const enquiry = await serverClient.fetch(sanityQuery, { email: user.email, enquiryId })
    
    if (enquiry) {
      await serverClient.delete(enquiry._id)
    } else {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    // 2. Send email notification
    await sendStatusUpdateMail({
      to: user.email,
      parentName: user.parentName || "Parent",
      status: "withdrawn",
    })

    // 3. Dynamic Cleanup: Check remaining active enquiries
    const remainingCount = await serverClient.fetch(
      `count(*[_type == "admissionEnquiry" && email == $email])`,
      { email: user.email }
    )

    let fullyWithdrawn = false

    if (remainingCount === 0) {
      // Delete related database entities
      await query('DELETE FROM "Session" WHERE "userId" = $1', [user.id])
      await query('DELETE FROM "MagicToken" WHERE "userId" = $1', [user.id])
      await query('DELETE FROM "ParentStudent" WHERE "parentId" = $1', [user.id])
      // Delete actual user
      await query('DELETE FROM "User" WHERE id = $1', [user.id])

      // Logout (clear session cookie)
      const cookieStore = await cookies()
      cookieStore.delete("session")
      
      fullyWithdrawn = true
    }

    return NextResponse.json({ 
      success: true, 
      message: "Application withdrawn successfully",
      fullyWithdrawn
    })

  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json(
      { error: "Failed to withdraw application" },
      { status: 500 }
    )
  }
}
