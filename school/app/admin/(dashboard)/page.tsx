import { query } from "../../../lib/db"
import { Users, GraduationCap, School, LayoutDashboard, CalendarCheck, CheckCircle2, Clock } from "lucide-react"
import { getStaffUser } from "../../../lib/adminAuth"
import { format } from "date-fns"

export default async function AdminDashboardPage() {
  
  const user = await getStaffUser()
  if (!user) return null

  // Fetch high-level stats
  const studentsCountRes = await query('SELECT COUNT(*) FROM "Student"')
  const totalStudents = parseInt(studentsCountRes.rows[0].count, 10)

  const classesCountRes = await query('SELECT COUNT(*) FROM "Class"')
  const totalClasses = parseInt(classesCountRes.rows[0].count, 10)

  const usersCountRes = await query('SELECT COUNT(*) FROM "User" WHERE role = $1', ['PARENT'])
  const totalParents = parseInt(usersCountRes.rows[0].count, 10)

  // Fetch today's attendance overview for managed classes (or all classes for SUPER_ADMIN)
  const dateStr = format(new Date(), 'yyyy-MM-dd')
  const isSuperAdmin = user.role === 'SUPER_ADMIN'
  const overviewRes = isSuperAdmin
    ? await query(`
        SELECT s.id as section_id, s.name as section_name, c.name as class_name, 
               a.id as attendance_id, u."parentName" as recorded_by_name
        FROM "Section" s
        JOIN "Class" c ON s."classId" = c.id
        LEFT JOIN "Attendance" a ON s.id = a."sectionId" AND a.date = $1
        LEFT JOIN "User" u ON a."recordedById" = u.id
        ORDER BY c."order" ASC, s.name ASC
      `, [dateStr])
    : await query(`
        SELECT s.id as section_id, s.name as section_name, c.name as class_name, 
               a.id as attendance_id, u."parentName" as recorded_by_name
        FROM "Section" s
        JOIN "Class" c ON s."classId" = c.id
        JOIN "AdminClass" ac ON c.id = ac."classId"
        LEFT JOIN "Attendance" a ON s.id = a."sectionId" AND a.date = $2
        LEFT JOIN "User" u ON a."recordedById" = u.id
        WHERE ac."adminId" = $1
        ORDER BY c."order" ASC, s.name ASC
      `, [user.id, dateStr])

  const attendanceOverview = overviewRes.rows.map(row => ({
    sectionId: row.section_id,
    sectionName: row.section_name,
    className: row.class_name,
    isCompleted: !!row.attendance_id,
    recordedBy: row.recorded_by_name
  }))

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Enrolled</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalStudents}</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Registered Parents</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalParents}</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <School className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Classes</p>
            <h3 className="text-2xl font-bold text-slate-900">{totalClasses}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Attendance Overview Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-base font-semibold text-slate-800 flex items-center">
              <CalendarCheck className="w-5 h-5 mr-2 text-indigo-500" />
              Today&apos;s Attendance Status
            </h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-200/50 px-2.5 py-1 rounded-md">
              {format(new Date(), 'MMM do, yyyy')}
            </span>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {attendanceOverview.length === 0 ? (
                <li className="p-6 text-center text-sm text-slate-500">No classes currently assigned.</li>
              ) : attendanceOverview.map((item, idx) => (
                <li key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.className} - Sec {item.sectionName}</p>
                    <p className="text-xs text-slate-500">
                      {item.isCompleted ? `Recorded by ${item.recordedBy}` : 'Waiting for teacher submission'}
                    </p>
                  </div>
                  <div>
                    {item.isCompleted ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Pending
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Activity Feed Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-base font-semibold text-slate-800 flex items-center">
              <LayoutDashboard className="w-5 h-5 mr-2 text-blue-500" />
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <LayoutDashboard className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm">Activity feed will appear here as the system processes new admissions.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
