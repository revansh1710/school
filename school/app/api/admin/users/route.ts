import { query } from "../../../../lib/db"
import { getStaffUser } from "../../../../lib/adminAuth"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const creator = await getStaffUser()
    if (!creator || (creator.role !== 'ADMIN' && creator.role !== 'SUPER_ADMIN')) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, username, password, role } = body

    if (!name || !email || !username || !password || !role) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Role validation
    if (role === 'ADMIN' && creator.role !== 'SUPER_ADMIN') {
      return Response.json({ error: "Only Super Admins can create new Admins" }, { status: 403 })
    }

    if (role !== 'STAFF' && role !== 'ADMIN') {
      return Response.json({ error: "Invalid role specified" }, { status: 400 })
    }

    // Check if username already exists
    const existing = await query(`SELECT id FROM "User" WHERE username = $1`, [username])
    if (existing.rows.length > 0) {
      return Response.json({ error: "Username/ID already exists" }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const id = randomUUID()

    // Insert user
    await query(`
      INSERT INTO "User" (id, username, email, "parentName", role, "passwordHash", status)
      VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
    `, [id, username, email, name, role, hash])

    return Response.json({ success: true, user: { id, username, name, role } })

  } catch (error) {
    console.error("Error creating user:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
