import { NextResponse } from "next/server"
import { serverClient } from "../../../lib/sanity/serverClient"
import { sendWelcomeMail } from "../../../lib/utils/mailService"
import { admissionConfig } from "../../../../lib/admissionConfig"

function mapGradeToCategory(grade: string) {
  if (!grade) return "primary"

  const g = grade.toLowerCase().trim()

  // ✅ PRE-PRIMARY GROUP
  const prePrimaryGrades = ["nursery", "lkg", "ukg", "pre", "pre-primary"]

  if (prePrimaryGrades.some(p => g.includes(p))) {
    return "pre_primary"
  }

  // ✅ EXTRACT NUMBER (for Grade 1–10)
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

    if (!body.email || !body.parentName || !body.grade) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const gradeCategory = mapGradeToCategory(body.grade)

    // ✅ NEW: derive required documents ONCE
    const requiredDocuments =
      admissionConfig[gradeCategory as keyof typeof admissionConfig]

    if (!requiredDocuments) {
      return NextResponse.json(
        { error: "Invalid grade configuration" },
        { status: 400 }
      )
    }

    await serverClient.create({
      _type: "admissionEnquiry",
      parentName: body.parentName,
      email: body.email,
      phone: body.phone,
      studentName: body.studentName,
      grade: body.grade,

      gradeCategory,

      // ✅ STORE THIS (MOST IMPORTANT CHANGE)
      requiredDocuments,

      message: body.message,

      status: "new",
      documentsStatus: "pending",
      createdAt: new Date().toISOString(),
    })

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