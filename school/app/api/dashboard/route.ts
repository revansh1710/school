import { getCurrentUser } from "../../../lib/auth"
import { client } from "../../../sanity/lib/client"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const enquiry = await client.fetch(
      `*[_type == "admissionEnquiry" && email == $email][0]{
        _id,
        parentName,
        email,
        studentName,
        grade,
        gradeCategory,
        requiredDocuments,
        documentsStatus,
        status,
        interviewDate,
        interviewApprovalStatus,
        documents
      }`,
      { email: user.email }
    )

    if (!enquiry) {
      return Response.json(
        { error: "No admission data found" },
        { status: 404 }
      )
    }

    const requiredDocs = enquiry.requiredDocuments || []

    const uploadedDocs = enquiry.documents || {}

    const uploadedCount = Object.keys(uploadedDocs).length

    const allDocsUploaded =
      requiredDocs.length > 0 &&
      uploadedCount === requiredDocs.length

    return Response.json({
      parentName: enquiry.parentName,
      studentName: enquiry.studentName,

      grade: enquiry.grade,
      gradeCategory: enquiry.gradeCategory,

      status: enquiry.status  ?? "new",
      documentsStatus: enquiry.documentsStatus || "pending",
      interviewDate: enquiry.interviewDate || null,
      interviewApprovalStatus: enquiry.interviewApprovalStatus || "none",
      
      requiredDocuments: requiredDocs,
      uploadedDocuments: uploadedDocs,

      stats: {
        total: requiredDocs.length,
        uploaded: uploadedCount,
        completed: allDocsUploaded
      }
    })

  } catch (error) {
    console.error("Dashboard API error:", error)

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}