import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"
import bcrypt from "bcrypt"

export async function GET() {
  try {
    const user = await getStaffUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user details
    const userRes = await query(`
      SELECT id, username, "parentName" as name, email, phone, role
      FROM "User"
      WHERE id = $1
    `, [user.id])

    if (userRes.rows.length === 0) return Response.json({ error: "User not found" }, { status: 404 })

    let subjects = []

    // If STAFF, fetch their assigned subjects
    if (user.role === 'STAFF') {
      const subRes = await query(`
        SELECT c.name as class_name, s.name as section_name, ts.subject, ts."isClassTeacher"
        FROM "TeacherSection" ts
        JOIN "Section" s ON ts."sectionId" = s.id
        JOIN "Class" c ON s."classId" = c.id
        WHERE ts."teacherId" = $1
        ORDER BY c."order" ASC, s.name ASC
      `, [user.id])
      subjects = subRes.rows
    }

    return Response.json({
      profile: userRes.rows[0],
      subjects
    })

  } catch (error) {
    console.error("Error fetching profile:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getStaffUser()
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, phone, password } = body

    let updateQuery = `UPDATE "User" SET "parentName" = $1, email = $2, phone = $3`
    const values = [name, email || null, phone || null]
    let paramIndex = 4

    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      updateQuery += `, "passwordHash" = $${paramIndex}`
      values.push(hash)
      paramIndex++
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING id, username, "parentName" as name, email, phone, role`
    values.push(user.id)

    const updateRes = await query(updateQuery, values)

    return Response.json({ success: true, profile: updateRes.rows[0] })

  } catch (error) {
    console.error("Error updating profile:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
