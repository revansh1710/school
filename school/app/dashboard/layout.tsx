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
  
    // ✅ PASS COOKIES
    const res = await fetch("http://localhost:3000/api/dashboard", {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader
      }
    })
  
    const data = await res.json()
  

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#f9fafb"
    }}>

      <DashboardHeader parentName={user.parentName ?? undefined} status={data.status} />

      {/* MAIN AREA */}
      <div style={{
        display: "flex",
        flex: 1
      }}>

        <DashboardSidebar />

        <main style={{
          flex: 1,
          padding: "2rem"
        }}>
          {children}
        </main>

      </div>

      <DashboardFooter />

    </div>
  )
}