"use server";

import { db } from "@/core/db/setup";
import { user } from "@/core/db/schemas/auth/schemas";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ServerResponse } from "@/lib/common/types/request-response";
import { getCurrentUser } from "../auth";
import { evaluateRole } from "@/lib/server/permissions";

export async function getUsers(): Promise<ServerResponse<typeof user.$inferSelect[]>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !evaluateRole(currentUser, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const users = await db.select().from(user).orderBy(desc(user.createdAt));
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateUserRole(userId: string, role: string): Promise<ServerResponse<void>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !evaluateRole(currentUser, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    await db.update(user).set({ role }).where(eq(user.id, userId));
    revalidatePath("/admin/users");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
