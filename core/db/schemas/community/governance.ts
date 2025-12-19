import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth/schemas";

export const communityRoles = pgTable("community_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const communityPermissions = pgTable("community_permissions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g., 'blog:create', 'event:delete'
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const communityRolePermissions = pgTable(
  "community_role_permissions",
  {
    roleId: integer("role_id")
      .references(() => communityRoles.id, { onDelete: "cascade" })
      .notNull(),
    permissionId: integer("permission_id")
      .references(() => communityPermissions.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);

export const communityUserRoles = pgTable(
  "community_user_roles",
  {
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    roleId: integer("role_id")
      .references(() => communityRoles.id, { onDelete: "cascade" })
      .notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    assignedBy: text("assigned_by").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.roleId] })],
);

export const communityContributorProfiles = pgTable(
  "community_contributor_profiles",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull()
      .unique(),
    bio: text("bio"),
    skills: text("skills").array(),
    githubProfile: text("github_profile"),
    linkedinProfile: text("linkedin_profile"),
    website: text("website"),
    contributionCount: integer("contribution_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

// Relations

export const communityRolesRelations = relations(communityRoles, ({ many }) => ({
  permissions: many(communityRolePermissions),
  users: many(communityUserRoles),
}));

export const communityPermissionsRelations = relations(communityPermissions, ({ many }) => ({
  roles: many(communityRolePermissions),
}));

export const communityRolePermissionsRelations = relations(communityRolePermissions, ({ one }) => ({
  role: one(communityRoles, {
    fields: [communityRolePermissions.roleId],
    references: [communityRoles.id],
  }),
  permission: one(communityPermissions, {
    fields: [communityRolePermissions.permissionId],
    references: [communityPermissions.id],
  }),
}));

export const communityUserRolesRelations = relations(communityUserRoles, ({ one }) => ({
  user: one(user, {
    fields: [communityUserRoles.userId],
    references: [user.id],
  }),
  role: one(communityRoles, {
    fields: [communityUserRoles.roleId],
    references: [communityRoles.id],
  }),
  assignedBy: one(user, {
    fields: [communityUserRoles.assignedBy],
    references: [user.id],
  }),
}));

export const communityContributorProfilesRelations = relations(communityContributorProfiles, ({ one }) => ({
  user: one(user, {
    fields: [communityContributorProfiles.userId],
    references: [user.id],
  }),
}));

// Types

export type CommunityRole = typeof communityRoles.$inferSelect;
export type NewCommunityRole = typeof communityRoles.$inferInsert;

export type CommunityPermission = typeof communityPermissions.$inferSelect;
export type NewCommunityPermission = typeof communityPermissions.$inferInsert;

export type CommunityRolePermission = typeof communityRolePermissions.$inferSelect;
export type NewCommunityRolePermission = typeof communityRolePermissions.$inferInsert;

export type CommunityUserRole = typeof communityUserRoles.$inferSelect;
export type NewCommunityUserRole = typeof communityUserRoles.$inferInsert;

export type CommunityContributorProfile = typeof communityContributorProfiles.$inferSelect;
export type NewCommunityContributorProfile = typeof communityContributorProfiles.$inferInsert;


