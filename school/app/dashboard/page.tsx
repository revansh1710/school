import { getCurrentUser } from '../../lib/auth'
import DashboardTabs from '../components/layout/DashboardTabs'
import EnrolledStudents from '../components/dashboard/EnrolledStudents'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function DashboardPage() {

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // ✅ GET COOKIES
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
  console.log(data)
  
  if (data.error || (!data.enquiries?.length && !data.enrolledStudents?.length)) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[50vh]">
         <h1 className='text-amber-600 text-2xl font-bold mb-4'>Welcome to your Dashboard</h1>
         <p className="text-gray-500">No active admission enquiries or enrolled students found.</p>
       </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6">
      <EnrolledStudents students={data.enrolledStudents} />
      {data.enquiries && data.enquiries.length > 0 && (
        <DashboardTabs enquiries={data.enquiries} />
      )}
    </div>
  )
}