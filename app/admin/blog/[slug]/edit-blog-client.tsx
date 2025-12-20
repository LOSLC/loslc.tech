"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateBlogPost, getBlogPostBySlug } from "@/app/actions/social/blog"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import { mutate } from "swr"
import useSWR from "swr"
import { useEffect } from "react"

const formSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  status: z.enum(["draft", "published", "archived", "under_review"]),
  coverImageUrl: z.string().optional(),
})

const fetcher = async (slug: string) => {
    const res = await getBlogPostBySlug(slug)
    if (!res.success) throw new Error(res.message)
    return res.data
}

export function EditBlogClient() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const { data: post, isLoading } = useSWR(["admin:blogs:detail", slug], () => fetcher(slug))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      status: "draft",
      coverImageUrl: "",
    },
  })

  useEffect(() => {
    if (post) {
        form.reset({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || "",
            status: post.status as any,
            coverImageUrl: post.coverImageUrl || "",
        })
    }
  }, [post, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!post) return

    const promise = updateBlogPost(post.id, {
        ...values,
        tags: [], // TODO: Add tags support
    })
    
    toast.promise(promise, {
        loading: "Updating post...",
        success: () => {
            mutate("admin:blogs:list")
            mutate(["admin:blogs:detail", slug])
            router.push("/admin/blog")
            return "Post updated successfully"
        },
        error: "Failed to update post"
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Blog Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="post-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea placeholder="Short description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea className="min-h-[200px]" placeholder="Post content (Markdown supported)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Post</Button>
        </form>
      </Form>
    </div>
  )
}
