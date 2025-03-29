import { NextResponse } from "next/server"
import { getUserFromCookie } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error getting user:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

