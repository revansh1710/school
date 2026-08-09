import { getStaffUser } from "../../../lib/adminAuth"
import { redirect } from "next/navigation"
import { query } from "../../../lib/db"
import ExamTimetableManager from "../../components/staff/ExamTimetableManager"

export const dynamic = 'force-dynamic'

export default async function StaffExamTimetablePage() {
  const user = await getStaffUser()
  if (!user || user.role !== 'STAFF') {
    redirect("/admin/login")
  }

  // 1. Fetch section where user is Class Teacher
  const sectionRes = await query(`
    SELECT ts."sectionId", s.name as section_name, c.name as class_name
    FROM "TeacherSection" ts
    JOIN "Section" s ON ts."sectionId" = s.id
    JOIN "Class" c ON s."classId" = c.id
    WHERE ts."teacherId" = $1 AND ts."isClassTeacher" = true
    ORDER BY c."order", s.name
  `, [user.id])

  const classTeacherSections = sectionRes.rows

  if (classTeacherSections.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
        <span className="text-4xl mb-4 block">📋</span>
        <h2 className="text-xl font-bold text-slate-800">Exam Timetable Restricted</h2>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          Posting and managing exam timetables are restricted to designated **Class Teachers**.
          You are not currently registered as a Class Teacher for any active section.
        </p>
        <p className="text-slate-400 mt-4 text-xs">
          Please contact an administrator to review your classroom role assignments.
        </p>
      </div>
    )
  }

  const activeSection = classTeacherSections[0]

  // 2. Fetch exams created for this section
  const examsRes = await query(`
    SELECT id, name, "examDate" FROM "Exam"
    WHERE "sectionId" = $1
    ORDER BY "createdAt" DESC
  `, [activeSection.sectionId])

  const exams = examsRes.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    examDate: row.examDate ? row.examDate.toISOString().split('T')[0] : null
  }))

  // 3. Fetch subjects taught in this section
  const subjectsRes = await query(`
    SELECT DISTINCT subject
    FROM "TeacherSection"
    WHERE "sectionId" = $1 AND subject IS NOT NULL AND subject != ''
    ORDER BY subject ASC
  `, [activeSection.sectionId])

  const querySubjects = subjectsRes.rows.map((row: any) => row.subject)
  
  // Merge subjects with standard core curriculum fallbacks
  const subjects = Array.from(new Set([
    ...querySubjects,
    ...['Mathematics', 'Science', 'English', 'Sanskrit', 'Social Studies']
  ]))

  return (
    <div className="p-1 sm:p-4">
      <ExamTimetableManager
        exams={exams}
        sectionId={activeSection.sectionId}
        className={activeSection.class_name}
        sectionName={activeSection.section_name}
        subjects={subjects}
      />
    </div>
  )
}
