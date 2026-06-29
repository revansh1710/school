import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { query } from "../../../lib/db"
import TimetableDashboard from "../../components/dashboard/TimetableDashboard"

export default async function TimetablePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // 1. Get enrolled students linked to parent
  const studentRes = await query(`
    SELECT s.id, s."firstName", s."lastName", s."sectionId", c.name as class_name, sec.name as section_name
    FROM "Student" s
    JOIN "ParentStudent" ps ON s.id = ps."studentId"
    LEFT JOIN "Class" c ON s."classId" = c.id
    LEFT JOIN "Section" sec ON s."sectionId" = sec.id
    WHERE ps."parentId" = $1 AND s."admissionStatus" = 'ENROLLED'
  `, [user.id])

  const enrolledStudents = studentRes.rows
  const sectionIds = Array.from(new Set(enrolledStudents.map((s: any) => s.sectionId).filter(Boolean)))

  let timetableEntries: any[] = []

  // 2. Fetch weekly timetable entries for those sections
  if (sectionIds.length > 0) {
    const timetableRes = await query(`
      SELECT t.id, t."sectionId", t."dayOfWeek", t."startTime", t."endTime", t.subject, t.room, u."parentName" as teacher_name
      FROM "TimetableEntry" t
      LEFT JOIN "User" u ON t."teacherId" = u.id
      WHERE t."sectionId" = ANY($1)
      ORDER BY t."dayOfWeek" ASC, t."startTime" ASC
    `, [sectionIds])
    timetableEntries = timetableRes.rows
  }

  // 3. Map timetable entries to students
  const studentsWithTimetable = enrolledStudents.map((student: any) => {
    const studentSchedule = timetableEntries.filter(t => t.sectionId === student.sectionId)
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      class_name: student.class_name,
      section_name: student.section_name,
      timetable: studentSchedule.map(entry => ({
        id: entry.id,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        subject: entry.subject,
        teacher_name: entry.teacher_name,
        room: entry.room
      }))
    }
  })

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6">
      <TimetableDashboard students={studentsWithTimetable} />
    </div>
  )
}
