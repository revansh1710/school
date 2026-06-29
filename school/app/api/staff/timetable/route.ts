import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"

async function checkIsClassTeacher(teacherId: string, sectionId: string): Promise<boolean> {
  const res = await query(`
    SELECT 1 FROM "TeacherSection"
    WHERE "teacherId" = $1 AND "sectionId" = $2 AND "isClassTeacher" = true
  `, [teacherId, sectionId])
  return res.rows.length > 0
}

// GET: Retrieve timetable entries for the teacher's managed section
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

    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: You are not the class teacher for this section" }, { status: 403 })
    }

    const timetableRes = await query(`
      SELECT t.id, t."sectionId", t."dayOfWeek", t."startTime", t."endTime", t.subject, t.room, t."teacherId", u."parentName" as teacher_name
      FROM "TimetableEntry" t
      LEFT JOIN "User" u ON t."teacherId" = u.id
      WHERE t."sectionId" = $1
      ORDER BY t."dayOfWeek" ASC, t."startTime" ASC
    `, [sectionId])

    return Response.json({ timetable: timetableRes.rows })
  } catch (error) {
    console.error("Error fetching staff timetable:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Add a new timetable slot
export async function POST(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { sectionId, dayOfWeek, startTime, endTime, subject, teacherId, room } = body

    if (!sectionId || !dayOfWeek || !startTime || !endTime || !subject) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: You are not the class teacher for this section" }, { status: 403 })
    }

    // Verify time logic
    if (startTime >= endTime) {
      return Response.json({ error: "Start time must be before end time" }, { status: 400 })
    }

    try {
      const insertRes = await query(`
        INSERT INTO "TimetableEntry" ("sectionId", "dayOfWeek", "startTime", "endTime", "subject", "teacherId", "room")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [sectionId, dayOfWeek, startTime, endTime, subject, teacherId || null, room || null])

      return Response.json({ success: true, entry: insertRes.rows[0] })
    } catch (dbErr: any) {
      if (dbErr.code === '23505') {
        return Response.json({ error: "A slot already starts at this time on this day for this section." }, { status: 400 })
      }
      throw dbErr;
    }
  } catch (error: any) {
    console.error("Error creating timetable entry:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// PUT: Update an existing timetable slot
export async function PUT(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || user.role !== 'STAFF') {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, dayOfWeek, startTime, endTime, subject, teacherId, room } = body

    if (!id || !dayOfWeek || !startTime || !endTime || !subject) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Retrieve entry to verify section ownership
    const entryRes = await query('SELECT "sectionId" FROM "TimetableEntry" WHERE id = $1', [id])
    if (entryRes.rows.length === 0) {
      return Response.json({ error: "Timetable entry not found" }, { status: 404 })
    }

    const sectionId = entryRes.rows[0].sectionId
    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: You are not the class teacher for this section" }, { status: 403 })
    }

    // Verify time logic
    if (startTime >= endTime) {
      return Response.json({ error: "Start time must be before end time" }, { status: 400 })
    }

    try {
      const updateRes = await query(`
        UPDATE "TimetableEntry"
        SET "dayOfWeek" = $1, "startTime" = $2, "endTime" = $3, "subject" = $4, "teacherId" = $5, "room" = $6
        WHERE id = $7
        RETURNING *
      `, [dayOfWeek, startTime, endTime, subject, teacherId || null, room || null, id])

      return Response.json({ success: true, entry: updateRes.rows[0] })
    } catch (dbErr: any) {
      if (dbErr.code === '23505') {
        return Response.json({ error: "A slot already starts at this time on this day for this section." }, { status: 400 })
      }
      throw dbErr;
    }
  } catch (error: any) {
    console.error("Error updating timetable entry:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

// DELETE: Remove a timetable slot
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

    // Retrieve entry to verify section ownership
    const entryRes = await query('SELECT "sectionId" FROM "TimetableEntry" WHERE id = $1', [id])
    if (entryRes.rows.length === 0) {
      return Response.json({ error: "Timetable entry not found" }, { status: 404 })
    }

    const sectionId = entryRes.rows[0].sectionId
    const isClassTeacher = await checkIsClassTeacher(user.id, sectionId)
    if (!isClassTeacher) {
      return Response.json({ error: "Forbidden: You are not the class teacher for this section" }, { status: 403 })
    }

    await query('DELETE FROM "TimetableEntry" WHERE id = $1', [id])

    return Response.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting timetable entry:", error)
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
