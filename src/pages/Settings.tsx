import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  SettingsIcon, 
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Globe,
  Download,
  Upload,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    company: "Acme Security",
    title: "Senior Security Researcher"
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    notifications: {
      email: true,
      push: false,
      vulnerabilities: true,
      programs: true,
      assets: false
    },
    dashboard: {
      autoRefresh: true,
      refreshInterval: "30",
      showStats: true,
      compactMode: false
    }
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "24",
    apiAccess: true,
    auditLog: true
  });

  const [data, setData] = useState({
    backupEnabled: true,
    backupFrequency: "weekly",
    retentionPeriod: "1year",
    exportFormat: "json"
  });

  const handleProfileSave = () => {
    console.log("Saving profile:", profile);
    // Handle profile save logic
  };

  const handlePreferencesSave = () => {
    console.log("Saving preferences:", preferences);
    // Handle preferences save logic
  };

  const handleSecuritySave = () => {
    console.log("Saving security settings:", security);
    // Handle security save logic
  };

  const handleDataSave = () => {
    console.log("Saving data settings:", data);
    // Handle data settings save logic
  };

  const handleExportData = () => {
    console.log("Exporting data...");
    // Handle data export logic
  };

  const handleImportData = () => {
    console.log("Importing data...");
    // Handle data import logic
  };

  const handleResetSettings = () => {
    console.log("Resetting settings...");
    // Handle reset logic
  };

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application configuration
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>
            Update your personal information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleProfileSave}>Save Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>
            Customize the look and feel of your application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
            <Select
              value={preferences.theme}
              onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use a more condensed interface layout
              </p>
            </div>
            <Switch
              checked={preferences.dashboard.compactMode}
              onCheckedChange={(checked) => 
                setPreferences({ 
                  ...preferences, 
                  dashboard: { ...preferences.dashboard, compactMode: checked }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how and when you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => 
                setPreferences({ 
                  ...preferences, 
                  notifications: { ...preferences.notifications, email: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vulnerability Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new vulnerabilities
              </p>
            </div>
            <Switch
              checked={preferences.notifications.vulnerabilities}
              onCheckedChange={(checked) => 
                setPreferences({ 
                  ...preferences, 
                  notifications: { ...preferences.notifications, vulnerabilities: checked }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Program Updates</Label>
              <p className="text-sm text-muted-foreground">
                Stay informed about program changes
              </p>
            </div>
            <Switch
              checked={preferences.notifications.programs}
              onCheckedChange={(checked) => 
                setPreferences({ 
                  ...preferences, 
                  notifications: { ...preferences.notifications, programs: checked }
                })
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handlePreferencesSave}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security and access controls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={security.twoFactor ? "default" : "secondary"}>
                {security.twoFactor ? "Enabled" : "Disabled"}
              </Badge>
              <Switch
                checked={security.twoFactor}
                onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after period of inactivity
              </p>
            </div>
            <Select
              value={security.sessionTimeout}
              onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>API Access</Label>
              <p className="text-sm text-muted-foreground">
                Allow API access to your account
              </p>
            </div>
            <Switch
              checked={security.apiAccess}
              onCheckedChange={(checked) => setSecurity({ ...security, apiAccess: checked })}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSecuritySave}>Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <CardTitle>Data Management</CardTitle>
          </div>
          <CardDescription>
            Manage your data backup, export, and import settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup your data
              </p>
            </div>
            <Switch
              checked={data.backupEnabled}
              onCheckedChange={(checked) => setData({ ...data, backupEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Backup Frequency</Label>
              <p className="text-sm text-muted-foreground">
                How often to create backups
              </p>
            </div>
            <Select
              value={data.backupFrequency}
              onValueChange={(value) => setData({ ...data, backupFrequency: value })}
              disabled={!data.backupEnabled}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Data Operations</h4>
              <p className="text-sm text-muted-foreground">
                Export or import your data
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleExportData} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button onClick={handleImportData} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleDataSave}>Save Data Settings</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that will affect your account and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
            <div className="space-y-0.5">
              <Label className="text-destructive">Reset All Settings</Label>
              <p className="text-sm text-muted-foreground">
                Reset all settings to their default values
              </p>
            </div>
            <Button onClick={handleResetSettings} variant="destructive" size="sm">
              Reset Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
