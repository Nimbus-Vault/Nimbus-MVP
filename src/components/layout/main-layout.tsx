import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MainLayoutProps {
  workspaceName?: string;
}

export default function MainLayout({ workspaceName }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Global Sidebar - Independent scroll context */}
      <div className="hidden md:block w-64 border-r">
        <Sidebar />
      </div>
      
      {/* Main Content Area - Independent scroll context */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header workspaceName={workspaceName} />
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </ScrollArea>
      </div>
      <Toaster />
    </div>
  );
}
