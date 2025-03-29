import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET() {
  try {
    // Attempt to query the database
    const userCount = await prisma.user.count()

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      userCount,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

