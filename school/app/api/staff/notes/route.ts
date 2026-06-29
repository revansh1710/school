import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"

async function checkIsTeacherAssigned(teacherId: string, sectionId: string): Promise<boolean> {
  const res = await query(`
    SELECT 1 FROM "TeacherSection"
    WHERE "teacherId" = $1 AND "sectionId" = $2
  `, [teacherId, sectionId])
  return res.rows.length > 0
}

async function checkCanModifyNote(teacherId: string, noteId: string): Promise<boolean> {
  // Fetch note
  const noteRes = await query('SELECT "teacherId", "sectionId" FROM "ClassNote" WHERE id = $1', [noteId])
  if (noteRes.rows.length === 0) return false

  const { teacherId: creatorId, sectionId } = noteRes.rows[0]

  // If creator, allow
  if (creatorId === teacherId) return true

  // If class teacher of that section, allow
  const classTeacherRes = await query(`
    SELECT 1 FROM "TeacherSection"
    WHERE "teacherId" = $1 AND "sectionId" = $2 AND "isClassTeacher" = true
  `, [teacherId, sectionId])
  
  return classTeacherRes.rows.length > 0
}

// GET: Retrieve notes for a specific section
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

    const notesRes = await query(`
      SELECT cn.*, u."parentName" as teacher_name
      FROM "ClassNote" cn
      LEFT JOIN "User" u ON cn."teacherId" = u.id
      WHERE cn."sectionId" = $1
      ORDER BY cn."createdAt" DESC
    `, [sectionId])

    return Response.json({ notes: notesRes.rows })
  } catch (error) {
    console.error("Error fetching class notes:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Add a new class note
export async function POST(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { sectionId, subject, title, content, fileUrl } = body

    if (!sectionId || !subject || !title || !content) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isAssigned = await checkIsTeacherAssigned(user.id, sectionId)
    if (!isAssigned) {
      return Response.json({ error: "Forbidden: You are not assigned to this section" }, { status: 403 })
    }

    const insertRes = await query(`
      INSERT INTO "ClassNote" ("sectionId", "teacherId", "subject", "title", "content", "fileUrl")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [sectionId, user.id, subject, title, content, fileUrl || null])

    return Response.json({ success: true, note: insertRes.rows[0] })
  } catch (error: any) {
    console.error("Error creating class note:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// PUT: Update an existing class note
export async function PUT(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, subject, title, content, fileUrl } = body

    if (!id || !subject || !title || !content) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const canModify = await checkCanModifyNote(user.id, id)
    if (!canModify) {
      return Response.json({ error: "Forbidden: You do not have permission to modify this note" }, { status: 403 })
    }

    const updateRes = await query(`
      UPDATE "ClassNote"
      SET "subject" = $1, "title" = $2, "content" = $3, "fileUrl" = $4
      WHERE id = $5
      RETURNING *
    `, [subject, title, content, fileUrl || null, id])

    return Response.json({ success: true, note: updateRes.rows[0] })
  } catch (error: any) {
    console.error("Error updating class note:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE: Remove a class note
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

    const canModify = await checkCanModifyNote(user.id, id)
    if (!canModify) {
      return Response.json({ error: "Forbidden: You do not have permission to delete this note" }, { status: 403 })
    }

    await query('DELETE FROM "ClassNote" WHERE id = $1', [id])

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting class note:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
