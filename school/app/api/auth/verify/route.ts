import prisma from "../../../lib/prisma"
import crypto from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return new Response("Token missing", { status: 400 })
  }

  return new Response("Token received")
}