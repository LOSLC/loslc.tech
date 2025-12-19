"use server";

import { db } from "@/core/db/setup";
import {
  blogPosts,
  blogCategories,
  blogComments,
  blogTags,
  blogPostTags,
  blogViews,
  type BlogPost,
  type NewBlogPost,
  type BlogCategory,
  type NewBlogCategory,
  type BlogComment,
  type NewBlogComment,
  type BlogTag,
  type NewBlogTag,
} from "@/core/db/schemas/social/blog";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ServerResponse } from "@/lib/common/types/request-response";
import { getCurrentUser } from "../auth";

// --- Blog Posts ---

export async function createBlogPost(
  data: NewBlogPost & { tags?: string[] }
): Promise<ServerResponse<BlogPost>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { tags, ...postData } = data;

    const [post] = await db
      .insert(blogPosts)
      .values({ ...postData, authorId: user.id })
      .returning();

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let [tag] = await db
          .select()
          .from(blogTags)
          .where(eq(blogTags.name, tagName));

        if (!tag) {
          [tag] = await db
            .insert(blogTags)
            .values({
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, "-"),
            })
            .returning();
        }

        await db
          .insert(blogPostTags)
          .values({ postId: post.id, tagId: tag.id });
      }
    }

    revalidatePath("/blog");
    return { success: true, data: post };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getBlogPosts(
  status: "published" | "draft" | "all" = "published"
): Promise<ServerResponse<BlogPost[]>> {
  try {
    const where =
      status === "all" ? undefined : eq(blogPosts.status, status as any);
    const posts = await db.query.blogPosts.findMany({
      where,
      orderBy: [desc(blogPosts.createdAt)],
      with: {
        author: true,
        category: true,
      },
    });
    return { success: true, data: posts };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<ServerResponse<BlogPost>> {
  try {
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
      with: {
        author: true,
        category: true,
      },
    });
    if (!post) return { success: false, message: "Post not found" };
    return { success: true, data: post };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateBlogPost(
  id: number,
  data: Partial<typeof blogPosts.$inferInsert>
): Promise<ServerResponse<typeof blogPosts.$inferSelect>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // Check ownership or admin
    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (
      !existingPost ||
      (existingPost.authorId !== user.id && user.role !== "admin")
    ) {
      return { success: false, message: "Unauthorized" };
    }

    const [post] = await db
      .update(blogPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, data: post };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function deleteBlogPost(
  id: number
): Promise<ServerResponse<void>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const existingPost = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
    });

    if (
      !existingPost ||
      (existingPost.authorId !== user.id && user.role !== "admin")
    ) {
      return { success: false, message: "Unauthorized" };
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath("/blog");
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Comments ---

export async function createComment(
  postId: number,
  content: string,
  parentId?: number
): Promise<ServerResponse<typeof blogComments.$inferSelect>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const [comment] = await db
      .insert(blogComments)
      .values({
        postId,
        userId: user.id,
        content,
        parentId,
      })
      .returning();
    revalidatePath(`/blog/${postId}`); // Ideally revalidate the specific post page
    return { success: true, data: comment };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getComments(
  postId: number
): Promise<ServerResponse<(typeof blogComments.$inferSelect)[]>> {
  try {
    const comments = await db.query.blogComments.findMany({
      where: eq(blogComments.postId, postId),
      orderBy: [desc(blogComments.createdAt)],
      with: {
        user: true, // Assuming relation exists
      },
    });
    return { success: true, data: comments };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

// --- Views ---

export async function incrementView(postId: number): Promise<void> {
  try {
    const user = await getCurrentUser().catch(() => null);
    // We don't return anything, just fire and forget
    await db.insert(blogViews).values({
      postId,
      userId: user?.id,
      // ipAddress and userAgent would need to be passed from headers if we were in a component or middleware
    });
  } catch (error) {
    console.error("Failed to increment view", error);
  }
}
