"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getUserFromCookie } from "@/lib/auth"

// Create a new task
export async function createTask(projectId: string, formData: FormData) {
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

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = (formData.get("status") as string) || "not-started"
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null
    const assignedTo = formData.get("assignedTo") as string
    const notes = formData.get("notes") as string

    if (!title) {
      throw new Error("Task title is required")
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
        assignedTo,
        notes,
        projectId,
      },
    })

    revalidatePath(`/projects/${projectId}`)
    return { task }
  } catch (error) {
    console.error("Error creating task:", error)
    return { error: "Failed to create task" }
  }
}

// Update a task
export async function updateTask(taskId: string, formData: FormData) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the task with its project to verify ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    })

    if (!task || task.project.userId !== user.id) {
      throw new Error("Task not found or unauthorized")
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string
    const dueDate = formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null
    const assignedTo = formData.get("assignedTo") as string
    const notes = formData.get("notes") as string

    if (!title) {
      throw new Error("Task title is required")
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        dueDate,
        assignedTo,
        notes,
      },
    })

    revalidatePath(`/projects/${task.projectId}`)
    return { task: updatedTask }
  } catch (error) {
    console.error("Error updating task:", error)
    return { error: "Failed to update task" }
  }
}

// Delete a task
export async function deleteTask(taskId: string) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the task with its project to verify ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    })

    if (!task || task.project.userId !== user.id) {
      throw new Error("Task not found or unauthorized")
    }

    const projectId = task.projectId

    await prisma.task.delete({
      where: { id: taskId },
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { error: "Failed to delete task" }
  }
}

// Update task status only (for quick updates)
export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the task with its project to verify ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    })

    if (!task || task.project.userId !== user.id) {
      throw new Error("Task not found or unauthorized")
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    })

    revalidatePath(`/projects/${task.projectId}`)
    return { task: updatedTask }
  } catch (error) {
    console.error("Error updating task status:", error)
    return { error: "Failed to update task status" }
  }
}

