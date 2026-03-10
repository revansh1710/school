import prisma from "../../../lib/prisma"
import crypto from "node:crypto"

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return Response.json(
      { error: "Email required" },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return Response.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  const token = crypto.randomBytes(32).toString("hex")

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  await prisma.magicToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    }
  })

  const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

  return Response.json({
    success: true,
    loginLink
  })
}