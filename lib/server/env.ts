type Env =
  | "DATABASE_URL"
  | "DEBUG"
  | "SMTP_HOST"
  | "APP_EMAIL"
  | "SMTP_PASSWORD"
  | "SMTP_USERNAME"
  | "APP_BASE_URL"
  | "APP_SECRET"
  | "AUTHORIZED_EMAILS"
  | "SUPPORT_EMAIL"
  | "NEXT_PUBLIC_APP_BASE_URL"
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "GITHUB_CLIENT_ID"
  | "GITHUB_CLIENT_SECRET"
  | "DEFAULT_FROM_NAME"
  | "CORS_ORIGINS"
  | "POCKETBASE_URL"
  | "POCKETBASE_ADMIN_EMAIL"
  | "POCKETBASE_ADMIN_PASSWORD"
  | "DEFAULT_APP_EMAIL"
  | "APP_NAME"
  | "JWT_KEY"
  | "SUPPORTS_GOOGLE_AUTH"
  | "SUPPORTS_GITHUB_AUTH";

export function getEnv(key: Env, defaultValue: string | undefined = undefined): string {
  const value = process.env[key] ?? defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}
