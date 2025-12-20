"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEvents } from "@/app/actions/community/events"
import { getBlogPosts } from "@/app/actions/social/blog"
import { getPrograms } from "@/app/actions/community/programs"
import { Users, Calendar, BookOpen, FileText, Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// SWR fetcher wrapper for server actions
const fetcher = async (action: () => Promise<any>) => {
  const res = await action()
  if (!res.success) throw new Error(res.message)
  return res.data
}

export function DashboardClient() {
  const { data: events, isLoading: eventsLoading } = useSWR("admin:events:list", () => fetcher(() => getEvents(false)))
  const { data: blogs, isLoading: blogsLoading } = useSWR("admin:blogs:list", () => fetcher(() => getBlogPosts("all")))
  const { data: programs, isLoading: programsLoading } = useSWR("admin:programs:list", () => fetcher(getPrograms))
  
  const stats = [
    {
      title: "Total Events",
      value: events?.length || 0,
      icon: Calendar,
      loading: eventsLoading,
    },
    {
      title: "Active Programs",
      value: programs?.length || 0,
      icon: BookOpen,
      loading: programsLoading,
    },
    {
      title: "Blog Posts",
      value: blogs?.length || 0,
      icon: FileText,
      loading: blogsLoading,
    },
    {
        title: "System Health",
        value: "98%",
        icon: Activity,
        loading: false
    }
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">No recent activity.</p>
            </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground">Coming soon.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
