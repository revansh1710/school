import { getCurrentUser } from '../../lib/auth'
import AdmissionStatus from '../components/admissions/AdmissionStatus'
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
  console.log(data.status)

  return (
    <div>
      <h1 className='text-amber-600 flex items-center justify-center'>
        Welcome to Dashboard
      </h1>

      <AdmissionStatus status={data.status} />
    </div>
  )
}