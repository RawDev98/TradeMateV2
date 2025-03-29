import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromCookie } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        tasks: true,
        materials: true,
        notes: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error getting project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const project = await prisma.project.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        name,
        clientName,
        location,
        description,
        budget,
        startDate,
        endDate,
      },
    })

    return NextResponse.json({ project, message: "Project updated successfully" })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.project.delete({
      where: {
        id: params.id,
        userId: user.id,
      },
    })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

