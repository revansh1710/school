import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardHeader from "../components/layout/DashboardHeader"
import DashboardFooter from "../components/layout/DashboardFooter"
import DashboardSidebar from "../components/layout/DashboardSidebar"
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }
  

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#f9fafb"
    }}>

      <DashboardHeader parentName={user.parentName ?? undefined} />

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