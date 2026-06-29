import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_key_for_jwt_auth_123"
)

export interface StaffPayload {
  id: string
  username: string
  role: string
  name: string
}

export async function signStaffToken(payload: StaffPayload): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET)
  return jwt
}

export async function verifyStaffToken(token: string): Promise<StaffPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as StaffPayload
  } catch (error) {
    return null
  }
}

export async function getStaffUser(): Promise<StaffPayload | null> {
  const cookieStore = await (cookies() as ReturnType<typeof cookies>)
  const token = cookieStore.get("staff_session")?.value

  if (!token) {
    return null
  }

  const payload = await verifyStaffToken(token)
  return payload
}
