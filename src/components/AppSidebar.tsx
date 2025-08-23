
import { useState } from "react";
import { Trophy, BarChart3, Settings, Sparkles, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Optimizer", url: "/", icon: Sparkles },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Benchmarks", url: "/benchmarks", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  onNewChat?: () => void;
}

export function AppSidebar({ onNewChat }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-sidebar-border/50 bg-sidebar/50 backdrop-blur-sm w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* New Chat Button */}
              {onNewChat && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Button
                      onClick={onNewChat}
                      variant="outline"
                      className="w-full justify-start gap-3 px-3 py-2.5 h-auto bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary hover:text-primary"
                    >
                      <Plus className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium">New Chat</span>}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                            : "hover:bg-sidebar-accent/30 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
