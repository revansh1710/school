import { getStaffUser } from "../../../lib/adminAuth"
import { redirect } from "next/navigation"
import { query } from "../../../lib/db"
import NotesManager from "../../components/staff/NotesManager"

export const dynamic = 'force-dynamic'

export default async function StaffNotesPage() {
  const user = await getStaffUser()
  if (!user || user.role !== 'STAFF') {
    redirect("/admin/login")
  }

  // Fetch sections assigned to this staff member
  const sectionsRes = await query(`
    SELECT s.id, s.name, s."classId", c.name as class_name, ts."isClassTeacher", ts.subject
    FROM "TeacherSection" ts
    JOIN "Section" s ON ts."sectionId" = s.id
    JOIN "Class" c ON s."classId" = c.id
    WHERE ts."teacherId" = $1
    ORDER BY c."order", s.name
  `, [user.id])

  const sections = sectionsRes.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    classId: row.classId,
    class_name: row.class_name,
    isClassTeacher: row.isClassTeacher,
    subject: row.subject
  }))

  if (sections.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
        <span className="text-4xl mb-4 block">📝</span>
        <h2 className="text-xl font-bold text-slate-800">Class Notes Restriction</h2>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          You are not currently assigned to teach any class sections.
          Contact the administrator to set up your teacher sections before publishing notes.
        </p>
      </div>
    )
  }

  return (
    <div className="p-1 sm:p-4">
      <NotesManager sections={sections} currentUserId={user.id} />
    </div>
  )
}
