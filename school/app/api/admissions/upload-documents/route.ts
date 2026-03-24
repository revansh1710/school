import { getCurrentUser } from "../../../../lib/auth"
import { client } from "../../../../sanity/lib/client"
import { admissionConfig } from "../../../../lib/admissionConfig"
import { serverClient } from '../../../lib/sanity/serverClient'
export async function POST(req: Request) {

  const user = await getCurrentUser()

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()

  const enquiry = await client.fetch(
    `*[_type == "admissionEnquiry" && email == $email][0]`,
    { email: user.email }
  )

  if (!enquiry) {
    return Response.json({ error: "No entry found" }, { status: 404 })
  }

  // ✅ STEP 1: Get category
  const category = (enquiry.gradeCategory || "primary") as keyof typeof admissionConfig

  const rule = admissionConfig[category]

  if (!rule) {
    return Response.json(
      { error: "Invalid admission configuration" },
      { status: 400 }
    )
  }

  // ✅ STEP 2: Validate required documents
  const requiredDocs =
    enquiry.requiredDocuments?.length
      ? enquiry.requiredDocuments
      : admissionConfig[category] // fallback

  for (const doc of requiredDocs) {
    if (!formData.get(doc)) {
      return Response.json(
        { error: `${doc} required` },
        { status: 400 }
      )
    }
  }

  // ✅ STEP 3: Upload only required docs
  let uploadedDocs: any = {}
  for (const doc of requiredDocs) {
    const file = formData.get(doc) as File

    const asset = await client.assets.upload("file", file)

    uploadedDocs[doc] = {
      _type: "file",
      asset: { _ref: asset._id }
    }
  }
  await serverClient
    .patch(enquiry._id)
    .set({
      documents: uploadedDocs,
      documentsStatus: "submitted",

      // ✅ ADD THIS LINE
      status: "documents_submitted"
    })
    .commit()

  const updated = await serverClient.fetch(
    `*[_id == $id][0]{status}`,
    { id: enquiry._id }
  )

  console.log("UPDATED STATUS:", updated.status)

  return Response.json({ success: true })
}