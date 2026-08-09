import { query } from "../../../../../lib/db"
import { getStaffUser } from "../../../../../lib/adminAuth"

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

// GET: Retrieve exams for a specific section
export async function GET(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sectionId = searchParams.get('sectionId')

    if (!sectionId) {
      return Response.json({ error: "sectionId is required" }, { status: 400 })
    }

    const isAssigned = await checkIsTeacherAssigned(user.id, sectionId)
    if (!isAssigned) {
      return Response.json({ error: "Forbidden: You are not assigned to this section" }, { status: 403 })
    }

    const examsRes = await query(`
      SELECT * FROM "Exam"
      WHERE "sectionId" = $1
      ORDER BY "createdAt" DESC
    `, [sectionId])

    return Response.json({ exams: examsRes.rows })
  } catch (error) {
    console.error("Error fetching exams:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create a new exam header (restricted to Class Teachers)
export async function POST(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { sectionId, name, examDate } = body

    if (!sectionId || !name) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: Only the Class Teacher can create exams for this section" }, { status: 403 })
    }

    const insertRes = await query(`
      INSERT INTO "Exam" ("sectionId", name, "examDate", "createdById")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [sectionId, name, examDate || null, user.id])

    return Response.json({ success: true, exam: insertRes.rows[0] })
  } catch (error: any) {
    console.error("Error creating exam:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE: Delete an exam header (restricted to Class Teachers)
export async function DELETE(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 })
    }

    const examRes = await query('SELECT "sectionId" FROM "Exam" WHERE id = $1', [id])
    if (examRes.rows.length === 0) {
      return Response.json({ error: "Exam not found" }, { status: 404 })
    }

    const sectionId = examRes.rows[0].sectionId
    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: Only the Class Teacher can delete exams for this section" }, { status: 403 })
    }

    await query('DELETE FROM "Exam" WHERE id = $1', [id])

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting exam:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
