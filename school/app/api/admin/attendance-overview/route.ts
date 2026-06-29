import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"
import { format } from "date-fns"

export async function GET(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd')

    // Get all sections for classes managed by this admin (or all sections for SUPER_ADMIN), and check if attendance exists for date
    const isSuperAdmin = user.role === 'SUPER_ADMIN'
    const res = isSuperAdmin
      ? await query(`
          SELECT s.id as section_id, s.name as section_name, c.name as class_name, 
                 a.id as attendance_id, u."parentName" as recorded_by_name
          FROM "Section" s
          JOIN "Class" c ON s."classId" = c.id
          LEFT JOIN "Attendance" a ON s.id = a."sectionId" AND a.date = $1
          LEFT JOIN "User" u ON a."recordedById" = u.id
          ORDER BY c."order" ASC, s.name ASC
        `, [dateStr])
      : await query(`
          SELECT s.id as section_id, s.name as section_name, c.name as class_name, 
                 a.id as attendance_id, u."parentName" as recorded_by_name
          FROM "Section" s
          JOIN "Class" c ON s."classId" = c.id
          JOIN "AdminClass" ac ON c.id = ac."classId"
          LEFT JOIN "Attendance" a ON s.id = a."sectionId" AND a.date = $2
          LEFT JOIN "User" u ON a."recordedById" = u.id
          WHERE ac."adminId" = $1
          ORDER BY c."order" ASC, s.name ASC
        `, [user.id, dateStr])

    const overview = res.rows.map(row => ({
      sectionId: row.section_id,
      sectionName: row.section_name,
      className: row.class_name,
      isCompleted: !!row.attendance_id,
      recordedBy: row.recorded_by_name
    }))

    return Response.json({ date: dateStr, overview })

  } catch (error) {
    console.error("Error fetching attendance overview:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
