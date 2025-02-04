"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Flag,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Home,
  ChevronDown,
  Plus,
  BadgeCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AddReasonDialog from "@/components/AddReasonDialog";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import React from "react";

interface Reason {
  _id: Id<"reasons">;
  reasonText: string;
  initialName: string;
  location?: string;
  tags?: string[];
  _creationTime: number;
}

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Wall",
    icon: MessageSquare,
    href: "/admin/wall",
  },
];

const externalLinks = [
  {
    title: "Landing Page",
    icon: Home,
    href: "/",
  },
  {
    title: "Public Wall",
    icon: MessageSquare,
    href: "/wall",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [showAddReason, setShowAddReason] = useState(false);

  // Fetch flagged reasons
  const flaggedReasons = useQuery(api.reasons.listFlaggedReasons);

  // Group reasons by reasonId
  const groupedReasons = React.useMemo(() => {
    if (!flaggedReasons) return {};

    return flaggedReasons.reduce(
      (acc, flag) => {
        if (!flag.reason) return acc;
        const reasonId = flag.reason._id;
        if (!acc[reasonId]) {
          acc[reasonId] = {
            reason: flag.reason as Reason,
            count: 0,
            reports: [],
          };
        }
        acc[reasonId].count++;
        acc[reasonId].reports.push({
          id: flag._id,
          report: flag.report,
          flaggedAt: flag.flaggedAt,
        });
        return acc;
      },
      {} as Record<
        string,
        {
          reason: Reason;
          count: number;
          reports: Array<{
            id: Id<"flaggedReasons">;
            report: string;
            flaggedAt: number;
          }>;
        }
      >
    );
  }, [flaggedReasons]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const handleItemClick = (href: string) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    router.push(href);
  };

  const handleExternalClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="rounded-xl py-6" variant="floating">
      <SidebarHeader className="py-3">
        <h2
          className={cn(
            "font-semibold transition-all duration-300",
            isCollapsed ? "text-center text-sm" : "text-xl"
          )}
        >
          {isCollapsed ? "RW" : "ReasonsWhy"}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Add Reason Action */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => setShowAddReason(true)}
                >
                  <button className="flex items-center w-full gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Reason</span>
                    <BadgeCheck className="w-4 h-4 ml-auto text-primary" />
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {sidebarItems.map((item) => (
                <SidebarMenuItem
                  key={item.href}
                  className="peer-data-[active=true]/menu-button:opacity-100"
                >
                  <SidebarMenuButton
                    asChild
                    data-active={pathname === item.href}
                    onClick={() => handleItemClick(item.href)}
                  >
                    <button className="flex items-center w-full gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Flagged Reasons Section */}
              <SidebarMenuItem>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      data-active={pathname.startsWith("/admin/flagged")}
                    >
                      <button className="flex items-center w-full gap-2">
                        <Flag className="w-4 h-4" />
                        <span>Flagged</span>
                        <ChevronDown className="w-4 h-4 ml-auto transition-transform ui-expanded:rotate-180" />
                        {Object.keys(groupedReasons).length > 0 && (
                          <span className="ml-auto text-xs bg-destructive text-destructive-foreground rounded-full px-2 py-0.5">
                            {Object.keys(groupedReasons).length}
                          </span>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 space-y-1">
                    <div className="pt-2 space-y-1">
                      {flaggedReasons === undefined ? (
                        <div className="text-sm text-muted-foreground py-2 px-2">
                          Loading...
                        </div>
                      ) : Object.keys(groupedReasons).length === 0 ? (
                        <div className="text-sm text-muted-foreground py-2 px-2">
                          No flagged reasons
                        </div>
                      ) : (
                        Object.entries(groupedReasons).map(
                          ([reasonId, { reason, count }]) => (
                            <button
                              key={reasonId}
                              className="flex items-center justify-between w-full text-sm py-1 px-2 rounded-md hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                              data-active={
                                pathname === `/admin/flagged/${reasonId}`
                              }
                              onClick={() =>
                                handleItemClick(`/admin/flagged/${reasonId}`)
                              }
                            >
                              <span className="truncate">
                                {reason.reasonText}
                              </span>
                              <span className="ml-2 text-xs bg-muted rounded-full px-2 py-0.5">
                                {count}
                              </span>
                            </button>
                          )
                        )
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>External Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {externalLinks.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      onClick={handleExternalClick}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                className="items-center justify-center w-full mb-8"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                {isCollapsed ? "" : "Sign Out"}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Add Reason Dialog */}
      <AddReasonDialog open={showAddReason} onOpenChange={setShowAddReason} />
    </Sidebar>
  );
}
