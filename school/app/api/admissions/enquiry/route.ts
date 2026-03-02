import { NextResponse } from "next/server"
import { serverClient } from "../../../lib/sanity/serverClient"
import { sendWelcomeMail } from "../../../lib/utils/mailService"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Save to Sanity
    await serverClient.create({
      _type: "admissionEnquiry",
      parentName: body.parentName,
      email: body.email,
      phone: body.phone,
      studentName: body.studentName,
      grade: body.grade,
      message: body.message,
      createdAt: new Date().toISOString(),
      status: "new",
    })

    // Send confirmation email
    await sendWelcomeMail({
      to: body.email,
      name: body.parentName,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}