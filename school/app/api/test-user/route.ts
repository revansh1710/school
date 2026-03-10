import prisma  from "../../lib/prisma"

export async function GET() {
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      parentName: "John Doe"
    }
  })

  const safeUser = {
    id: user.id,
    email: user.email,
    parentName: user.parentName,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt
  }

  return Response.json({
    success: true,
    user: safeUser
  })
}