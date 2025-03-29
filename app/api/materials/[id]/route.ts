import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { getUserFromCookie } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    // Verify the material belongs to a project owned by the user
    if (material.project.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ material })
  } catch (error) {
    console.error("Error getting material:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the material belongs to a project owned by the user
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    if (material.project.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    const updatedMaterial = await prisma.material.update({
      where: { id: params.id },
      data: {
        name,
        quantity,
        unit,
        ordered,
        received,
      },
    })

    return NextResponse.json({ material: updatedMaterial, message: "Material updated successfully" })
  } catch (error) {
    console.error("Error updating material:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the material belongs to a project owned by the user
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: { project: true },
    })

    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 })
    }

    if (material.project.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.material.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Material deleted successfully" })
  } catch (error) {
    console.error("Error deleting material:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

