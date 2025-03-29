import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromCookie } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error getting tasks:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = (formData.get("status") as string) || "not-started"
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null
    const assignedTo = formData.get("assignedTo") as string
    const notes = formData.get("notes") as string

    if (!title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
        assignedTo,
        notes,
        projectId: params.id,
      },
    })

    return NextResponse.json({ task, message: "Task created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

