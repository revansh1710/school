import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.set("staff_session", "", {
      maxAge: 0,
      path: "/"
    })
    return Response.json({ success: true })
  } catch (error) {
    console.error("Staff logout error:", error)
    return Response.json(
      { error: "Logout Failed" },
      { status: 500 }
    )
  }
}
