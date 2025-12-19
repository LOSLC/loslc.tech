import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "../auth/schemas";

export const blogPostStatus = pgEnum("blog_post_status", [
  "draft",
  "published",
  "archived",
  "under_review",
]);

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  authorId: text("author_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: integer("category_id").references(() => blogCategories.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImageUrl: text("cover_image_url"),
  status: blogPostStatus("status").default("draft").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    postId: integer("post_id")
      .references(() => blogPosts.id, { onDelete: "cascade" })
      .notNull(),
    tagId: integer("tag_id")
      .references(() => blogTags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);

export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .references(() => blogPosts.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  parentId: integer("parent_id"),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogViews = pgTable("blog_views", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .references(() => blogPosts.id, { onDelete: "cascade" })
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  viewedAt: timestamp("viewed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const blogModerationQueue = pgTable("blog_moderation_queue", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(), // 'post' or 'comment'
  entityId: integer("entity_id").notNull(),
  reason: text("reason"),
  status: text("status").default("pending").notNull(), // pending, resolved, rejected
  reviewedBy: text("reviewed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Relations

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(user, {
    fields: [blogPosts.authorId],
    references: [user.id],
  }),
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
  tags: many(blogPostTags),
  comments: many(blogComments),
}));

export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}));

export const blogTagsRelations = relations(blogTags, ({ many }) => ({
  posts: many(blogPostTags),
}));

export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTags.postId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));

export const blogCommentsRelations = relations(blogComments, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogComments.postId],
    references: [blogPosts.id],
  }),
  user: one(user, {
    fields: [blogComments.userId],
    references: [user.id],
  }),
}));

// Types

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type BlogCategory = typeof blogCategories.$inferSelect;
export type NewBlogCategory = typeof blogCategories.$inferInsert;

export type BlogTag = typeof blogTags.$inferSelect;
export type NewBlogTag = typeof blogTags.$inferInsert;

export type BlogPostTag = typeof blogPostTags.$inferSelect;
export type NewBlogPostTag = typeof blogPostTags.$inferInsert;

export type BlogComment = typeof blogComments.$inferSelect;
export type NewBlogComment = typeof blogComments.$inferInsert;

export type BlogView = typeof blogViews.$inferSelect;
export type NewBlogView = typeof blogViews.$inferInsert;

export type BlogModerationQueue = typeof blogModerationQueue.$inferSelect;
export type NewBlogModerationQueue = typeof blogModerationQueue.$inferInsert;


