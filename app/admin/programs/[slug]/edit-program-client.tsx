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
import { updateProgram, getProgramBySlug } from "@/app/actions/community/programs"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"
import { mutate } from "swr"
import useSWR from "swr"
import { useEffect } from "react"

const formSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  status: z.enum(["active", "completed", "on_hold", "cancelled", "draft"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

const fetcher = async (slug: string) => {
    const res = await getProgramBySlug(slug)
    if (!res.success) throw new Error(res.message)
    return res.data
}

export function EditProgramClient() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const { data: program, isLoading } = useSWR(["admin:programs:detail", slug], () => fetcher(slug))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      status: "draft",
      startDate: "",
      endDate: "",
    },
  })

  useEffect(() => {
    if (program) {
        form.reset({
            title: program.title,
            slug: program.slug,
            description: program.description,
            status: program.status as any,
            startDate: program.startDate ? new Date(program.startDate).toISOString().slice(0, 16) : "",
            endDate: program.endDate ? new Date(program.endDate).toISOString().slice(0, 16) : "",
        })
    }
  }, [program, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!program) return

    const promise = updateProgram(program.id, {
        ...values,
        startDate: values.startDate ? new Date(values.startDate) : undefined,
        endDate: values.endDate ? new Date(values.endDate) : undefined,
    })
    
    toast.promise(promise, {
        loading: "Updating program...",
        success: () => {
            mutate("admin:programs:list")
            mutate(["admin:programs:detail", slug])
            router.push("/admin/programs")
            return "Program updated successfully"
        },
        error: "Failed to update program"
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Program</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Program title" {...field} />
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
                  <Input placeholder="program-slug" {...field} />
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
                  <Textarea placeholder="Program description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                    <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                    <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Program</Button>
        </form>
      </Form>
    </div>
  )
}
