import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"

export async function GET() {
  try {
    const user = await getStaffUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Get all staff members available to be assigned
    const staffRes = await query(`
      SELECT id, username, "parentName" as name
      FROM "User"
      WHERE role = 'STAFF' AND status = 'ACTIVE'
      ORDER BY username ASC
    `)

    // 2. Get all classes managed by this admin (or all classes for SUPER_ADMIN)
    const isSuperAdmin = user.role === 'SUPER_ADMIN'
    const classesRes = isSuperAdmin
      ? await query(`
          SELECT c.id, c.name, c."order"
          FROM "Class" c
          ORDER BY c."order" ASC
        `)
      : await query(`
          SELECT c.id, c.name, c."order"
          FROM "AdminClass" ac
          JOIN "Class" c ON ac."classId" = c.id
          WHERE ac."adminId" = $1
          ORDER BY c."order" ASC
        `, [user.id])

    // 3. Get all sections for those classes, including current assignments
    const sectionsRes = isSuperAdmin
      ? await query(`
          SELECT s.id, s."classId", s.name as section_name, 
                 ts.id as assignment_id, ts."teacherId", ts."isClassTeacher", ts.subject,
                 u.username as teacher_username, u."parentName" as teacher_name
          FROM "Section" s
          LEFT JOIN "TeacherSection" ts ON s.id = ts."sectionId"
          LEFT JOIN "User" u ON ts."teacherId" = u.id
          ORDER BY s.name ASC
        `)
      : await query(`
          SELECT s.id, s."classId", s.name as section_name, 
                 ts.id as assignment_id, ts."teacherId", ts."isClassTeacher", ts.subject,
                 u.username as teacher_username, u."parentName" as teacher_name
          FROM "Section" s
          JOIN "AdminClass" ac ON s."classId" = ac."classId"
          LEFT JOIN "TeacherSection" ts ON s.id = ts."sectionId"
          LEFT JOIN "User" u ON ts."teacherId" = u.id
          WHERE ac."adminId" = $1
          ORDER BY s.name ASC
        `, [user.id])

    // Group sections by class
    const classes = classesRes.rows.map(c => {
      const classSections = sectionsRes.rows.filter(s => s.classId === c.id)
      
      // Group assignments by section
      const sectionsMap = new Map()
      classSections.forEach(row => {
        if (!sectionsMap.has(row.id)) {
          sectionsMap.set(row.id, {
            id: row.id,
            name: row.section_name,
            assignments: []
          })
        }
        if (row.assignment_id) {
          sectionsMap.get(row.id).assignments.push({
            id: row.assignment_id,
            teacherId: row.teacherId,
            teacherUsername: row.teacher_username,
            teacherName: row.teacher_name,
            isClassTeacher: row.isClassTeacher,
            subject: row.subject
          })
        }
      })

      return {
        ...c,
        sections: Array.from(sectionsMap.values())
      }
    })

    let admins: any[] = []
    let adminAssignments: any[] = []

    if (isSuperAdmin) {
      const adminsRes = await query(`
        SELECT id, username, "parentName" as name
        FROM "User"
        WHERE role = 'ADMIN' AND status = 'ACTIVE'
        ORDER BY username ASC
      `)
      admins = adminsRes.rows

      const adminAssignmentsRes = await query(`
        SELECT ac.id, ac."adminId", ac."classId", u.username as admin_username, u."parentName" as admin_name
        FROM "AdminClass" ac
        JOIN "User" u ON ac."adminId" = u.id
        ORDER BY u.username ASC
      `)
      adminAssignments = adminAssignmentsRes.rows
    }

    return Response.json({
      staff: staffRes.rows,
      classes,
      isSuperAdmin,
      admins,
      adminAssignments
    })

  } catch (error) {
    console.error("Error fetching assignments:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { action, assignmentId, sectionId, teacherId, isClassTeacher, subject, adminId, classId } = body

    if (action === 'ADD') {
      // If adding a class teacher, we should ensure there isn't already one, or we just UPSERT.
      // Since our constraint is unique(teacherId, sectionId), a teacher can't be assigned twice to the same section.
      
      const res = await query(`
        INSERT INTO "TeacherSection" ("teacherId", "sectionId", "isClassTeacher", subject)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("teacherId", "sectionId") 
        DO UPDATE SET "isClassTeacher" = EXCLUDED."isClassTeacher", subject = EXCLUDED.subject
        RETURNING id
      `, [teacherId, sectionId, isClassTeacher || false, subject || 'General'])
      
      return Response.json({ success: true, assignmentId: res.rows[0].id })
    } 
    
    else if (action === 'DELETE') {
      if (!assignmentId) return Response.json({ error: "assignmentId required" }, { status: 400 })
      
      if (user.role !== 'SUPER_ADMIN') {
        // Verify this assignment belongs to a class the admin manages
        const verifyRes = await query(`
          SELECT ts.id 
          FROM "TeacherSection" ts
          JOIN "Section" s ON ts."sectionId" = s.id
          JOIN "AdminClass" ac ON s."classId" = ac."classId"
          WHERE ts.id = $1 AND ac."adminId" = $2
        `, [assignmentId, user.id])

        if (verifyRes.rows.length === 0) {
          return Response.json({ error: "Unauthorized to delete this assignment" }, { status: 403 })
        }
      }

      await query(`DELETE FROM "TeacherSection" WHERE id = $1`, [assignmentId])
      return Response.json({ success: true })
    }

    else if (action === 'ADD_ADMIN_CLASS') {
      if (user.role !== 'SUPER_ADMIN') {
        return Response.json({ error: "Unauthorized" }, { status: 403 })
      }
      if (!adminId || !classId) {
        return Response.json({ error: "adminId and classId required" }, { status: 400 })
      }
      
      const res = await query(`
        INSERT INTO "AdminClass" ("adminId", "classId")
        VALUES ($1, $2)
        ON CONFLICT ("adminId", "classId") DO NOTHING
        RETURNING id
      `, [adminId, classId])
      
      const newId = res.rows[0]?.id || null
      return Response.json({ success: true, assignmentId: newId })
    }

    else if (action === 'DELETE_ADMIN_CLASS') {
      if (user.role !== 'SUPER_ADMIN') {
        return Response.json({ error: "Unauthorized" }, { status: 403 })
      }
      if (!assignmentId) {
        return Response.json({ error: "assignmentId required" }, { status: 400 })
      }

      await query(`DELETE FROM "AdminClass" WHERE id = $1`, [assignmentId])
      return Response.json({ success: true })
    }

    return Response.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating assignments:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
