import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Outlet } from "react-router-dom";
import { ExitConfirmationDialog } from "@/components/ExitConfirmationDialog";
import { useState, useEffect } from "react";

export function AppLayout() {
  const [showExit, setShowExit] = useState(false);

  // Listen for browser tab close to show exit dialog
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave CryptoRisk AI?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavbar onExitClick={() => setShowExit(true)} />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <ExitConfirmationDialog
        isOpen={showExit}
        hasUnsavedChanges={false}
        onOpenChange={setShowExit}
        onConfirmClose={() => {
          setShowExit(false);
          window.location.href = "/";
        }}
        onSave={async () => true}
      />
    </SidebarProvider>
  );
}
