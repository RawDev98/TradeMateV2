"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getUserFromCookie } from "@/lib/auth"

// Create a new note
export async function createNote(projectId: string, formData: FormData) {
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
    const content = formData.get("content") as string
    const category = (formData.get("category") as string) || "general"

    if (!title || !content) {
      throw new Error("Title and content are required")
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        category,
        projectId,
      },
    })

    revalidatePath(`/projects/${projectId}`)
    return { note }
  } catch (error) {
    console.error("Error creating note:", error)
    return { error: "Failed to create note" }
  }
}

// Update a note
export async function updateNote(noteId: string, formData: FormData) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the note with its project to verify ownership
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { project: true },
    })

    if (!note || note.project.userId !== user.id) {
      throw new Error("Note not found or unauthorized")
    }

    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string

    if (!title || !content) {
      throw new Error("Title and content are required")
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title,
        content,
        category,
      },
    })

    revalidatePath(`/projects/${note.projectId}`)
    return { note: updatedNote }
  } catch (error) {
    console.error("Error updating note:", error)
    return { error: "Failed to update note" }
  }
}

// Delete a note
export async function deleteNote(noteId: string) {
  try {
    const user = await getUserFromCookie()

    if (!user) {
      throw new Error("Unauthorized")
    }

    // Get the note with its project to verify ownership
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { project: true },
    })

    if (!note || note.project.userId !== user.id) {
      throw new Error("Note not found or unauthorized")
    }

    const projectId = note.projectId

    await prisma.note.delete({
      where: { id: noteId },
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    return { error: "Failed to delete note" }
  }
}

