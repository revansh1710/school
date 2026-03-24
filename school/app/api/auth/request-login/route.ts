import prisma from "../../../lib/prisma"
import crypto from "crypto"
import { client as sanityClient } from "@/sanity/lib/client"
import { sendMagicLoginMail } from "../../../lib/utils/mailService"

export async function POST(req: Request) {

  const body = await req.json()
  const email = body.email?.toLowerCase()

  if (!email) {
    return Response.json(
      { error: "Email required" },
      { status: 400 }
    )
  }

  // 1. Check Sanity (source of truth)

  const enquiry = await sanityClient.fetch(
    `*[_type == "admissionEnquiry" && email == $email][0]`,
    { email }
  )

  if (!enquiry) {
    return Response.json(
      { error: "Email not registered with admissions" },
      { status: 404 }
    )
  }

  // 2. Ensure auth user exists

  let user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        parentName: enquiry.parentName
      }
    })
  }

  // 3. Remove previous tokens

  await prisma.magicToken.deleteMany({
    where: { userId: user.id }
  })

  // 4. Generate token

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

  // 5. Send login email

  const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`

  await sendMagicLoginMail({
    to: user.email,
    name: user.parentName || "Parent",
    loginLink
  })

  return Response.json({
    success: true,
    message: "Login link sent"
  })
}