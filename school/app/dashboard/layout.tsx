import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardHeader from "../components/layout/DashboardHeader"
import DashboardFooter from "../components/layout/DashboardFooter"
import DashboardSidebar from "../components/layout/DashboardSidebar"
import {cookies} from 'next/headers'
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

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
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <DashboardHeader parentName={user.parentName ?? undefined} status={undefined} />

      {/* MAIN AREA */}
      <div className="flex flex-row flex-1 w-full max-w-full overflow-hidden">

        <DashboardSidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-full overflow-x-hidden pb-24 md:pb-8">
          {children}
        </main>

      </div>

      <DashboardFooter />

    </div>
  )
}