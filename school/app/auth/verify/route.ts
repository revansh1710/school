import { NextResponse } from "next/server"
import { query } from "../../../lib/db"
import { MagicToken, Session } from "../../../lib/types"
import crypto from "crypto"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  const { rows: tokenRows } = await query('SELECT * FROM "MagicToken" WHERE "tokenHash" = $1 LIMIT 1', [tokenHash])
  const tokenRecord = tokenRows[0] as MagicToken | undefined

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 })
  }

  // mark used
  await query('UPDATE "MagicToken" SET used = true WHERE id = $1', [tokenRecord.id])

  // create session
  const sessionId = crypto.randomUUID()
  const { rows: sessionRows } = await query(
    'INSERT INTO "Session" (id, "userId", "expiresAt") VALUES ($1, $2, $3) RETURNING *',
    [sessionId, tokenRecord.userId, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  )
  const session = sessionRows[0] as Session

  // ✅ THIS IS THE FIX
  const response = NextResponse.redirect(new URL("/dashboard", req.url))

  response.cookies.set("session", session.id, {
    httpOnly: true,
    secure: false, // true in production
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  })

  return response
}