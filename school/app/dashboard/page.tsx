import { getCurrentUser } from '../../lib/auth'
import DashboardTabs from '../components/layout/DashboardTabs'
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
  
  if (data.error || !data.enquiries) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[50vh]">
         <h1 className='text-amber-600 text-2xl font-bold mb-4'>Welcome to your Dashboard</h1>
         <p className="text-gray-500">No active admission enquiries found.</p>
       </div>
    )
  }

  return (
    <div>
      <DashboardTabs enquiries={data.enquiries} />
    </div>
  )
}