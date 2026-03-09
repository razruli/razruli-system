"use client";

import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  Workflow,
  BarChart3,
  UserPlus,
  BrainCircuit,
  FolderOpen,
  FolderClosed,
  FileText,
  Settings,
  ChevronRight,
  LogOut,
  ChevronsUpDown,
  Sparkles,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/shared/ui";

import { ThemeToggle } from "../theme-toggle";

const workspaces = [
  {
    label: "Strategy 2026",
    icon: FolderOpen,
    children: [
      { label: "Q1 Planning", href: "#" },
      { label: "Q2 Planning", href: "#" },
      { label: "Annual Review", href: "#" },
    ],
  },
  {
    label: "Engineering",
    icon: FolderClosed,
    children: [
      { label: "Team Structure", href: "#" },
      { label: "Capacity Model", href: "#" },
    ],
  },
  {
    label: "Marketing",
    icon: FolderClosed,
    children: [
      { label: "Hiring Plan", href: "#" },
      { label: "Budget Allocation", href: "#" },
    ],
  },
];

const mainNav = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Departments", icon: Building2, href: "#" },
  { label: "Employees", icon: Users, href: "#" },
  { label: "Processes", icon: Workflow, href: "#" },
  { label: "Workload Analysis", icon: BarChart3, href: "#" },
  { label: "Hiring Strategy", icon: UserPlus, href: "#" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary-foreground"
            >
              <path
                d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 3a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            StratOps
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* AI Assistant */}
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="AI Assistant"
                  isActive={pathname === "/dashboard/assistant"}
                >
                  <Link href="/dashboard/assistant">
                    <BrainCircuit className="size-4" />
                    <span>AI Assistant</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="AI Insights">
                  <Sparkles className="size-4" />
                  <span>AI Insights</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Workspace folders */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaces.map((folder) => (
                <WorkspaceFolder key={folder.label} folder={folder} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Reports">
              <FileText className="size-4" />
              <span>Reports</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        {/* User account */}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip="Account">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col text-left text-sm leading-tight">
                    <span className="truncate font-medium text-sidebar-foreground">
                      John Doe
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      john@company.com
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function WorkspaceFolder({ folder }: { folder: (typeof workspaces)[0] }) {
  const [open, setOpen] = useState(folder.icon === FolderOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={folder.label}>
            <folder.icon className="size-4" />
            <span>{folder.label}</span>
            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {folder.children.map((child) => (
              <SidebarMenuSubItem key={child.label}>
                <SidebarMenuButton asChild size="sm">
                  <a href={child.href}>
                    <span>{child.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/assistant": "AI Assistant",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border px-6">
      <SidebarTrigger />
      <div className="flex flex-1 items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
