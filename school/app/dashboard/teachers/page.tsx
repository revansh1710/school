import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import TeachersDashboard from "../../components/dashboard/TeachersDashboard"

export default async function TeachersPage() {
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  // ✅ PASS COOKIES
  const res = await fetch(`${baseUrl}/api/dashboard`, {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader
    }
  })

  const data = await res.json()
  const enrolledStudents = (data.enrolledStudents || []).filter((s: any) => s.admissionStatus === 'ENROLLED')

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6">
      <TeachersDashboard students={enrolledStudents} />
    </div>
  )
}
