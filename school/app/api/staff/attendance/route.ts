import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"
import { format } from "date-fns"

export async function GET(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const sectionId = searchParams.get('sectionId')
    const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd')

    if (!sectionId) return Response.json({ error: "sectionId required" }, { status: 400 })

    // Fetch students
    const studentsRes = await query(`
      SELECT id, "firstName", "lastName", "rollNumber"
      FROM "Student"
      WHERE "sectionId" = $1 AND "admissionStatus" = 'ENROLLED'
      ORDER BY "rollNumber" ASC
    `, [sectionId])

    // Fetch attendance for the date
    const attRes = await query(`
      SELECT id FROM "Attendance" WHERE "sectionId" = $1 AND date = $2
    `, [sectionId, dateStr])

    let attendanceRecords = []
    let attendanceId = null

    if (attRes.rows.length > 0) {
      attendanceId = attRes.rows[0].id
      const recordsRes = await query(`
        SELECT "studentId", status, remarks
        FROM "AttendanceRecord"
        WHERE "attendanceId" = $1
      `, [attendanceId])
      attendanceRecords = recordsRes.rows
    }

    return Response.json({
      students: studentsRes.rows,
      attendanceId,
      records: attendanceRecords
    })

  } catch (error) {
    console.error("Error fetching attendance:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { sectionId, date, records } = body
    // records: Array of { studentId, status, remarks }

    if (!sectionId || !date || !records) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Upsert Attendance Header
    const attRes = await query(`
      INSERT INTO "Attendance" ("sectionId", date, "recordedById")
      VALUES ($1, $2, $3)
      ON CONFLICT ("sectionId", date) DO UPDATE SET "recordedById" = EXCLUDED."recordedById"
      RETURNING id
    `, [sectionId, date, user.id])
    
    const attendanceId = attRes.rows[0].id

    // 2. Upsert Attendance Records
    for (const record of records) {
      await query(`
        INSERT INTO "AttendanceRecord" ("attendanceId", "studentId", status, remarks)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("attendanceId", "studentId") DO UPDATE SET 
          status = EXCLUDED.status,
          remarks = EXCLUDED.remarks
      `, [attendanceId, record.studentId, record.status, record.remarks])
    }

    return Response.json({ success: true, attendanceId })
  } catch (error) {
    console.error("Error saving attendance:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
