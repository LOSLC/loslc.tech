"use client"

import useSWR, { mutate } from "swr"
import { getNotifications, markNotificationAsRead } from "@/app/actions/platform/settings"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = async () => {
  const res = await getNotifications()
  if (!res.success) throw new Error(res.message)
  return res.data
}

export function NotificationsClient() {
  const { data: notifications, isLoading } = useSWR("admin:notifications:list", fetcher)

  const handleMarkAsRead = async (id: number) => {
    const promise = markNotificationAsRead(id)
    toast.promise(promise, {
      loading: "Marking as read...",
      success: () => {
        mutate("admin:notifications:list")
        return "Notification marked as read"
      },
      error: "Failed to mark as read",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : notifications?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No notifications found.
                </TableCell>
              </TableRow>
            ) : (
              notifications?.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.message}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(notification.createdAt), "PPP")}</TableCell>
                  <TableCell>
                    {!notification.read && (
                        <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(notification.id)}>
                            <Check className="h-4 w-4" />
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
