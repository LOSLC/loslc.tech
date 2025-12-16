"use server";

import { auth } from "@/lib/auth";
import type { ServerResponse } from "@/lib/common/types/request-response";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function sendMagicLink({
  email,
  firstName,
  callbackURL,
  errorCallbackURL,
}: {
  email: string;
  firstName: string;
  callbackURL?: string;
  errorCallbackURL?: string;
}): Promise<ServerResponse<void>> {
  try {
    const data = await auth.api.signInMagicLink({
      body: {
        email: email,
        name: firstName,
        callbackURL,
        errorCallbackURL,
      },
      headers: await headers(),
    });
    if (data.status) {
      return {
        success: true,
        message: "Magic link sent successfully",
        data: undefined,
      };
    }
    return {
      success: false,
      message: "Failed to send magic link",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Failed to send magic link",
    };
  }
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }
  return session.user;
}

export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin");
  }
}
