import {
  LayoutDashboard, BarChart3, TrendingUp, Newspaper, Archive,
  GitCompare, ThumbsUp, Layers, ArrowUpDown, Sparkles, FolderGit2,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Markets", url: "/markets", icon: TrendingUp, color: "text-sky-500", bg: "bg-sky-500/10" },
  { title: "Social Sentiment", url: "/social-sentiment", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "News Feed", url: "/news", icon: Newspaper, color: "text-violet-500", bg: "bg-violet-500/10" },
  { title: "Compare", url: "/compare", icon: GitCompare, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Trade Flow", url: "/trade", icon: ArrowUpDown, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { title: "Recommendations", url: "/recommendations", icon: ThumbsUp, color: "text-lime-500", bg: "bg-lime-500/10" },
  { title: "AI Genius", url: "/ai-assistant", icon: Sparkles, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
  { title: "Infrastructure", url: "/system-architecture", icon: Layers, color: "text-slate-400", bg: "bg-slate-400/10" },
  { title: "Codebase", url: "/repository", icon: FolderGit2, color: "text-slate-400", bg: "bg-slate-400/10" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-200 group"
                      activeClassName={cn(item.bg, item.color, "border-l-2 border-current shadow-sm")}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", "group-hover:" + item.color)} />
                      {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup className="mt-auto pb-4">
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/50 px-3">
              System
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2">
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-muted-foreground">API: Connected</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <div className="h-1.5 w-1.5 rounded-full bg-chart-3" />
                  <span className="text-muted-foreground">Archive: Cloud</span>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
