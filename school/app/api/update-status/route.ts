import { sendStatusUpdateMail } from "../../lib/utils/mailService"
import { serverClient } from "../../lib/sanity/serverClient"
import prisma from "../../lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const newStatus = body?.status
    const oldStatus = body?.previousStatus
    const email = body?.email
    const parentName = body?.parentName

    if (!newStatus || newStatus === oldStatus) {
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

    // 3. Send email update
    await sendStatusUpdateMail({
      to: email,
      parentName,
      status: newStatus
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Webhook update-status error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}