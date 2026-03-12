"use client";

import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

// Settings page widgets
// import { TenantSettings, UserManagement, NotificationSettings, IntegrationSettings } from '@/widgets/dashboard/settings'

export default function SettingsPage() {
  // TODO: Add useSuspenseQuery for settings data when needed
  // const { data } = useSuspenseQuery(SETTINGS_PAGE_QUERY);

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-6 p-6">
        {/* Data loaded - pass to widgets */}
        {/* <TenantSettings /> */}
        {/* <UserManagement /> */}
        {/* <NotificationSettings /> */}
        {/* <IntegrationSettings /> */}
      </div>
    </ScrollArea>
  );
}
