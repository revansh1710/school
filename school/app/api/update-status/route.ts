import { sendStatusUpdateMail } from "../../lib/utils/mailService"
import { serverClient } from "../../lib/sanity/serverClient"
import prisma from "../../lib/prisma"

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
      // 1. Delete user from Prisma
      const user = await prisma.user.findUnique({ where: { email } })
      if (user) {
        await prisma.session.deleteMany({ where: { userId: user.id } })
        await prisma.magicToken.deleteMany({ where: { userId: user.id } })
        await prisma.parentStudent.deleteMany({ where: { parentId: user.id } })
        await prisma.user.delete({ where: { id: user.id } })
      }

      // 2. Delete admissionEnquiry from Sanity
      const sanityId = body?._id
      if (sanityId) {
        await serverClient.delete(sanityId)
      } else {
        const query = `*[_type == "admissionEnquiry" && email == $email][0]`
        const enquiry = await serverClient.fetch(query, { email })
        if (enquiry) {
          await serverClient.delete(enquiry._id)
        }
      }
    }

    if (newStatus === "accepted" && email) {
      const user = await prisma.user.findUnique({ where: { email } })
      
      if (user) {
        const studentName = body?.studentName || "Unknown"
        const nameParts = studentName.trim().split(" ")
        const firstName = nameParts[0]
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

        // Create student and the ParentStudent relation
        await prisma.student.create({
          data: {
            firstName,
            lastName,
            admissionStatus: "ACCEPTED",
            parents: {
              create: {
                parentId: user.id
              }
            }
          }
        })
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