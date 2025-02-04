'use client';

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-background w-screen">
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-[60px] flex items-center px-6 border-b bg-background sticky top-0 z-10">
            <SidebarTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent" />
            <div className="ml-4 font-semibold flex items-center gap-2 justify-between w-full">
              Admin Panel
              <ThemeToggle />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
} 