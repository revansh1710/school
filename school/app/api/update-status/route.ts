import { sendStatusUpdateMail } from "../../lib/utils/mailService"
import { serverClient } from "../../lib/sanity/serverClient"

export async function POST(req: Request) {
  const body = await req.json()

  console.log("🔥 WEBHOOK BODY:", body)

  const newStatus = body?.status
  const oldStatus = body?.previousStatus
  const email = body?.email
  const parentName = body?.parentName

  if (!newStatus || newStatus === oldStatus) {
    return Response.json({ message: "No status change" })
  }

  await sendStatusUpdateMail({
    to: email,
    parentName,
    status: newStatus
  })

  return Response.json({ success: true })
}