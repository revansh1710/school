import { NextResponse } from "next/server"
import { serverClient } from "../../../lib/sanity/serverClient"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const stats = await serverClient.fetch(`{
      "total": count(*[_type == "admissionEnquiry"]),
      "active": count(*[_type == "admissionEnquiry" && status != "rejected" && status != "withdrawn"]),
      "accepted": count(*[_type == "admissionEnquiry" && status == "accepted"])
    }`)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch admission stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch admission stats" },
      { status: 500 }
    )
  }
}
