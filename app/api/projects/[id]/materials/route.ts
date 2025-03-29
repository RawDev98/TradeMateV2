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

    const materials = await prisma.material.findMany({
      where: {
        projectId: params.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ materials })
  } catch (error) {
    console.error("Error getting materials:", error)
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
    const name = formData.get("name") as string
    const quantity = Number.parseFloat(formData.get("quantity") as string) || 0
    const unit = formData.get("unit") as string
    const ordered = formData.get("ordered") === "true"
    const received = formData.get("received") === "true"

    if (!name || quantity <= 0) {
      return NextResponse.json({ error: "Name and quantity are required" }, { status: 400 })
    }

    const material = await prisma.material.create({
      data: {
        name,
        quantity,
        unit,
        ordered,
        received,
        projectId: params.id,
      },
    })

    return NextResponse.json({ material, message: "Material created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating material:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

