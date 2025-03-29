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

    const notes = await prisma.note.findMany({
      where: {
        projectId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error getting notes:", error)
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
    const content = formData.get("content") as string
    const category = (formData.get("category") as string) || "general"

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        category,
        projectId: params.id,
      },
    })

    return NextResponse.json({ note, message: "Note created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

