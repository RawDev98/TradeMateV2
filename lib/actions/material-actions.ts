"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getUserFromCookie } from "@/lib/auth"

// Create a new material
export async function createMaterial(projectId: string, formData: FormData) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Verify project belongs to user
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    const name = formData.get("name") as string
    const quantity = Number.parseFloat(formData.get("quantity") as string) || 0
    const unit = formData.get("unit") as string
    const ordered = formData.get("ordered") === "true"
    const received = formData.get("received") === "true"

    if (!name || quantity <= 0) {
      throw new Error("Name and quantity are required")
    }

    const material = await prisma.material.create({
      data: {
        name,
        quantity,
        unit,
        ordered,
        received,
        projectId,
      },
    })

    revalidatePath(`/projects/${projectId}`)
    return { material }
  } catch (error) {
    console.error("Error creating material:", error)
    return { error: "Failed to create material" }
  }
}

// Update a material
export async function updateMaterial(materialId: string, formData: FormData) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the material with its project to verify ownership
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: { project: true },
    })

    if (!material || material.project.userId !== user.id) {
      throw new Error("Material not found or unauthorized")
    }

    const name = formData.get("name") as string
    const quantity = Number.parseFloat(formData.get("quantity") as string) || 0
    const unit = formData.get("unit") as string
    const ordered = formData.get("ordered") === "true"
    const received = formData.get("received") === "true"

    if (!name || quantity <= 0) {
      throw new Error("Name and quantity are required")
    }

    const updatedMaterial = await prisma.material.update({
      where: { id: materialId },
      data: {
        name,
        quantity,
        unit,
        ordered,
        received,
      },
    })

    revalidatePath(`/projects/${material.projectId}`)
    return { material: updatedMaterial }
  } catch (error) {
    console.error("Error updating material:", error)
    return { error: "Failed to update material" }
  }
}

// Delete a material
export async function deleteMaterial(materialId: string) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the material with its project to verify ownership
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: { project: true },
    })

    if (!material || material.project.userId !== user.id) {
      throw new Error("Material not found or unauthorized")
    }

    const projectId = material.projectId

    await prisma.material.delete({
      where: { id: materialId },
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting material:", error)
    return { error: "Failed to delete material" }
  }
}

// Update material status (ordered/received)
export async function updateMaterialStatus(materialId: string, ordered: boolean, received: boolean) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the material with its project to verify ownership
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      include: { project: true },
    })

    if (!material || material.project.userId !== user.id) {
      throw new Error("Material not found or unauthorized")
    }

    const updatedMaterial = await prisma.material.update({
      where: { id: materialId },
      data: { ordered, received },
    })

    revalidatePath(`/projects/${material.projectId}`)
    return { material: updatedMaterial }
  } catch (error) {
    console.error("Error updating material status:", error)
    return { error: "Failed to update material status" }
  }
}

