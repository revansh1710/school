import { getStaffUser } from "../../lib/adminAuth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, CalendarCheck, GraduationCap, ClipboardList, User, BookOpen } from "lucide-react"
import StaffSignOutButton from "../components/auth/StaffSignOutButton"

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const user = await getStaffUser()

  if (!user || user.role !== 'STAFF') {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <GraduationCap className="w-6 h-6 text-indigo-400 mr-3" />
          <span className="text-lg font-bold text-white tracking-tight">EduStaff</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <Link href="/staff" className="flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <LayoutDashboard className="w-5 h-5 mr-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/staff/attendance" className="flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <CalendarCheck className="w-5 h-5 mr-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="font-medium text-sm">Attendance</span>
          </Link>
          <Link href="/staff/profile" className="flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <User className="w-5 h-5 mr-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="font-medium text-sm">My Profile</span>
          </Link>
          <Link href="/staff/timetable" className="flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <ClipboardList className="w-5 h-5 mr-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="font-medium text-sm">Manage Timetable</span>
          </Link>
          <Link href="/staff/notes" className="flex items-center px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors group">
            <BookOpen className="w-5 h-5 mr-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            <span className="font-medium text-sm">Class Notes</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs mr-3">
              {user.username.substring(0,2)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
          <StaffSignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h1 className="text-xl font-semibold text-slate-800">Teacher Portal</h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
              Staff Access
            </span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
