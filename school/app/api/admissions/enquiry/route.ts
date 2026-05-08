import { NextResponse } from "next/server"
import { serverClient } from "../../../lib/sanity/serverClient"
import { sendWelcomeMail } from "../../../lib/utils/mailService"
import { admissionConfig } from "../../../../lib/admissionConfig"

function mapGradeToCategory(grade: string) {
  if (!grade) return "primary"

  const g = grade.toLowerCase().trim()

  const prePrimaryGrades = ["nursery", "lkg", "ukg", "pre", "pre-primary"]

  if (prePrimaryGrades.some(p => g.includes(p))) {
    return "pre_primary"
  }
  const match = g.match(/\d+/)
  const num = match ? parseInt(match[0]) : null

  if (num === null) return "primary"

  if (num <= 5) return "primary"
  if (num <= 8) return "middle"
  return "secondary"
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.email || !body.parentName || !body.students || body.students.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
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
        parentName: body.parentName,
        email: body.email,
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

    // Send only one welcome email to the parent
    await sendWelcomeMail({
      to: body.email,
      name: body.parentName,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Enquiry error:", error)

    return NextResponse.json(
      { error: "Failed to create enquiry" },
      { status: 500 }
    )
  }
}