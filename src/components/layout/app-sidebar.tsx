'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Youtube } from 'lucide-react';

export function AppSidebar() {
  const { state } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary"
          >
            <Youtube className="h-6 w-6" />
          </Button>
          <h1
            className={`whitespace-nowrap text-lg font-semibold text-foreground transition-opacity duration-300 ${
              state === 'collapsed' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            TrackTube
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip={{ children: 'Dashboard' }}>
              <Home />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
