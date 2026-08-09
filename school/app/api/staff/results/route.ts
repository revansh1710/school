import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"

async function checkIsClassTeacher(teacherId: string, sectionId: string): Promise<boolean> {
  const res = await query(`
    SELECT 1 FROM "TeacherSection"
    WHERE "teacherId" = $1 AND "sectionId" = $2 AND "isClassTeacher" = true
  `, [teacherId, sectionId])
  return res.rows.length > 0
}

async function checkIsTeacherAssigned(teacherId: string, sectionId: string): Promise<boolean> {
  const res = await query(`
    SELECT 1 FROM "TeacherSection"
    WHERE "teacherId" = $1 AND "sectionId" = $2
  `, [teacherId, sectionId])
  return res.rows.length > 0
}

// GET: Fetch students and their marks for an exam
export async function GET(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const examId = searchParams.get('examId')

    if (!examId) {
      return Response.json({ error: "examId is required" }, { status: 400 })
    }

    // Resolve exam and section
    const examRes = await query('SELECT "sectionId", name FROM "Exam" WHERE id = $1', [examId])
    if (examRes.rows.length === 0) {
      return Response.json({ error: "Exam not found" }, { status: 404 })
    }

    const sectionId = examRes.rows[0].sectionId
    const isAssigned = await checkIsTeacherAssigned(user.id, sectionId)
    if (!isAssigned) {
      return Response.json({ error: "Forbidden: You are not assigned to this section" }, { status: 403 })
    }

    // Fetch students in this section
    const studentsRes = await query(`
      SELECT id, "firstName", "lastName", "rollNumber"
      FROM "Student"
      WHERE "sectionId" = $1 AND "admissionStatus" = 'ENROLLED'
      ORDER BY "rollNumber" ASC, "firstName" ASC
    `, [sectionId])

    // Fetch existing results for this exam
    const resultsRes = await query(`
      SELECT id, "studentId", "examId", marks, remarks
      FROM "ExamResult"
      WHERE "examId" = $1
    `, [examId])

    return Response.json({
      exam: examRes.rows[0],
      students: studentsRes.rows,
      results: resultsRes.rows
    })

  } catch (error) {
    console.error("Error fetching exam results:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Batch save exam results for students (Class Teacher only)
export async function POST(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { examId, results } = body // results: Array of { studentId, marks: Array<{subject, obtained, max}>, remarks }

    if (!examId || !results || !Array.isArray(results)) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Resolve exam and check section Class Teacher role
    const examRes = await query('SELECT "sectionId" FROM "Exam" WHERE id = $1', [examId])
    if (examRes.rows.length === 0) {
      return Response.json({ error: "Exam not found" }, { status: 404 })
    }

    const sectionId = examRes.rows[0].sectionId
    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: Only the Class Teacher can input exam marks for this section" }, { status: 403 })
    }

    // Process batch insert/update
    for (const record of results) {
      const { studentId, marks, remarks } = record
      if (!studentId || !marks) continue

      // Verify marks format
      const marksJson = JSON.stringify(marks)

      await query(`
        INSERT INTO "ExamResult" ("examId", "studentId", marks, remarks, "createdById")
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT ("examId", "studentId") DO UPDATE SET
          marks = EXCLUDED.marks,
          remarks = EXCLUDED.remarks,
          "createdById" = EXCLUDED."createdById"
      `, [examId, studentId, marksJson, remarks || null, user.id])
    }

    return Response.json({ success: true })

  } catch (error: any) {
    console.error("Error saving exam results:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
