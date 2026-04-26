import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { GradeCategory } from "@/lib/types"
import DocumentUpload from "../../components/admissions/documentUpload"
import { cookies } from 'next/headers'
import InterviewScheduler from '../../components/admissions/InterviewScheduler'
export default async function DocumentsPage() {

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

    const cookieStore = await cookies()
  
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join("; ")
  
    // ✅ PASS COOKIES
    const res = await fetch("http://localhost:3000/api/dashboard", {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader
      }
    })
  
    const data = await res.json()

  const enquiry = await client.fetch(
    `*[_type == "admissionEnquiry" && email == $email][0]`,
    { email: user.email }
  )

  if (!enquiry) return <div>No data</div>

  const category = (enquiry.gradeCategory || "primary") as GradeCategory



  return (
    <div>
    <DocumentUpload requiredDocs={enquiry.requiredDocuments}/>
          {data.status === 'documents_submitted' && data.interviewApprovalStatus !== 'pending' && (
             <div className="mt-8 mb-20 max-w-6xl mx-auto px-4 z-50 relative">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Schedule Your Interview</h2>
                <p className="text-center text-gray-500 mb-8">Please choose a date and time for your admission interview.</p>
                <InterviewScheduler />
             </div>
          )}
    
          {data.interviewApprovalStatus === 'pending' && data.status !== 'interview_scheduled' && (
            <div className="text-center p-8 bg-linear-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 mt-8 shadow-sm max-w-4xl mx-auto relative z-50">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-inner">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-amber-800 font-bold text-2xl mb-2 tracking-tight">Interview Request Pending</h3>
              <p className="text-amber-700 max-w-md mx-auto leading-relaxed">
                Your requested interview time is pending validation by the school administration. We will notify you via email shortly.
              </p>
            </div>
          )}
    </div>
  )
}