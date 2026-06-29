import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"

export async function GET() {
  try {
    const user = await getStaffUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.role === 'STAFF') {
      // Get sections assigned to this staff member
      const res = await query(`
        SELECT s.id, s.name, s."classId", c.name as class_name, ts."isClassTeacher", ts.subject
        FROM "TeacherSection" ts
        JOIN "Section" s ON ts."sectionId" = s.id
        JOIN "Class" c ON s."classId" = c.id
        WHERE ts."teacherId" = $1
        ORDER BY c."order", s.name
      `, [user.id])
      
      return Response.json({ sections: res.rows })
    } else if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      const isSuperAdmin = user.role === 'SUPER_ADMIN'
      const res = isSuperAdmin
        ? await query(`
            SELECT s.id, s.name, s."classId", c.name as class_name, true as "isAdminView"
            FROM "Section" s
            JOIN "Class" c ON s."classId" = c.id
            ORDER BY c."order", s.name
          `)
        : await query(`
            SELECT s.id, s.name, s."classId", c.name as class_name, true as "isAdminView"
            FROM "AdminClass" ac
            JOIN "Section" s ON ac."classId" = s."classId"
            JOIN "Class" c ON ac."classId" = c.id
            WHERE ac."adminId" = $1
            ORDER BY c."order", s.name
          `, [user.id])
      
      return Response.json({ sections: res.rows })
    }

    return Response.json({ sections: [] })
  } catch (error) {
    console.error("Error fetching sections:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
