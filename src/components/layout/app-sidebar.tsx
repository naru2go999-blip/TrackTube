'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Youtube, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/firebase/client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

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
      <SidebarFooter>
        {loading ? (
          <div className="flex items-center gap-2 p-2">
            <User className="h-6 w-6" />
            <span className={`whitespace-nowrap text-sm font-medium text-muted-foreground transition-opacity duration-300 ${ state === 'collapsed' ? 'opacity-0' : 'opacity-100' }`}>Loading...</span>
          </div>
        ) : user ? (
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <User className="h-6 w-6 flex-shrink-0" />
              <span className={`whitespace-nowrap text-sm font-medium text-foreground truncate transition-opacity duration-300 ${ state === 'collapsed' ? 'opacity-0' : 'opacity-100' }`}>
                {user.displayName || user.email}
              </span>
            </div>
            <SidebarMenuButton onClick={handleSignOut} tooltip={{ children: 'Sign Out' }}>
                <LogOut />
                <span>Sign Out</span>
            </SidebarMenuButton>
          </div>
        ) : (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => router.push('/login')} tooltip={{ children: 'Sign In' }}>
                        <LogOut />
                        <span>Sign In</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )}
      </SidebarFooter>
    </>
  );
}
