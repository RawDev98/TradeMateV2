import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromCookie } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Verify the task belongs to a project owned by the user
    if (task.project.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error getting task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the task belongs to a project owned by the user
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (task.project.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null
    const assignedTo = formData.get("assignedTo") as string
    const notes = formData.get("notes") as string

    if (!title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 })
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: {
        title,
        description,
        status,
        dueDate,
        assignedTo,
        notes,
      },
    })

    return NextResponse.json({ task: updatedTask, message: "Task updated successfully" })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the task belongs to a project owned by the user
    const task = await prisma.task.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (task.project.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.task.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

