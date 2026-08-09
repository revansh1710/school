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

// GET: Retrieve timetable entries for an exam
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

    // Get section of the exam
    const examRes = await query('SELECT "sectionId" FROM "Exam" WHERE id = $1', [examId])
    if (examRes.rows.length === 0) {
      return Response.json({ error: "Exam not found" }, { status: 404 })
    }

    const sectionId = examRes.rows[0].sectionId
    const isAssigned = await checkIsTeacherAssigned(user.id, sectionId)
    if (!isAssigned) {
      return Response.json({ error: "Forbidden: You are not assigned to this section" }, { status: 403 })
    }

    const entriesRes = await query(`
      SELECT * FROM "ExamTimetableEntry"
      WHERE "examId" = $1
      ORDER BY "examDate" ASC, "startTime" ASC
    `, [examId])

    return Response.json({ entries: entriesRes.rows })
  } catch (error) {
    console.error("Error fetching exam timetable:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Add a new exam timetable slot (Class Teacher only)
export async function POST(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { examId, subject, examDate, startTime, endTime, room } = body

    if (!examId || !subject || !examDate || !startTime || !endTime) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Resolve exam section
    const examRes = await query('SELECT "sectionId" FROM "Exam" WHERE id = $1', [examId])
    if (examRes.rows.length === 0) {
      return Response.json({ error: "Exam not found" }, { status: 404 })
    }

    const sectionId = examRes.rows[0].sectionId
    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: Only the Class Teacher can manage the exam timetable" }, { status: 403 })
    }

    if (startTime >= endTime) {
      return Response.json({ error: "Start time must be before end time" }, { status: 400 })
    }

    try {
      const insertRes = await query(`
        INSERT INTO "ExamTimetableEntry" ("examId", "sectionId", "subject", "examDate", "startTime", "endTime", "room")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [examId, sectionId, subject, examDate, startTime, endTime, room || null])

      return Response.json({ success: true, entry: insertRes.rows[0] })
    } catch (dbErr: any) {
      if (dbErr.code === '23505') {
        return Response.json({ error: "This subject already has a scheduled slot in this exam." }, { status: 400 })
      }
      throw dbErr
    }

  } catch (error: any) {
    console.error("Error creating exam timetable slot:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// PUT: Update an exam timetable slot (Class Teacher only)
export async function PUT(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, subject, examDate, startTime, endTime, room } = body

    if (!id || !subject || !examDate || !startTime || !endTime) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Resolve slot section
    const slotRes = await query('SELECT "sectionId" FROM "ExamTimetableEntry" WHERE id = $1', [id])
    if (slotRes.rows.length === 0) {
      return Response.json({ error: "Timetable entry not found" }, { status: 404 })
    }

    const sectionId = slotRes.rows[0].sectionId
    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: Only the Class Teacher can manage the exam timetable" }, { status: 403 })
    }

    if (startTime >= endTime) {
      return Response.json({ error: "Start time must be before end time" }, { status: 400 })
    }

    try {
      const updateRes = await query(`
        UPDATE "ExamTimetableEntry"
        SET "subject" = $1, "examDate" = $2, "startTime" = $3, "endTime" = $4, "room" = $5
        WHERE id = $6
        RETURNING *
      `, [subject, examDate, startTime, endTime, room || null, id])

      return Response.json({ success: true, entry: updateRes.rows[0] })
    } catch (dbErr: any) {
      if (dbErr.code === '23505') {
        return Response.json({ error: "This subject already has a scheduled slot in this exam." }, { status: 400 })
      }
      throw dbErr
    }

  } catch (error: any) {
    console.error("Error updating exam timetable slot:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE: Remove an exam timetable slot (Class Teacher only)
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

    // Resolve slot section
    const slotRes = await query('SELECT "sectionId" FROM "ExamTimetableEntry" WHERE id = $1', [id])
    if (slotRes.rows.length === 0) {
      return Response.json({ error: "Timetable entry not found" }, { status: 404 })
    }

    const sectionId = slotRes.rows[0].sectionId
    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: Only the Class Teacher can manage the exam timetable" }, { status: 403 })
    }

    await query('DELETE FROM "ExamTimetableEntry" WHERE id = $1', [id])

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting exam timetable slot:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
