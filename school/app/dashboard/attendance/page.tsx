import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import AttendanceDashboard from "../../components/dashboard/AttendanceDashboard"

export default async function AttendancePage() {
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
  const enrolledStudents = (data.enrolledStudents || []).filter((s: any) => s.admissionStatus === 'ENROLLED')

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6">
      <AttendanceDashboard students={enrolledStudents} />
    </div>
  )
}
