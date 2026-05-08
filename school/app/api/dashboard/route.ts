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

    const enquiries = await client.fetch(
      `*[_type == "admissionEnquiry" && email == $email]{
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

    if (!enquiries || enquiries.length === 0) {
      return Response.json(
        { error: "No admission data found" },
        { status: 404 }
      )
    }

    const formattedEnquiries = enquiries.map((enquiry: any) => {
      const requiredDocs = enquiry.requiredDocuments || []
      const uploadedDocs = enquiry.documents || {}
      const uploadedCount = Object.keys(uploadedDocs).length
      const allDocsUploaded = requiredDocs.length > 0 && uploadedCount === requiredDocs.length

      return {
        _id: enquiry._id,
        parentName: enquiry.parentName,
        studentName: enquiry.studentName,
        grade: enquiry.grade,
        gradeCategory: enquiry.gradeCategory,
        status: enquiry.status ?? "new",
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
      }
    })

    return Response.json({ enquiries: formattedEnquiries })

  } catch (error) {
    console.error("Dashboard API error:", error)

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}