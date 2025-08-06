import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Briefcase,
  Bug,
  BarChart3,
  ChevronRight,
  Folder,
  Globe2,
  Shield,
} from "lucide-react";
import { ProgramStatus } from "@/types";
import { dashboardAdapter, dataConfig } from "@/lib/data-adapter";
import { useEffect, useState } from "react";
import type { DashboardStats, Activity as ActivityType } from "@/types";

// Format timestamp for display
const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 1 ? 'just now' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activitiesData] = await Promise.all([
          dashboardAdapter.getStats(),
          dashboardAdapter.getActivities(10)
        ]);
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    // Load data on component mount
    loadData();

    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${dataConfig.useSupabase ? 'bg-green-500' : 'bg-yellow-500'}`} />
          Data Source: {dataConfig.source}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Folder className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.workspaces}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.programs.total}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.programs.active} active, {stats.programs.paused} paused
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Globe2 className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.assets}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.platforms || 5}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.vulnerabilities.total}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.vulnerabilities.critical} critical, {stats.vulnerabilities.high} high
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bug className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.techniques || 42}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Payloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.payloads || 156}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Program Status</CardTitle>
            <CardDescription>Overview of your bug bounty programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <span className="font-medium">{stats.programs.active}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <span>Paused</span>
                </div>
                <span className="font-medium">{stats.programs.paused}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <span>Ended</span>
                </div>
                <span className="font-medium">{stats.programs.ended}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Severity</CardTitle>
            <CardDescription>Distribution by severity level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-600"></div>
                  <span>Critical</span>
                </div>
                <span className="font-medium">{stats.vulnerabilities.critical}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span>High</span>
                </div>
                <span className="font-medium">{stats.vulnerabilities.high}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <span>Medium</span>
                </div>
                <span className="font-medium">{stats.vulnerabilities.medium}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Low</span>
                </div>
                <span className="font-medium">{stats.vulnerabilities.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in your workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.resource}</p>
                    <p className="text-xs text-muted-foreground">by {activity.user}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatTimestamp(activity.timestamp)}</div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}