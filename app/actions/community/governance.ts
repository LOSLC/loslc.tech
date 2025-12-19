"use server";

import { db } from "@/core/db/setup";
import {
  communityRoles,
  communityPermissions,
  communityUserRoles,
  communityContributorProfiles,
  communityRolePermissions,
  type CommunityRole,
  type NewCommunityRole,
  type CommunityPermission,
  type NewCommunityPermission,
  type CommunityUserRole,
  type NewCommunityUserRole,
  type CommunityContributorProfile,
  type NewCommunityContributorProfile,
  type CommunityRolePermission,
  type NewCommunityRolePermission,
} from "@/core/db/schemas/community/governance";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ServerResponse } from "@/lib/common/types/request-response";
import { getCurrentUser } from "../auth";
import { evaluateRole } from "@/lib/server/permissions";

// --- Roles ---

export async function createRole(
  data: NewCommunityRole
): Promise<ServerResponse<CommunityRole>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const [role] = await db.insert(communityRoles).values(data).returning();
    revalidatePath("/admin/roles");
    return { success: true, data: role };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getRoles(): Promise<ServerResponse<CommunityRole[]>> {
  try {
    const roles = await db.query.communityRoles.findMany();
    return { success: true, data: roles };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateRole(
  id: number,
  data: Partial<NewCommunityRole>
): Promise<ServerResponse<CommunityRole>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const [role] = await db
      .update(communityRoles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(communityRoles.id, id))
      .returning();
    revalidatePath("/admin/roles");
    return { success: true, data: role };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteRole(id: number): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    await db.delete(communityRoles).where(eq(communityRoles.id, id));
    revalidatePath("/admin/roles");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- User Roles ---

export async function assignRoleToUser(
  userId: string,
  roleId: number
): Promise<ServerResponse<void>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !evaluateRole(currentUser, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    await db.insert(communityUserRoles).values({
      userId,
      roleId,
      assignedBy: currentUser.id,
    });
    revalidatePath(`/users/${userId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function removeRoleFromUser(
  userId: string,
  roleId: number
): Promise<ServerResponse<void>> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    await db
      .delete(communityUserRoles)
      .where(
        and(
          eq(communityUserRoles.userId, userId),
          eq(communityUserRoles.roleId, roleId)
        )
      );
    revalidatePath(`/users/${userId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Contributor Profiles ---

export async function getContributorProfile(
  userId: string
): Promise<
  ServerResponse<typeof communityContributorProfiles.$inferSelect | undefined>
> {
  try {
    const profile = await db.query.communityContributorProfiles.findFirst({
      where: eq(communityContributorProfiles.userId, userId),
    });
    return { success: true, data: profile };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateContributorProfile(
  data: Partial<typeof communityContributorProfiles.$inferInsert>
): Promise<
  ServerResponse<typeof communityContributorProfiles.$inferSelect>
> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // Check if profile exists
    const existingProfile = await db.query.communityContributorProfiles.findFirst(
      {
        where: eq(communityContributorProfiles.userId, user.id),
      }
    );

    let profile;
    if (existingProfile) {
      [profile] = await db
        .update(communityContributorProfiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(communityContributorProfiles.userId, user.id))
        .returning();
    } else {
      [profile] = await db
        .insert(communityContributorProfiles)
        .values({ ...data, userId: user.id })
        .returning();
    }

    revalidatePath("/profile");
    return { success: true, data: profile };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
