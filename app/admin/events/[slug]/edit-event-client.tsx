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
import { Switch } from "@/components/ui/switch"
import { updateEvent, getEventBySlug } from "@/app/actions/community/events"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import { mutate } from "swr"
import useSWR from "swr"
import { useEffect } from "react"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  published: z.boolean().default(false),
})

const fetcher = async (slug: string) => {
    const res = await getEventBySlug(slug)
    if (!res.success) throw new Error(res.message)
    return res.data
}

export function EditEventClient() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const { data: event, isLoading } = useSWR(["admin:events:detail", slug], () => fetcher(slug))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      slug: "",
      published: false,
    },
  })

  useEffect(() => {
    if (event) {
        form.reset({
            title: event.title,
            description: event.description || "",
            date: new Date(event.date).toISOString().slice(0, 16),
            location: event.location,
            slug: event.slug,
            published: event.published,
        })
    }
  }, [event, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!event) return

    const promise = updateEvent(event.id, {
        ...values,
        date: new Date(values.date),
    })
    
    toast.promise(promise, {
        loading: "Updating event...",
        success: () => {
            mutate("admin:events:list")
            mutate(["admin:events:detail", slug])
            router.push("/admin/events")
            return "Event updated successfully"
        },
        error: "Failed to update event"
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Event</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
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
                  <Input placeholder="event-slug" {...field} />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier for the event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Event description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <FormDescription>
                    Make this event visible to the public.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Update Event</Button>
        </form>
      </Form>
    </div>
  )
}
