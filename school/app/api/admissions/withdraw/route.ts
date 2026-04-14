import { NextResponse } from "next/server"
import { getCurrentUser } from "../../../../lib/auth"
import { serverClient } from "../../../lib/sanity/serverClient"
import { sendStatusUpdateMail } from "../../../lib/utils/mailService"
import prisma from "../../../lib/prisma"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!user.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // 1. Delete enquiry from Sanity
    const query = `*[_type == "admissionEnquiry" && email == $email][0]`
    const enquiry = await serverClient.fetch(query, { email: user.email })
    
    if (enquiry) {
      await serverClient.delete(enquiry._id)
    }

    // 2. Send email notification
    await sendStatusUpdateMail({
      to: user.email,
      parentName: user.parentName || "Parent",
      status: "withdrawn",
    })

    // 3. Delete related Prisma entities
    await prisma.session.deleteMany({ where: { userId: user.id } })
    await prisma.magicToken.deleteMany({ where: { userId: user.id } })
    await prisma.parentStudent.deleteMany({ where: { parentId: user.id } })

    // Delete actual user
    await prisma.user.delete({ where: { id: user.id } })

    // 4. Logout (clear session cookie)
    const cookieStore = await cookies()
    cookieStore.delete("session")

    return NextResponse.json({ success: true, message: "Application withdrawn successfully" })

  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json(
      { error: "Failed to withdraw application" },
      { status: 500 }
    )
  }
}
