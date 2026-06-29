import { getStaffUser } from "../../../lib/adminAuth"
import { redirect } from "next/navigation"
import { query } from "../../../lib/db"
import TimetableManager from "../../components/staff/TimetableManager"

export const dynamic = 'force-dynamic'

export default async function StaffTimetablePage() {
  const user = await getStaffUser()
  if (!user || user.role !== 'STAFF') {
    redirect("/admin/login")
  }

  // 1. Fetch sections where user is the Class Teacher
  const sectionsRes = await query(`
    SELECT ts."sectionId", s.name as section_name, c.name as class_name
    FROM "TeacherSection" ts
    JOIN "Section" s ON ts."sectionId" = s.id
    JOIN "Class" c ON s."classId" = c.id
    WHERE ts."teacherId" = $1 AND ts."isClassTeacher" = true
    ORDER BY c."order", s.name
  `, [user.id])

  const classTeacherSections = sectionsRes.rows

  if (classTeacherSections.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
        <span className="text-4xl mb-4 block">🗓️</span>
        <h2 className="text-xl font-bold text-slate-800">Timetable Access Restricted</h2>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          Timetable modification and CRUD operations are restricted to designated **Class Teachers**.
          You are not currently registered as a Class Teacher for any section.
        </p>
        <p className="text-slate-400 mt-4 text-xs">
          Please contact an administrator to review your staff assignments.
        </p>
      </div>
    )
  }

  // Default to the first section assigned
  const activeSection = classTeacherSections[0]

  // 2. Fetch timetable entries for this section
  const timetableRes = await query(`
    SELECT t.id, t."sectionId", t."dayOfWeek", t."startTime", t."endTime", t.subject, t.room, t."teacherId", u."parentName" as teacher_name
    FROM "TimetableEntry" t
    LEFT JOIN "User" u ON t."teacherId" = u.id
    WHERE t."sectionId" = $1
    ORDER BY t."dayOfWeek" ASC, t."startTime" ASC
  `, [activeSection.sectionId])

  const timetableEntries = timetableRes.rows.map((row: any) => ({
    id: row.id,
    sectionId: row.sectionId,
    dayOfWeek: row.dayOfWeek,
    startTime: row.startTime,
    endTime: row.endTime,
    subject: row.subject,
    teacherId: row.teacherId,
    teacher_name: row.teacher_name,
    room: row.room
  }))

  // 3. Fetch all staff members for the assignment dropdown
  const teachersRes = await query(`
    SELECT id, "parentName" as name
    FROM "User"
    WHERE role = 'STAFF'
    ORDER BY "parentName" ASC
  `)

  const teachers = teachersRes.rows.map((row: any) => ({
    id: row.id,
    name: row.name || 'Unnamed Teacher'
  }))

  return (
    <div className="p-1 sm:p-4">
      <TimetableManager
        initialTimetable={timetableEntries}
        sectionId={activeSection.sectionId}
        className={activeSection.class_name}
        sectionName={activeSection.section_name}
        teachers={teachers}
      />
    </div>
  )
}
