import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttackNoteSpace } from "@/components/ui/attack-note-space";
import { 
  ShieldIcon, 
  Plus, 
  Search, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  User,
  Settings,
  FileText
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { VulnerabilitySeverity, VulnClass } from "@/types";
import { vulnClassAdapter } from '@/lib/data-adapter';
import { toast } from 'sonner';
const vulnClasses: VulnClass[] = [
  {
    id: "1",
    workspaceId: "ws-1",
    name: "SQL Injection",
    severity: VulnerabilitySeverity.Critical,
    description: "SQL injection vulnerabilities occur when user input is directly concatenated into SQL queries without proper validation or escaping. This can allow attackers to manipulate database queries and potentially extract, modify, or delete data.",
    createdBy: "john.doe@example.com",
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    workspaceId: "ws-1",
    name: "Cross-Site Scripting (XSS)",
    severity: VulnerabilitySeverity.High,
    description: "XSS vulnerabilities occur when web applications accept and display user input without proper validation or encoding. This allows attackers to inject malicious scripts that execute in other users' browsers.",
    createdBy: "jane.smith@example.com",
    createdAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "3",
    workspaceId: "ws-1",
    name: "Authentication Bypass",
    severity: VulnerabilitySeverity.Critical,
    description: "Authentication bypass vulnerabilities allow attackers to circumvent login mechanisms and gain unauthorized access to systems without valid credentials.",
    createdBy: "mike.wilson@example.com",
    createdAt: "2024-01-25T00:00:00Z"
  },
  {
    id: "4",
    workspaceId: "ws-1",
    name: "Information Disclosure",
    severity: VulnerabilitySeverity.Medium,
    description: "Information disclosure vulnerabilities expose sensitive data to unauthorized users through error messages, debug information, or improper access controls.",
    createdBy: "sarah.johnson@example.com",
    createdAt: "2024-02-01T00:00:00Z"
  },
  {
    id: "5",
    workspaceId: "ws-1",
    name: "Insecure Direct Object References",
    severity: VulnerabilitySeverity.High,
    description: "IDOR vulnerabilities occur when applications expose references to internal objects without proper authorization checks, allowing attackers to access unauthorized data.",
    createdBy: "alex.brown@example.com",
    createdAt: "2024-02-05T00:00:00Z"
  },
  {
    id: "6",
    workspaceId: "ws-1",
    name: "Command Injection",
    severity: VulnerabilitySeverity.Critical,
    description: "Command injection vulnerabilities allow attackers to execute arbitrary operating system commands on the host system by injecting malicious input.",
    createdBy: "chris.davis@example.com",
    createdAt: "2024-02-10T00:00:00Z"
  },
  {
    id: "7",
    workspaceId: "ws-1",
    name: "Business Logic Flaws",
    severity: VulnerabilitySeverity.Medium,
    description: "Business logic flaws are vulnerabilities in the application's workflow that can be exploited to bypass intended functionality or security controls.",
    createdBy: "emma.wilson@example.com",
    createdAt: "2024-02-15T00:00:00Z"
  }
];

const severityColors = {
  [VulnerabilitySeverity.Critical]: "text-red-700 bg-red-100 border-red-200",
  [VulnerabilitySeverity.High]: "text-orange-700 bg-orange-100 border-orange-200",
  [VulnerabilitySeverity.Medium]: "text-amber-700 bg-amber-100 border-amber-200",
  [VulnerabilitySeverity.Low]: "text-green-700 bg-green-100 border-green-200"
};

const severityIcons = {
  [VulnerabilitySeverity.Critical]: XCircle,
  [VulnerabilitySeverity.High]: AlertTriangle,
  [VulnerabilitySeverity.Medium]: AlertCircle,
  [VulnerabilitySeverity.Low]: Info
};

const statusColors = {
  "Open": "bg-red-100 text-red-800 border-red-200",
  "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
  "Fixed": "bg-green-100 text-green-800 border-green-200",
  "Closed": "bg-gray-100 text-gray-800 border-gray-200"
};

export default function VulnerabilitiesPage() {
    const [vulnClasses, setVulnClasses] = useState<VulnClass[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVulnClasses = async () => {
    try {
      setLoading(true);
      const data = await vulnClassAdapter.getAll();
      setVulnClasses(data);
    } catch (error) {
      console.error('Failed to load vulnClasses:', error);
      toast.error('Failed to load vulnClasses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVulnClasses();
  }, []);

  const handleCreateVulnClasse = async () => {
    try {
      await vulnClassAdapter.create(newVulnClass);
      toast.success('Created successfully');
      loadVulnClasses();
      // Reset form state here
    } catch (error) {
      console.error('Failed to create:', error);
      toast.error('Failed to create');
    }
  };

  const handleUpdateVulnClasse = async () => {
    try {
      await vulnClassAdapter.update(id, updates);
      toast.success('Updated successfully');
      loadVulnClasses();
      // Reset edit state here
    } catch (error) {
      console.error('Failed to update:', error);
      toast.error('Failed to update');
    }
  };

  const handleDeleteVulnClasse = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await vulnClassAdapter.delete(id);
        toast.success('Deleted successfully');
        loadVulnClasses();
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete');
      }
    }
  };

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVuln, setSelectedVuln] = useState<string | null>(null);
  const [vulnInNoteSpace, setVulnInNoteSpace] = useState<any>(null);
  const [editingVuln, setEditingVuln] = useState<any>(null);
  const [newVulnClass, setNewVulnClass] = useState({
    name: "",
    severity: VulnerabilitySeverity.Medium,
    description: ""
  });

  const filteredVulnClasses = vulnClasses.filter(vulnClass => {
    const matchesSearch = vulnClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vulnClass.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vulnClass.createdBy?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || vulnClass.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleCreateVulnClass = () => {
    console.log("Creating vulnerability class:", newVulnClass);
    // In real implementation, this would make an API call
    vulnClasses.push({
      id: (vulnClasses.length + 1).toString(),
      workspaceId: "ws-1",
      ...newVulnClass,
      createdBy: "current.user@example.com",
      createdAt: new Date().toISOString()
    });
    setIsCreateDialogOpen(false);
    setNewVulnClass({
      name: "",
      severity: VulnerabilitySeverity.Medium,
      description: ""
    });
  };

  const handleEditVuln = (vuln: any) => {
    setEditingVuln({ ...vuln });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVuln = () => {
    console.log("Updating vulnerability:", editingVuln);
    // In real implementation, this would make an API call
    const index = vulnClasses.findIndex(v => v.id === editingVuln.id);
    if (index !== -1) {
      vulnClasses[index] = editingVuln;
    }
    setIsEditDialogOpen(false);
    setEditingVuln(null);
  };

  const handleDeleteVuln = (vulnId: string) => {
    if (window.confirm('Are you sure you want to delete this vulnerability?')) {
      console.log("Deleting vulnerability:", vulnId);
      // In real implementation, this would make an API call
      const index = vulnClasses.findIndex(v => v.id === vulnId);
      if (index !== -1) {
        vulnClasses.splice(index, 1);
      }
    }
  };

  const handleOpenNoteSpace = (vuln: any) => {
    setVulnInNoteSpace(vuln);
  };

  const handleViewVulnDetails = (vulnId: string) => {
    navigate(`/app/vulnerability-classes/${vulnId}`);
  };

  const handleSaveInNoteSpace = (updatedVuln: any) => {
    console.log("Saving in note space:", updatedVuln);
    // In real implementation, this would make an API call
    const index = vulnClasses.findIndex(v => v.id === updatedVuln.id);
    if (index !== -1) {
      vulnClasses[index] = updatedVuln;
    }
  };

  const getSeverityIcon = (severity: VulnerabilitySeverity) => {
    const IconComponent = severityIcons[severity];
    return IconComponent;
  };

  const severityOptions = Object.values(VulnerabilitySeverity);
  const statusOptions = ["Open", "In Progress", "Fixed", "Closed"];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vulnerabilities</h1>
          <p className="text-muted-foreground">
            Track and manage discovered security vulnerabilities
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Vulnerability
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Report New Vulnerability</DialogTitle>
              <DialogDescription>
                Document a newly discovered security vulnerability for tracking and remediation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newVulnClass.name}
                  onChange={(e) => setNewVulnClass({ ...newVulnClass, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Vulnerability class name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="severity" className="text-right">
                  Severity
                </Label>
                <Select value={newVulnClass.severity} onValueChange={(value) => setNewVulnClass({ ...newVulnClass, severity: value as VulnerabilitySeverity })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map(severity => (
                      <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newVulnClass.description || ""}
                  onChange={(e) => setNewVulnClass({ ...newVulnClass, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Detailed vulnerability class description"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateVulnClass}>
                Create Vulnerability Class
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vulnerabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            {severityOptions.map(severity => (
              <SelectItem key={severity} value={severity}>{severity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVulnClasses.map((vulnClass) => {
          const SeverityIcon = getSeverityIcon(vulnClass.severity);
          return (
            <Card key={vulnClass.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShieldIcon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{vulnClass.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SeverityIcon className="h-4 w-4" />
                      <Badge variant="outline" className={severityColors[vulnClass.severity]}>
                        {vulnClass.severity}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenNoteSpace(vulnClass)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Open Note Space
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewVulnDetails(vulnClass.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditVuln(vulnClass)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteVuln(vulnClass.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vulnClass.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {vulnClass.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{vulnClass.createdBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(vulnClass.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVulnClasses.length === 0 && (
        <div className="text-center py-12">
          <ShieldIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No vulnerability classes found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || severityFilter !== "all"
              ? "Try adjusting your search or filter criteria." 
              : "Get started by creating your first vulnerability class."}
          </p>
          {!searchTerm && severityFilter === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Vulnerability Class
            </Button>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Vulnerability</DialogTitle>
            <DialogDescription>
              Update the vulnerability details.
            </DialogDescription>
          </DialogHeader>
          {editingVuln && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingVuln.name}
                  onChange={(e) => setEditingVuln({ ...editingVuln, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Vulnerability class name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-severity" className="text-right">
                  Severity
                </Label>
                <Select value={editingVuln.severity} onValueChange={(value) => setEditingVuln({ ...editingVuln, severity: value as VulnerabilitySeverity })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map(severity => (
                      <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingVuln.description || ""}
                  onChange={(e) => setEditingVuln({ ...editingVuln, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Detailed vulnerability class description"
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateVuln}>
              Update Vulnerability
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!selectedVuln} onOpenChange={() => setSelectedVuln(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{vulnClasses.find(v => v.id === selectedVuln)?.name}</DialogTitle>
            <DialogDescription>
              Vulnerability Details and Information
            </DialogDescription>
          </DialogHeader>
          {selectedVuln && (
            <div className="space-y-4">
              {(() => {
                const vuln = vulnClasses.find(v => v.id === selectedVuln);
                if (!vuln) return null;
                const SeverityIcon = getSeverityIcon(vuln.severity);
                return (
                  <>
                    <div className="flex items-center space-x-2">
                      <SeverityIcon className="h-5 w-5" />
                      <Badge variant="outline" className={severityColors[vuln.severity]}>
                        {vuln.severity}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">{vuln.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <Label className="text-sm font-medium">Created By</Label>
                        <p className="text-sm text-muted-foreground mt-1">{vuln.createdBy}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created Date</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(vuln.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedVuln(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attack Note Space */}
      {vulnInNoteSpace && (
        <AttackNoteSpace
          entity={vulnInNoteSpace}
          entityType="vulnerability"
          onSave={handleSaveInNoteSpace}
          onClose={() => setVulnInNoteSpace(null)}
          showLeftSidebar={true}
          showRightSidebar={true}
          leftSidebarTitle="Related Technologies"
          rightSidebarTitle="Associated Exploits"
          leftSidebarContent={
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Affected Technologies</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Technology
                  </Button>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">PHP/MySQL</Badge>
                    <Badge variant="secondary" className="text-xs">Node.js</Badge>
                    <Badge variant="secondary" className="text-xs">PostgreSQL</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Vulnerable Components</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Component
                  </Button>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">Input Validation</Badge>
                    <Badge variant="outline" className="text-xs">Query Builder</Badge>
                  </div>
                </div>
              </div>
            </div>
          }
          rightSidebarContent={
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Associated Payloads</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-3 w-3 mr-2" />
                    Link Payload
                  </Button>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">UNION SELECT</Badge>
                    <Badge variant="secondary" className="text-xs">Boolean Blind</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Exploitation Techniques</h4>
                <div className="space-y-2">
                  <Card className="p-2">
                    <p className="text-xs">Manual Testing</p>
                    <Button variant="ghost" size="sm" className="h-6 w-full mt-1">
                      <FileText className="h-3 w-3 mr-1" />
                      View Guide
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
