import { sendStatusUpdateMail } from "../../lib/utils/mailService"
import { serverClient } from "../../lib/sanity/serverClient"
import { query } from "../../../lib/db"
import { Student } from "../../../lib/types"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const newStatus = body?.status
    const oldStatus = body?.previousStatus
    const newApproval = body?.interviewApprovalStatus
    const oldApproval = body?.previousInterviewApprovalStatus
    const email = body?.email
    const parentName = body?.parentName

    if ((!newStatus || newStatus === oldStatus) && (!newApproval || newApproval === oldApproval)) {
      return Response.json({ message: "No status change" })
    }

    if (newStatus === "rejected" && email) {
      // 1. Delete admissionEnquiry from Sanity
      const sanityId = body?._id
      if (sanityId) {
        await serverClient.delete(sanityId)
      } else {
        const sanityQuery = `*[_type == "admissionEnquiry" && email == $email][0]`
        const enquiry = await serverClient.fetch(sanityQuery, { email })
        if (enquiry) {
          await serverClient.delete(enquiry._id)
        }
      }

      // 2. Dynamic Cleanup: Check remaining active enquiries
      const remainingCount = await serverClient.fetch(
        `count(*[_type == "admissionEnquiry" && email == $email])`,
        { email }
      )

      if (remainingCount === 0) {
        // Delete user from DB
        const userRes = await query('SELECT * FROM "User" WHERE email = $1', [email])
        const user = userRes.rows[0]
        if (user) {
          await query('DELETE FROM "Session" WHERE "userId" = $1', [user.id])
          await query('DELETE FROM "MagicToken" WHERE "userId" = $1', [user.id])
          await query('DELETE FROM "ParentStudent" WHERE "parentId" = $1', [user.id])
          await query('DELETE FROM "User" WHERE id = $1', [user.id])
        }
      }
    }

    if (newStatus === "accepted" && email) {
      const userRes = await query('SELECT * FROM "User" WHERE email = $1', [email])
      let user = userRes.rows[0]
      
      if (!user) {
        const insertRes = await query(
          'INSERT INTO "User" (email, "parentName") VALUES ($1, $2) RETURNING *',
          [email, parentName || "Parent"]
        )
        user = insertRes.rows[0]
      }
      
      const studentName = body?.studentName || "Unknown"
      const nameParts = studentName.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

      // Create student and the ParentStudent relation
      const studentRes = await query(
        'INSERT INTO "Student" ("firstName", "lastName", "admissionStatus") VALUES ($1, $2, $3) RETURNING *',
        [firstName, lastName, 'ACCEPTED']
      )
      const student = studentRes.rows[0] as Student

      await query(
        'INSERT INTO "ParentStudent" ("parentId", "studentId") VALUES ($1, $2)',
        [user.id, student.id]
      )
    }

    // 3. Send email update based on main status change
    if (newStatus && newStatus !== oldStatus) {
      await sendStatusUpdateMail({
        to: email,
        parentName,
        status: newStatus
      })
    }

    // 4. Send email update based on interview approval status
    if (newApproval && newApproval !== oldApproval) {
      if (newApproval === 'approved') {
         await sendStatusUpdateMail({ to: email, parentName, status: 'interview_scheduled' })
      } else if (newApproval === 'rejected') {
         await sendStatusUpdateMail({ to: email, parentName, status: 'interview_schedule_rejected' })
      }
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Webhook update-status error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}