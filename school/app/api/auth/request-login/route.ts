import { query } from "../../../../lib/db"
import { User } from "../../../../lib/types"
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

  const userRes = await query('SELECT * FROM "User" WHERE email = $1', [email])
  let user: User | undefined = userRes.rows[0]

  if (!user) {
    const insertRes = await query(
      'INSERT INTO "User" (email, "parentName") VALUES ($1, $2) RETURNING *',
      [email, enquiry.parentName]
    )
    user = insertRes.rows[0] as User
  }

  await query('DELETE FROM "MagicToken" WHERE "userId" = $1', [user.id])

  const token = crypto.randomBytes(32).toString("hex")

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  await query(
    'INSERT INTO "MagicToken" ("tokenHash", "userId", "expiresAt") VALUES ($1, $2, $3)',
    [tokenHash, user.id, new Date(Date.now() + 15 * 60 * 1000)]
  )

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