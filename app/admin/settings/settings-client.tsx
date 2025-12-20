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
import { Switch } from "@/components/ui/switch"
import { getSystemSetting, updateSystemSetting } from "@/app/actions/platform/settings"
import { toast } from "sonner"
import useSWR, { mutate } from "swr"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  siteName: z.string().min(2),
  maintenanceMode: z.boolean(),
})

const fetcher = async () => {
  const [siteNameRes, maintenanceModeRes] = await Promise.all([
    getSystemSetting<string>("site_name"),
    getSystemSetting<boolean>("maintenance_mode"),
  ])
  
  return {
    siteName: siteNameRes.success ? siteNameRes.data : "",
    maintenanceMode: maintenanceModeRes.success ? maintenanceModeRes.data : false,
  }
}

export function SettingsClient() {
  const { data: settings, isLoading } = useSWR("admin:settings:general", fetcher)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      maintenanceMode: false,
    },
  })

  useEffect(() => {
    if (settings) {
        form.reset({
            siteName: settings.siteName || "LOSL-C Platform",
            maintenanceMode: settings.maintenanceMode || false,
        })
    }
  }, [settings, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const promises = [
        updateSystemSetting("site_name", values.siteName, "Global site name"),
        updateSystemSetting("maintenance_mode", values.maintenanceMode, "Put site in maintenance mode"),
    ]
    
    toast.promise(Promise.all(promises), {
        loading: "Updating settings...",
        success: () => {
            mutate("admin:settings:general")
            return "Settings updated successfully"
        },
        error: "Failed to update settings"
    })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage global platform settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                        <Input placeholder="LOSL-C Platform" {...field} />
                        </FormControl>
                        <FormDescription>
                        The name of the platform as it appears to users.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">Maintenance Mode</FormLabel>
                        <FormDescription>
                            Disable public access to the site.
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
                <Button type="submit">Save Changes</Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  )
}
