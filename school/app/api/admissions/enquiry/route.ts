import { NextResponse } from "next/server"
import { serverClient } from "../../../lib/sanity/serverClient"
import { sendWelcomeMail } from "../../../lib/utils/mailService"
import { admissionConfig, mapGradeToCategory } from "../../../../lib/admissionConfig"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.email || !body.parentName || !body.students || body.students.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const emailLower = body.email.toLowerCase().trim()

    // Validation: Check if an enquiry with this email already exists
    const existingEnquiry = await serverClient.fetch(
      `*[_type == "admissionEnquiry" && email == $email][0]`,
      { email: emailLower }
    )

    if (existingEnquiry) {
      const existingParentName = existingEnquiry.parentName || ""
      if (existingParentName.trim().toLowerCase() !== body.parentName.trim().toLowerCase()) {
        return NextResponse.json(
          { error: `This email is already registered. Please use the same parent name which has been already submitted for enquiry or use a different email.` },
          { status: 400 }
        )
      }
    }

    // Map over each student and create an independent Sanity document
    await Promise.all(body.students.map(async (student: { studentName: string; grade: string }) => {
      const gradeCategory = mapGradeToCategory(student.grade)
      const requiredDocuments = admissionConfig[gradeCategory as keyof typeof admissionConfig]

      if (!requiredDocuments) {
        throw new Error("Invalid grade configuration")
      }

      await serverClient.create({
        _type: "admissionEnquiry",
        parentName: body.parentName.trim(),
        email: emailLower,
        phone: body.phone,
        studentName: student.studentName,
        grade: student.grade,
        gradeCategory,
        requiredDocuments,
        message: body.message,
        status: "new",
        documentsStatus: "pending",
        createdAt: new Date().toISOString(),
      })
    }))

    // Send welcome email if SMTP is configured, safely handling any mail delivery issues
    try {
      await sendWelcomeMail({
        to: emailLower,
        name: body.parentName,
      })
    } catch (mailError) {
      console.error("Welcome email delivery failed (enquiry was created):", mailError)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Enquiry error:", error)

    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    )
  }
}
