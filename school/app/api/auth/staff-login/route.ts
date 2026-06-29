import { query } from "../../../../lib/db"
import bcrypt from "bcrypt"
import { signStaffToken } from "../../../../lib/adminAuth"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return Response.json(
        { error: "Username and password required" },
        { status: 400 }
      )
    }

    const userRes = await query('SELECT * FROM "User" WHERE username = $1', [username])
    
    if (userRes.rows.length === 0) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const user = userRes.rows[0]

    if (user.role !== 'ADMIN' && user.role !== 'STAFF' && user.role !== 'SUPER_ADMIN') {
      return Response.json({ error: "Access denied. Invalid role." }, { status: 403 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValid) {
      return Response.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const token = await signStaffToken({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.parentName || user.username
    })

    const cookieStore = await (cookies() as ReturnType<typeof cookies>)
    cookieStore.set("staff_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60, // 8 hours
      path: "/"
    })

    return Response.json({ success: true, role: user.role })

  } catch (error) {
    console.error("Staff login error:", error)
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
