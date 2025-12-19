"use server";

import { db } from "@/core/db/setup";
import {
  communityEvent,
  eventSession,
  eventSpeaker,
  communityEventRegistration,
  type CommunityEvent,
  type NewCommunityEvent,
} from "@/core/db/schemas/community/events";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ServerResponse } from "@/lib/common/types/request-response";
import { getCurrentUser } from "../auth";
import { evaluateRole } from "@/lib/server/permissions";

// --- Events ---

export async function createEvent(
  data: NewCommunityEvent
): Promise<ServerResponse<CommunityEvent>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const [event] = await db
      .insert(communityEvent)
      .values({ ...data, createdBy: user.id })
      .returning();
    revalidatePath("/events");
    return { success: true, data: event };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getEvents(
  publishedOnly: boolean = true
): Promise<ServerResponse<CommunityEvent[]>> {
  try {
    const where = publishedOnly
      ? eq(communityEvent.published, true)
      : undefined;
    const events = await db.query.communityEvent.findMany({
      where,
      orderBy: [desc(communityEvent.date)],
    });
    return { success: true, data: events };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getEventBySlug(
  slug: string
): Promise<ServerResponse<CommunityEvent>> {
  try {
    const event = await db.query.communityEvent.findFirst({
      where: eq(communityEvent.slug, slug),
      with: {
        sessions: true, // Assuming relations are defined in schema
        speakers: true,
        sponsors: true,
      },
    });
    if (!event) return { success: false, message: "Event not found" };
    return { success: true, data: event };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateEvent(
  id: number,
  data: Partial<NewCommunityEvent>
): Promise<ServerResponse<CommunityEvent>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const [event] = await db
      .update(communityEvent)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(communityEvent.id, id))
      .returning();
    revalidatePath("/events");
    return { success: true, data: event };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteEvent(id: number): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    await db.delete(communityEvent).where(eq(communityEvent.id, id));
    revalidatePath("/events");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Registration ---

export async function registerForEvent(
  eventId: number
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // Check if already registered
    const existing = await db.query.communityEventRegistration.findFirst({
      where: and(
        eq(communityEventRegistration.eventId, eventId),
        eq(communityEventRegistration.userId, user.id)
      ),
    });

    if (existing) {
      return { success: false, message: "Already registered" };
    }

    await db.insert(communityEventRegistration).values({
      eventId,
      userId: user.id,
      status: "confirmed", // Or pending if approval needed
    });
    revalidatePath(`/events/${eventId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function cancelRegistration(
  eventId: number
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    await db
      .update(communityEventRegistration)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(communityEventRegistration.eventId, eventId),
          eq(communityEventRegistration.userId, user.id)
        )
      );
    revalidatePath(`/events/${eventId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
