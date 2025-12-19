"use server";

import { db } from "@/core/db/setup";
import {
  communityPrograms,
  communityProjects,
  communityProgramLeads,
  communityProjectMembers,
  communityProgramStatusHistory,
  type CommunityProgram,
  type NewCommunityProgram,
  type CommunityProject,
  type NewCommunityProject,
  type CommunityProgramLead,
  type NewCommunityProgramLead,
  type CommunityProjectMember,
  type NewCommunityProjectMember,
  type CommunityProgramStatusHistory,
  type NewCommunityProgramStatusHistory,
} from "@/core/db/schemas/community/programs";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ServerResponse } from "@/lib/common/types/request-response";
import { getCurrentUser } from "../auth";
import { evaluateRole } from "@/lib/server/permissions";

// --- Programs ---

export async function createProgram(
  data: NewCommunityProgram
): Promise<ServerResponse<CommunityProgram>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const [program] = await db
      .insert(communityPrograms)
      .values(data)
      .returning();
    revalidatePath("/programs");
    return { success: true, data: program };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getPrograms(): Promise<
  ServerResponse<CommunityProgram[]>
> {
  try {
    const programs = await db.query.communityPrograms.findMany({
      orderBy: [desc(communityPrograms.createdAt)],
    });
    return { success: true, data: programs };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getProgramBySlug(
  slug: string
): Promise<ServerResponse<CommunityProgram>> {
  try {
    const program = await db.query.communityPrograms.findFirst({
      where: eq(communityPrograms.slug, slug),
    });
    if (!program) return { success: false, message: "Program not found" };
    return { success: true, data: program };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateProgram(
  id: number,
  data: Partial<NewCommunityProgram>
): Promise<ServerResponse<CommunityProgram>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const [program] = await db
      .update(communityPrograms)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(communityPrograms.id, id))
      .returning();
    revalidatePath("/programs");
    return { success: true, data: program };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteProgram(
  id: number
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    await db.delete(communityPrograms).where(eq(communityPrograms.id, id));
    revalidatePath("/programs");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Projects ---

export async function createProject(
  data: typeof communityProjects.$inferInsert
): Promise<ServerResponse<typeof communityProjects.$inferSelect>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const [project] = await db
      .insert(communityProjects)
      .values(data)
      .returning();
    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getProjects(
  programId?: number
): Promise<ServerResponse<(typeof communityProjects.$inferSelect)[]>> {
  try {
    const where = programId
      ? eq(communityProjects.programId, programId)
      : undefined;
    const projects = await db.query.communityProjects.findMany({
      where,
      orderBy: [desc(communityProjects.createdAt)],
    });
    return { success: true, data: projects };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateProject(
  id: number,
  data: Partial<typeof communityProjects.$inferInsert>
): Promise<ServerResponse<typeof communityProjects.$inferSelect>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const [project] = await db
      .update(communityProjects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(communityProjects.id, id))
      .returning();
    revalidatePath("/projects");
    return { success: true, data: project };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteProject(
  id: number
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    await db.delete(communityProjects).where(eq(communityProjects.id, id));
    revalidatePath("/projects");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Leads & Members ---

export async function addProgramLead(
  programId: number,
  userId: string
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    await db.insert(communityProgramLeads).values({ programId, userId });
    revalidatePath(`/programs/${programId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function removeProgramLead(
  programId: number,
  userId: string
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return { success: false, message: "Unauthorized" };
    }

    await db
      .delete(communityProgramLeads)
      .where(
        and(
          eq(communityProgramLeads.programId, programId),
          eq(communityProgramLeads.userId, userId)
        )
      );
    revalidatePath(`/programs/${programId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function joinProject(
  projectId: number,
  role: string = "contributor"
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    await db
      .insert(communityProjectMembers)
      .values({ projectId, userId: user.id, role });
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function leaveProject(
  projectId: number
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    await db
      .delete(communityProjectMembers)
      .where(
        and(
          eq(communityProjectMembers.projectId, projectId),
          eq(communityProjectMembers.userId, user.id)
        )
      );
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
