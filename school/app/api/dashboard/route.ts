import { getCurrentUser } from "../../../lib/auth"
import { client } from "../../../sanity/lib/client"

export async function GET() {
  try {
    // ✅ 1. Validate session
    const user = await getCurrentUser()

    if (!user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // ✅ 2. Fetch enquiry from Sanity
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
        documents
      }`,
      { email: user.email }
    )

    // ❌ No enquiry found
    if (!enquiry) {
      return Response.json(
        { error: "No admission data found" },
        { status: 404 }
      )
    }

    // ✅ 3. Normalize data (VERY IMPORTANT)
    const requiredDocs = enquiry.requiredDocuments || []

    const uploadedDocs = enquiry.documents || {}

    // Count uploaded documents
    const uploadedCount = Object.keys(uploadedDocs).length

    // Check if all docs uploaded
    const allDocsUploaded =
      requiredDocs.length > 0 &&
      uploadedCount === requiredDocs.length

    // ✅ 4. Return clean dashboard data
    return Response.json({
      parentName: enquiry.parentName,
      studentName: enquiry.studentName,

      grade: enquiry.grade,
      gradeCategory: enquiry.gradeCategory,

      status: enquiry.status  ?? "new",
      documentsStatus: enquiry.documentsStatus || "pending",
      
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