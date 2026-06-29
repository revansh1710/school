import { sendStatusUpdateMail } from "../../lib/utils/mailService"
import { serverClient } from "../../lib/sanity/serverClient"
import { query } from "../../../lib/db"
import { Student } from "../../../lib/types"
import { provisionStudentForEnquiry } from "../../../lib/studentProvision"

import {isValidSignature,SIGNATURE_HEADER_NAME} from '@sanity/webhook';

export async function POST(req: Request) {
  try {
    const signature=req.headers.get(SIGNATURE_HEADER_NAME)
    const rawBody=await req.text()
    const secret = process.env.SANITY_WEBHOOK_SECRET
    if (!signature || !isValidSignature(rawBody, signature, secret as string)) {
      console.warn("Blocked unauthorized signature attempt")

      return Response.json(
        {
          error: "Unauthorized"
        },
        {
          status: 401
        }
      )
    }

    const body = JSON.parse(rawBody)

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
          'INSERT INTO "User" (email, "parentName", "status") VALUES ($1, $2, $3) RETURNING *',
          [email, parentName || "Parent", "ACTIVE"]
        )
        user = insertRes.rows[0]
      } else {
        await query('UPDATE "User" SET status = $1 WHERE id = $2', ['ACTIVE', user.id])
      }
      
      // Fetch full document from Sanity if missing fields in webhook payload
      let fullDoc = body;
      if (!body.studentName || !body.grade) {
        fullDoc = await serverClient.fetch(
          `*[_type == "admissionEnquiry" && email == $email][0]`,
          { email }
        ) || body;
      }

      const studentName = fullDoc?.studentName || "Unknown"
      const grade = fullDoc?.grade

      try {
        await provisionStudentForEnquiry(user.id, studentName, grade)
      } catch (dbErr) {
        console.error("Failed to provision student/invoice into Postgres:", dbErr)
      }
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