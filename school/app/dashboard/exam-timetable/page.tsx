import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { query } from "../../../lib/db"
import ExamTimetableFeed from "../../components/dashboard/ExamTimetableFeed"

export const dynamic = 'force-dynamic'

export default async function ParentExamTimetablePage() {
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

  let exams: any[] = []
  let timetableEntries: any[] = []

  // 2. Fetch exams and their timetable entries
  if (sectionIds.length > 0) {
    const examsRes = await query(`
      SELECT id, "sectionId", name, "examDate"
      FROM "Exam"
      WHERE "sectionId" = ANY($1)
      ORDER BY "createdAt" DESC
    `, [sectionIds])
    exams = examsRes.rows

    const examIds = exams.map(e => e.id)
    if (examIds.length > 0) {
      const timetableRes = await query(`
        SELECT id, "examId", "sectionId", subject, "examDate", "startTime", "endTime", room
        FROM "ExamTimetableEntry"
        WHERE "examId" = ANY($1)
        ORDER BY "examDate" ASC, "startTime" ASC
      `, [examIds])
      timetableEntries = timetableRes.rows
    }
  }

  // 3. Map exams and schedules to students
  const studentsWithSchedules = enrolledStudents.map((student: any) => {
    const studentExams = exams.filter(e => e.sectionId === student.sectionId)
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      class_name: student.class_name,
      section_name: student.section_name,
      exams: studentExams.map(exam => {
        const schedule = timetableEntries.filter(t => t.examId === exam.id)
        return {
          id: exam.id,
          name: exam.name,
          examDate: exam.examDate ? exam.examDate.toISOString().split('T')[0] : null,
          schedule: schedule.map(s => ({
            id: s.id,
            subject: s.subject,
            examDate: s.examDate.toISOString().split('T')[0],
            startTime: s.startTime,
            endTime: s.endTime,
            room: s.room
          }))
        }
      })
    }
  })

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6">
      <ExamTimetableFeed students={studentsWithSchedules} />
    </div>
  )
}
