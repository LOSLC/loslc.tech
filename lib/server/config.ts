import { getEnv } from "./env";

interface Config {
  APP_NAME: string;
  APP_ICON_URL?: string;
  authProviders: {
    google?: {
      clientId: string;
      clientSecret: string;
    };
    github?: {
      clientId: string;
      clientSecret: string;
    };
    facebook?: {
      clientId: string;
      clientSecret: string;
    };
    atlassian?: {
      clientId: string;
      clientSecret: string;
    };
    discord?: {
      clientId: string;
      clientSecret: string;
    };
    linkedIn?: {
      clientId: string;
      clientSecret: string;
    };
  };
  ACCESS_TOKEN_EXPIRES_MINUTES: number;
}

export const appConfig: Config = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "MyApp",
  authProviders: {
    google: {
      clientId: getEnv("GOOGLE_CLIENT_ID", ""),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
    },
    github: {
      clientId: getEnv("GITHUB_CLIENT_ID", ""),
      clientSecret: getEnv("GITHUB_CLIENT_SECRET", ""),
    },
  },
  ACCESS_TOKEN_EXPIRES_MINUTES: 15,
};
