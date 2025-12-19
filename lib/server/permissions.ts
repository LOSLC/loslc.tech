import type { User } from "@/lib/auth";

export function evaluateRole(
  user: User,
  minimumRequired: "user" | "admin" | "superadmin",
): boolean {
  const role = user.role;
  const roleHierarchy = {
    user: 1,
    admin: 2,
    superadmin: 3,
  };

  return (
    roleHierarchy[role as "user" | "admin" | "superadmin"] >=
    roleHierarchy[minimumRequired]
  );
}
