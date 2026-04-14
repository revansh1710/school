import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
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

  const tokenRecord = await prisma.magicToken.findFirst({
    where: { tokenHash }
  })

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 400 })
  }

  // mark used
  await prisma.magicToken.update({
    where: { id: tokenRecord.id },
    data: { used: true }
  })

  // create session
  const session = await prisma.session.create({
    data: {
      id: crypto.randomUUID(),
      userId: tokenRecord.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  })

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