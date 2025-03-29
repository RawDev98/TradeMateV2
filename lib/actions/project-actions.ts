"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getUserFromCookie } from "@/lib/auth"

// Get all projects for a user
export async function getProjects() {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return { projects }
  } catch (error) {
    console.error("Error getting projects:", error)
    return { error: "Failed to get projects" }
  }
}

// Get a single project with all related data
export async function getProject(projectId: string) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: user.id,
      },
      include: {
        tasks: true,
        materials: true,
        notes: true,
      },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    return { project }
  } catch (error) {
    console.error("Error getting project:", error)
    return { error: "Failed to get project" }
  }
}

// Create a new project
export async function createProject(formData: FormData) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const clientName = formData.get("clientName") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const budget = Number.parseFloat(formData.get("budget") as string) || 0
    const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null
    const endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null

    if (!name) {
      throw new Error("Project name is required")
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

    revalidatePath("/projects")
    return { project }
  } catch (error) {
    console.error("Error creating project:", error)
    return { error: "Failed to create project" }
  }
}

// Update a project
export async function updateProject(projectId: string, formData: FormData) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const name = formData.get("name") as string
    const clientName = formData.get("clientName") as string
    const location = formData.get("location") as string
    const description = formData.get("description") as string
    const budget = Number.parseFloat(formData.get("budget") as string) || 0
    const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null
    const endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null

    if (!name) {
      throw new Error("Project name is required")
    }

    const project = await prisma.project.update({
      where: {
        id: projectId,
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

    revalidatePath(`/projects/${projectId}`)
    return { project }
  } catch (error) {
    console.error("Error updating project:", error)
    return { error: "Failed to update project" }
  }
}

// Delete a project
export async function deleteProject(projectId: string) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    await prisma.project.delete({
      where: {
        id: projectId,
        userId: user.id,
      },
    })

    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { error: "Failed to delete project" }
  }
}

