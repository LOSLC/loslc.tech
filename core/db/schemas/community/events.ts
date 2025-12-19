import * as pg from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth/schemas";

const EventLocationType = pg.pgEnum("event_location_type", [
  "online",
  "in-person",
  "hybrid",
]);

const EventVisibility = pg.pgEnum("event_visibility", [
  "public",
  "private",
  "members-only",
]);

export const communityEvent = pg.pgTable("community_events", {
  id: pg.serial("id").primaryKey(),
  createdBy: pg
    .text("publisher_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  title: pg.text("title").notNull(),
  description: pg.text("description").notNull(),
  slug: pg.text("slug").notNull().unique(),
  date: pg.timestamp("date").notNull(),
  capacity: pg.integer("capacity"),
  registrationRequired: pg
    .boolean("registration_required")
    .default(false)
    .notNull(),
  startAt: pg.timestamp("start_at").notNull(),
  endAt: pg.timestamp("end_at").notNull(),
  timezone: pg.text("timezone").notNull(),
  cancelled: pg.boolean("cancelled").default(false).notNull(),
  visibility: EventVisibility("visibility").default("public").notNull(),
  coverImageUrl: pg.text("cover_image_url"),
  published: pg.boolean("published").default(false).notNull(),
  location: pg.text("location").notNull(),
  locationType: EventLocationType("location_type").notNull(),
  flagship: pg.boolean("flagship").default(false).notNull(),
  createdAt: pg.timestamp("created_at").defaultNow().notNull(),
  updatedAt: pg.timestamp("updated_at").defaultNow().notNull(),
});

export const eventSession = pg.pgTable("event_sessions", {
  id: pg.serial("id").primaryKey(),
  eventId: pg
    .integer("event_id")
    .references(() => communityEvent.id, { onDelete: "cascade" })
    .notNull(),
  title: pg.text("title").notNull(),
  description: pg.text("description"),
  startAt: pg.timestamp("start_at").notNull(),
  endAt: pg.timestamp("end_at").notNull(),
  locationLink: pg.text("location_link"),
});

export const eventSpeaker = pg.pgTable("event_speakers", {
  id: pg.serial("id").primaryKey(),
  eventId: pg
    .integer("event_id")
    .references(() => communityEvent.id, { onDelete: "cascade" })
    .notNull(),
  name: pg.text("name").notNull(),
  bio: pg.text("bio"),
  profileImageUrl: pg.text("profile_image_url"),
});

export const eventSponsor = pg.pgTable("event_sponsors", {
  id: pg.serial("id").primaryKey(),
  eventId: pg
    .integer("event_id")
    .references(() => communityEvent.id, { onDelete: "cascade" })
    .notNull(),
  name: pg.text("name").notNull(),
  logoUrl: pg.text("logo_url"),
  websiteUrl: pg.text("website_url"),
});

export const eventFeedback = pg.pgTable("event_feedbacks", {
  id: pg.serial("id").primaryKey(),
  eventId: pg
    .integer("event_id")
    .references(() => communityEvent.id, { onDelete: "cascade" })
    .notNull(),
  userId: pg
    .text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  rating: pg.integer("rating").notNull(),
  comments: pg.text("comments"),
  submittedAt: pg.timestamp("submitted_at").defaultNow().notNull(),
});

export const eventTag = pg.pgTable("event_tags", {
  id: pg.serial("id").primaryKey(),
  tag: pg.text("tag").notNull(),
});

export const eventTagLink = pg.pgTable("event_tag_links", {
  eventId: pg
    .integer("event_id")
    .references(() => communityEvent.id, { onDelete: "cascade" })
    .notNull(),
  tagId: pg
    .integer("tag_id")
    .references(() => eventTag.id, { onDelete: "cascade" })
    .notNull(),
});

const EventInvitationStatus = pg.pgEnum("event_invitation_status", [
  "pending",
  "accepted",
  "declined",
]);

export const eventInvitation = pg.pgTable("event_invitations", {
  id: pg.uuid("id").primaryKey().defaultRandom(),
  eventId: pg
    .integer("event_id")
    .references(() => communityEvent.id, { onDelete: "cascade" })
    .notNull(),
  email: pg.text("email").notNull(),
  invitedAt: pg.timestamp("invited_at").defaultNow().notNull(),
  invitedBy: pg
    .text("invited_by")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  respondedAt: pg.timestamp("responded_at"),
  status: EventInvitationStatus("status").default("pending").notNull(),
});

const RegistrationStatus = pg.pgEnum("registration_status", [
  "pending",
  "confirmed",
  "cancelled",
]);

export const communityEventRegistration = pg.pgTable(
  "community_event_registrations",
  {
    id: pg.serial("id").primaryKey(),
    eventId: pg
      .integer("event_id")
      .references(() => communityEvent.id, { onDelete: "cascade" })
      .notNull(),
    userId: pg
      .text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    registeredAt: pg.timestamp("registered_at").defaultNow().notNull(),
    status: RegistrationStatus("status").default("pending").notNull(),
    checkedInAt: pg.timestamp("checked_in_at"),
    source: pg.text("source"),
  },
  (table) => [
    pg
      .uniqueIndex("community_event_user_unique_idx")
      .on(table.eventId, table.userId),
  ],
);

// Relations

export const communityEventRelations = relations(communityEvent, ({ many, one }) => ({
  sessions: many(eventSession),
  speakers: many(eventSpeaker),
  sponsors: many(eventSponsor),
  feedbacks: many(eventFeedback),
  tags: many(eventTagLink),
  invitations: many(eventInvitation),
  registrations: many(communityEventRegistration),
  publisher: one(user, {
    fields: [communityEvent.createdBy],
    references: [user.id],
  }),
}));

export const eventSessionRelations = relations(eventSession, ({ one }) => ({
  event: one(communityEvent, {
    fields: [eventSession.eventId],
    references: [communityEvent.id],
  }),
}));

export const eventSpeakerRelations = relations(eventSpeaker, ({ one }) => ({
  event: one(communityEvent, {
    fields: [eventSpeaker.eventId],
    references: [communityEvent.id],
  }),
}));

export const eventSponsorRelations = relations(eventSponsor, ({ one }) => ({
  event: one(communityEvent, {
    fields: [eventSponsor.eventId],
    references: [communityEvent.id],
  }),
}));

export const eventFeedbackRelations = relations(eventFeedback, ({ one }) => ({
  event: one(communityEvent, {
    fields: [eventFeedback.eventId],
    references: [communityEvent.id],
  }),
  user: one(user, {
    fields: [eventFeedback.userId],
    references: [user.id],
  }),
}));

export const eventTagRelations = relations(eventTag, ({ many }) => ({
  events: many(eventTagLink),
}));

export const eventTagLinkRelations = relations(eventTagLink, ({ one }) => ({
  event: one(communityEvent, {
    fields: [eventTagLink.eventId],
    references: [communityEvent.id],
  }),
  tag: one(eventTag, {
    fields: [eventTagLink.tagId],
    references: [eventTag.id],
  }),
}));

export const eventInvitationRelations = relations(eventInvitation, ({ one }) => ({
  event: one(communityEvent, {
    fields: [eventInvitation.eventId],
    references: [communityEvent.id],
  }),
  invitedBy: one(user, {
    fields: [eventInvitation.invitedBy],
    references: [user.id],
  }),
}));

export const communityEventRegistrationRelations = relations(communityEventRegistration, ({ one }) => ({
  event: one(communityEvent, {
    fields: [communityEventRegistration.eventId],
    references: [communityEvent.id],
  }),
  user: one(user, {
    fields: [communityEventRegistration.userId],
    references: [user.id],
  }),
}));

// Types

export type CommunityEvent = typeof communityEvent.$inferSelect;
export type NewCommunityEvent = typeof communityEvent.$inferInsert;

export type EventSession = typeof eventSession.$inferSelect;
export type NewEventSession = typeof eventSession.$inferInsert;

export type EventSpeaker = typeof eventSpeaker.$inferSelect;
export type NewEventSpeaker = typeof eventSpeaker.$inferInsert;

export type EventSponsor = typeof eventSponsor.$inferSelect;
export type NewEventSponsor = typeof eventSponsor.$inferInsert;

export type EventFeedback = typeof eventFeedback.$inferSelect;
export type NewEventFeedback = typeof eventFeedback.$inferInsert;

export type EventTag = typeof eventTag.$inferSelect;
export type NewEventTag = typeof eventTag.$inferInsert;

export type EventInvitation = typeof eventInvitation.$inferSelect;
export type NewEventInvitation = typeof eventInvitation.$inferInsert;

export type CommunityEventRegistration = typeof communityEventRegistration.$inferSelect;
export type NewCommunityEventRegistration = typeof communityEventRegistration.$inferInsert;


