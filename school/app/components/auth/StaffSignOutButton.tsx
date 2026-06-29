"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function StaffSignOutButton() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      const res = await fetch("/api/auth/staff-logout", {
        method: "POST"
      })
      if (res.ok) {
        router.push("/admin/login")
      } else {
        console.error("Signout API returned an error")
      }
    } catch (error) {
      console.error("Failed to sign out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {isLoggingOut ? "Signing out..." : "Sign out"}
    </button>
  )
}
