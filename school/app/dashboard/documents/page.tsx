import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { GradeCategory } from "@/lib/types"
import DocumentUpload from "../../components/admissions/documentUpload"

export default async function DocumentsPage() {

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const enquiry = await client.fetch(
    `*[_type == "admissionEnquiry" && email == $email][0]`,
    { email: user.email }
  )

  if (!enquiry) return <div>No data</div>

  const category = (enquiry.gradeCategory || "primary") as GradeCategory



  return (
    <DocumentUpload requiredDocs={enquiry.requiredDocuments}/>
  )
}