import { getStaffUser } from "../../../../lib/adminAuth"
import RegisterForm from "./RegisterForm"

export default async function AdminRegisterPage() {
  const user = await getStaffUser()
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Internal Registration</h2>
        <p className="text-sm text-slate-500 mt-1">Create new accounts for Staff and Teachers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">New User Account</h3>
        </div>
        <div className="p-6">
          <RegisterForm isSuperAdmin={isSuperAdmin} />
        </div>
      </div>
    </div>
  )
}
