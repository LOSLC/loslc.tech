import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth/schemas";

export const programStatus = pgEnum("program_status", [
  "active",
  "completed",
  "on_hold",
  "cancelled",
  "draft",
]);
export const projectStatus = pgEnum("project_status", [
  "active",
  "completed",
  "on_hold",
  "cancelled",
  "draft",
]);

export const communityPrograms = pgTable("community_programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  status: programStatus("status").default("draft").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const communityProgramLeads = pgTable(
  "community_program_leads",
  {
    programId: integer("program_id")
      .references(() => communityPrograms.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.programId, t.userId] })],
);

export const communityProjects = pgTable("community_projects", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").references(() => communityPrograms.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  repositoryUrl: text("repository_url"),
  status: projectStatus("status").default("draft").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const communityProjectMembers = pgTable(
  "community_project_members",
  {
    projectId: integer("project_id")
      .references(() => communityProjects.id, { onDelete: "cascade" })
      .notNull(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").default("contributor").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.userId] })],
);

export const communityProgramStatusHistory = pgTable(
  "community_program_status_history",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id")
      .references(() => communityPrograms.id, { onDelete: "cascade" })
      .notNull(),
    status: programStatus("status").notNull(),
    changedBy: text("changed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

// Relations

export const communityProgramsRelations = relations(communityPrograms, ({ many }) => ({
  leads: many(communityProgramLeads),
  projects: many(communityProjects),
  statusHistory: many(communityProgramStatusHistory),
}));

export const communityProgramLeadsRelations = relations(communityProgramLeads, ({ one }) => ({
  program: one(communityPrograms, {
    fields: [communityProgramLeads.programId],
    references: [communityPrograms.id],
  }),
  user: one(user, {
    fields: [communityProgramLeads.userId],
    references: [user.id],
  }),
}));

export const communityProjectsRelations = relations(communityProjects, ({ one, many }) => ({
  program: one(communityPrograms, {
    fields: [communityProjects.programId],
    references: [communityPrograms.id],
  }),
  members: many(communityProjectMembers),
}));

export const communityProjectMembersRelations = relations(communityProjectMembers, ({ one }) => ({
  project: one(communityProjects, {
    fields: [communityProjectMembers.projectId],
    references: [communityProjects.id],
  }),
  user: one(user, {
    fields: [communityProjectMembers.userId],
    references: [user.id],
  }),
}));

export const communityProgramStatusHistoryRelations = relations(communityProgramStatusHistory, ({ one }) => ({
  program: one(communityPrograms, {
    fields: [communityProgramStatusHistory.programId],
    references: [communityPrograms.id],
  }),
  user: one(user, {
    fields: [communityProgramStatusHistory.changedBy],
    references: [user.id],
  }),
}));

// Types

export type CommunityProgram = typeof communityPrograms.$inferSelect;
export type NewCommunityProgram = typeof communityPrograms.$inferInsert;

export type CommunityProgramLead = typeof communityProgramLeads.$inferSelect;
export type NewCommunityProgramLead = typeof communityProgramLeads.$inferInsert;

export type CommunityProject = typeof communityProjects.$inferSelect;
export type NewCommunityProject = typeof communityProjects.$inferInsert;

export type CommunityProjectMember = typeof communityProjectMembers.$inferSelect;
export type NewCommunityProjectMember = typeof communityProjectMembers.$inferInsert;

export type CommunityProgramStatusHistory = typeof communityProgramStatusHistory.$inferSelect;
export type NewCommunityProgramStatusHistory = typeof communityProgramStatusHistory.$inferInsert;


