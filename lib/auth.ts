import { appConfig } from "@/lib/server/config";
import { db } from "@/core/db/setup";
import { sendEmail } from "@/core/services/email/mailer";
import { getEnv } from "@/lib/server/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, organization } from "better-auth/plugins";
import { LoginEmail } from "@/components/email-templates/auth/login";
import { user } from "@/core/db/schemas";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: appConfig.authProviders.google,
    github: appConfig.authProviders.github,
    facebook: appConfig.authProviders.facebook,
    atlassian: appConfig.authProviders.atlassian,
    discord: appConfig.authProviders.discord,
    linkedIn: appConfig.authProviders.linkedIn,
  },
  user: {
    additionalFields: {
      lastName: {
        type: "string",
        required: false,
        input: true,
      },
      handle: {
        type: "string",
        required: false,
        input: true,
      },
      profilePictureUrl: {
        type: "string",
        required: false,
        input: true,
      },
      socialLinks: {
        type: "json",
        required: false,
        input: true,
      },
      birthdate: {
        type: "date",
        required: false,
        input: true,
      },
      gender: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        required: true,
        input: false,
      },
    },
  },
  baseURL: getEnv("BETTER_AUTH_URL"),
  secret: getEnv("BETTER_AUTH_SECRET"),
  emailVerification: {
    afterEmailVerification: async (u) => {
      const authorizedEmails = getEnv("AUTHORIZED_EMAILS")
        .split(" ")
        .map((email) => email.toLowerCase());
      if (authorizedEmails.includes(u.email.toLowerCase())) {
        await db.update(user).set({
          role: "superadmin",
        })
      }
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendEmail({
          to: email,
          subject: "Sign in to your account",
          component: LoginEmail,
          props: {
            magicLink: url,
            email: email,
            token: token,
          },
        });
      },
    }),
    organization(),
  ],
});
