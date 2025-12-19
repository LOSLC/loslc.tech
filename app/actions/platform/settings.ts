"use server";

import { db } from "@/core/db/setup";
import {
  systemSettings,
  notificationPreferences,
  notifications,
  auditLogs,
  type SystemSetting,
  type NewSystemSetting,
  type NotificationPreference,
  type NewNotificationPreference,
  type Notification,
  type NewNotification,
  type AuditLog,
  type NewAuditLog,
} from "@/core/db/schemas/platform/settings";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ServerResponse } from "@/lib/common/types/request-response";
import { getCurrentUser } from "../auth";
import { evaluateRole } from "@/lib/server/permissions";

// --- System Settings ---

export async function getSystemSetting(
  key: string
): Promise<ServerResponse<any>> {
  try {
    const setting = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, key),
    });
    return { success: true, data: setting?.value };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateSystemSetting(
  key: string,
  value: any,
  description?: string
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user || !evaluateRole(user, "admin")) {
      return { success: false, message: "Unauthorized" };
    }

    const existingSetting = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, key),
    });

    if (existingSetting) {
      await db
        .update(systemSettings)
        .set({
          value,
          description: description || existingSetting.description,
          updatedAt: new Date(),
          updatedBy: user.id,
        })
        .where(eq(systemSettings.key, key));
    } else {
      await db.insert(systemSettings).values({
        key,
        value,
        description,
        updatedBy: user.id,
      });
    }

    revalidatePath("/admin/settings");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Notifications ---

export async function getNotifications(): Promise<
  ServerResponse<Notification[]>
> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, user.id),
      orderBy: [desc(notifications.createdAt)],
    });
    return { success: true, data: userNotifications };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function markNotificationAsRead(
  id: number
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));
    revalidatePath("/notifications");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Notification Preferences ---

export async function getNotificationPreferences(): Promise<
  ServerResponse<(typeof notificationPreferences.$inferSelect)[]>
> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const prefs = await db.query.notificationPreferences.findMany({
      where: eq(notificationPreferences.userId, user.id),
    });
    return { success: true, data: prefs };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateNotificationPreference(
  type: "email" | "push" | "in_app",
  category: string,
  enabled: boolean
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const existingPref = await db.query.notificationPreferences.findFirst({
      where: and(
        eq(notificationPreferences.userId, user.id),
        eq(notificationPreferences.type, type),
        eq(notificationPreferences.category, category)
      ),
    });

    if (existingPref) {
      await db
        .update(notificationPreferences)
        .set({ enabled, updatedAt: new Date() })
        .where(eq(notificationPreferences.id, existingPref.id));
    } else {
      await db.insert(notificationPreferences).values({
        userId: user.id,
        type,
        category,
        enabled,
      });
    }

    revalidatePath("/settings/notifications");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Audit Logs ---

export async function logAuditAction(
  action: string,
  entityType: string,
  entityId: string,
  details?: any
): Promise<void> {
  try {
    const user = await getCurrentUser().catch(() => null);
    await db.insert(auditLogs).values({
      userId: user?.id,
      action,
      entityType,
      entityId,
      details,
      // ipAddress would need to be passed
    });
  } catch (error) {
    console.error("Failed to log audit action", error);
  }
}
