import prisma from "../app/lib/prisma"
import { cookies } from "next/headers"

export async function getCurrentUser() {

  const cookieStore = await (cookies() as ReturnType<typeof cookies>) // ✅ correct
 // ✅ correct

  const sessionId = cookieStore.get("session")?.value

  if (!sessionId) {
    return null
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    })

    if (!session) {
      return null
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: { id: session.id }
      })
      return null
    }

    return session.user

  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}