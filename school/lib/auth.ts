import { query } from "./db"
import { User, Session } from "./types"
import { cookies } from "next/headers"

export async function getCurrentUser(): Promise<User | null> {

  const cookieStore = await (cookies() as ReturnType<typeof cookies>) // ✅ correct
 // ✅ correct

  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) {
    return null
  }

  try {
    const sessionRes = await query('SELECT * FROM "Session" WHERE id = $1', [sessionId])
    
    if (sessionRes.rows.length === 0) {
      return null
    }
    
    const session = sessionRes.rows[0] as Session

    if (session.expiresAt < new Date()) {
      await query('DELETE FROM "Session" WHERE id = $1', [session.id])
      return null
    }

    const userRes = await query('SELECT * FROM "User" WHERE id = $1', [session.userId])
    if (userRes.rows.length === 0) {
      return null
    }

    return userRes.rows[0] as User

  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}