import { getCurrentUser } from "../../../lib/auth"
import { redirect } from "next/navigation"
import { query } from "../../../lib/db"
import NotesFeed from "../../components/dashboard/NotesFeed"

export const dynamic = 'force-dynamic'

export default async function ParentNotesPage() {
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

  let classNotes: any[] = []

  // 2. Fetch class notes for those sections
  if (sectionIds.length > 0) {
    const notesRes = await query(`
      SELECT cn.id, cn."sectionId", cn.subject, cn.title, cn.content, cn."fileUrl", cn."createdAt", u."parentName" as teacher_name
      FROM "ClassNote" cn
      LEFT JOIN "User" u ON cn."teacherId" = u.id
      WHERE cn."sectionId" = ANY($1)
      ORDER BY cn."createdAt" DESC
    `, [sectionIds])
    classNotes = notesRes.rows
  }

  // 3. Map notes to students
  const studentsWithNotes = enrolledStudents.map((student: any) => {
    const studentNotes = classNotes.filter(n => n.sectionId === student.sectionId)
    return {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      class_name: student.class_name,
      section_name: student.section_name,
      notes: studentNotes.map(n => ({
        id: n.id,
        subject: n.subject,
        title: n.title,
        content: n.content,
        fileUrl: n.fileUrl,
        createdAt: n.createdAt.toISOString(),
        teacher_name: n.teacher_name
      }))
    }
  })

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6">
      <NotesFeed students={studentsWithNotes} />
    </div>
  )
}
