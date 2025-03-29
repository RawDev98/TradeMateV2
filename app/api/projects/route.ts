import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromCookie } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Error getting projects:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const clientName = formData.get("clientName") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const budget = Number.parseFloat(formData.get("budget") as string) || 0
    const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null
    const endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        name,
        clientName,
        location,
        description,
        budget,
        startDate,
        endDate,
        userId: user.id,
      },
    })

    return NextResponse.json({ project, message: "Project created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

