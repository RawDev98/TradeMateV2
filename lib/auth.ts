import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import prisma from "@/lib/db"

export async function getUserFromCookie() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret") as {
      id: string
      email: string
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error getting user from cookie:", error)
    return null
  }
}

