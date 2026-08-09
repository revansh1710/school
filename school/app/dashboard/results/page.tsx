import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { query } from "../../../lib/db"
import ResultsFeed from "../../components/dashboard/ResultsFeed"

export const dynamic = 'force-dynamic'

export default async function ParentResultsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // 1. Get enrolled students linked to parent
  const studentRes = await query(`
    SELECT s.id, s."firstName", s."lastName", s."sectionId", s."rollNumber", c.name as class_name, sec.name as section_name
    FROM "Student" s
    JOIN "ParentStudent" ps ON s.id = ps."studentId"
    LEFT JOIN "Class" c ON s."classId" = c.id
    LEFT JOIN "Section" sec ON s."sectionId" = sec.id
    WHERE ps."parentId" = $1 AND s."admissionStatus" = 'ENROLLED'
  `, [user.id])

  const enrolledStudents = studentRes.rows
  const sectionIds = Array.from(new Set(enrolledStudents.map((s: any) => s.sectionId).filter(Boolean)))

  let examResults: any[] = []

  // 2. Fetch exam results for those sections
  if (sectionIds.length > 0) {
    const resultsRes = await query(`
      SELECT er.id, er."studentId", er."examId", er.marks, er.remarks, e.name as exam_name, e."examDate", er."createdAt"
      FROM "ExamResult" er
      JOIN "Exam" e ON er."examId" = e.id
      WHERE e."sectionId" = ANY($1)
      ORDER BY e."createdAt" DESC
    `, [sectionIds])
    examResults = resultsRes.rows
  }

  // 3. Map results to students
  const studentsWithResults = enrolledStudents.map((student: any) => {
    const studentResults = examResults.filter(r => r.studentId === student.id)
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      rollNumber: student.rollNumber,
      class_name: student.class_name,
      section_name: student.section_name,
      results: studentResults.map(r => ({
        id: r.id,
        examId: r.examId,
        examName: r.exam_name,
        examDate: r.examDate ? r.examDate.toISOString().split('T')[0] : null,
        marks: Array.isArray(r.marks) ? r.marks : [],
        remarks: r.remarks || '',
        createdAt: r.createdAt.toISOString()
      }))
    }
  })

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6">
      <ResultsFeed students={studentsWithResults} />
    </div>
  )
}
