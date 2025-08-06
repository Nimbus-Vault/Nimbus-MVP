import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  BarChart3,
  Globe2,
  Shield,
  Folder,
  Briefcase,
  Settings,
  Book,
  FlaskConical,
  Bug,
  Code2,
  ChevronDown,
  ChevronRight,
  Monitor,
  Zap,
  Brain,
  Layers,
  Target,
  Crosshair,
  Lightbulb,
  Bomb,
} from "lucide-react";

// Navigation structure according to specification
const trackingItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/app/dashboard",
  },
  {
    title: "Workspaces",
    icon: Folder,
    href: "/app/workspaces",
  },
  {
    title: "Platforms",
    icon: Monitor,
    href: "/app/platforms",
  },
  {
    title: "Programs",
    icon: Briefcase,
    href: "/app/programs",
  },
];

const attackSurfaceItems = [
  {
    title: "Functionalities",
    icon: Zap,
    href: "/app/functionalities",
  },
  {
    title: "Technologies",
    icon: Layers,
    href: "/app/technologies",
  },
  {
    title: "Behaviors",
    icon: Brain,
    href: "/app/behaviors",
  },
];

const patternDrivenItems = [
  {
    title: "Vulnerability Classes",
    icon: Shield,
    href: "/app/vulnerability-classes",
  },
  {
    title: "Methodologies",
    icon: Book,
    href: "/app/methodologies",
  },
  {
    title: "Playbooks",
    icon: FlaskConical,
    href: "/app/playbooks",
  },
  {
    title: "Techniques",
    icon: Code2,
    href: "/app/techniques",
  },
  {
    title: "Payloads",
    icon: Bug,
    href: "/app/payloads",
  },
];

const nonPatternDrivenItems = [
  {
    title: "Atomic Vulns",
    icon: Target,
    href: "/app/atomic-vulns",
  },
  {
    title: "Logic Flaws",
    icon: Lightbulb,
    href: "/app/logic-flaws",
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar(props: SidebarProps) {
  const location = useLocation();
  const [trackingOpen, setTrackingOpen] = useState(true);
  const [attackingOpen, setAttackingOpen] = useState(true);
  const [patternDrivenOpen, setPatternDrivenOpen] = useState(true);
  const [nonPatternDrivenOpen, setNonPatternDrivenOpen] = useState(true);
  
  const renderNavItem = (item: any) => (
    <Button
      key={item.href}
      asChild
      variant={location.pathname.startsWith(item.href) ? "secondary" : "ghost"}
      size="sm"
      className="w-full justify-start"
    >
      <Link to={item.href}>
        <item.icon className="mr-2 h-4 w-4" />
        {item.title}
      </Link>
    </Button>
  );
  
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <div className="px-4 py-2 flex items-center gap-2 border-b">
        <img src="/nimbus-logo.svg" alt="Nimbus" className="h-6 w-6" />
        <h2 className="text-lg font-semibold tracking-tight">
          Nimbus Vault
        </h2>
      </div>
      
      {/* Scrollable Navigation */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4 space-y-4">
          {/* Tracking Section */}
          <Collapsible open={trackingOpen} onOpenChange={setTrackingOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2 py-2">
                {trackingOpen ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                <span className="font-semibold">Tracking</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pl-4">
              {trackingItems.map(renderNavItem)}
              
              {/* Attack Surface Divider */}
              <div className="py-2">
                <div className="border-t border-border my-2" />
                <div className="flex items-center gap-2 py-1">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Attack Surface</span>
                </div>
                <div className="space-y-1 mt-2">
                  {attackSurfaceItems.map(renderNavItem)}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Attacking Section */}
          <Collapsible open={attackingOpen} onOpenChange={setAttackingOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2 py-2">
                {attackingOpen ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                <span className="font-semibold">Attacking</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pl-4">
              {/* Pattern Driven */}
              <Collapsible open={patternDrivenOpen} onOpenChange={setPatternDrivenOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1 text-sm">
                    {patternDrivenOpen ? (
                      <ChevronDown className="mr-2 h-3 w-3" />
                    ) : (
                      <ChevronRight className="mr-2 h-3 w-3" />
                    )}
                    <Crosshair className="mr-2 h-3 w-3" />
                    <span className="font-medium">Pattern Driven</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-6">
                  {patternDrivenItems.map(renderNavItem)}
                </CollapsibleContent>
              </Collapsible>
              
              {/* Non Pattern Driven */}
              <Collapsible open={nonPatternDrivenOpen} onOpenChange={setNonPatternDrivenOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start px-2 py-1 text-sm">
                    {nonPatternDrivenOpen ? (
                      <ChevronDown className="mr-2 h-3 w-3" />
                    ) : (
                      <ChevronRight className="mr-2 h-3 w-3" />
                    )}
                    <Bomb className="mr-2 h-3 w-3" />
                    <span className="font-medium">Non Pattern Driven</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pl-6">
                  {nonPatternDrivenItems.map(renderNavItem)}
                </CollapsibleContent>
              </Collapsible>
            </CollapsibleContent>
          </Collapsible>
          
          {/* Settings */}
          <div className="pt-4 border-t border-border">
            <Button
              asChild
              variant={location.pathname.startsWith("/app/settings") ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              <Link to="/app/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
