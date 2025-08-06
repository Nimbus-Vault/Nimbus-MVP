import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Layers, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Settings,
  ExternalLink,
  FileCode
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EnhancedNoteSpace } from "@/components/ui/enhanced-note-space";
import { technologyAdapter } from '@/lib/data-adapter';
import type { TechnologyTemplate } from '@/types';
import { toast } from 'sonner';
import { useAppContext } from '@/lib/supabase-app-context';

interface TechnologyDetailProps {
  technology: any;
  onClose: () => void;
  onSave: (content: string) => void;
}

function TechnologyDetail({ technology, onClose, onSave }: TechnologyDetailProps) {
  const handleSave = (updatedTechnology: any) => {
    if (updatedTechnology.notes) {
      onSave(updatedTechnology.notes);
    }
  };

  return (
    <EnhancedNoteSpace
      entity={technology}
      entityType="technology"
      onSave={handleSave}
      onClose={onClose}
      leftSidebarTitle="Default Configs"
      rightSidebarTitle="Default Behaviors"
      showLeftSidebar={true}
      showRightSidebar={true}
      leftSidebarContent={
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Configuration Templates</h4>
            <div className="space-y-2">
              <div className="bg-muted/50 p-2 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">Config</Badge>
                </div>
                <h5 className="text-xs font-medium mb-1">Production Configuration</h5>
                <p className="text-xs text-muted-foreground mb-2">Production-ready settings</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Settings className="h-3 w-3 mr-1" />
                  View Config
                </Button>
              </div>
              <div className="bg-muted/50 p-2 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">Security</Badge>
                </div>
                <h5 className="text-xs font-medium mb-1">Security Settings</h5>
                <p className="text-xs text-muted-foreground mb-2">Security hardening configuration</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Settings className="h-3 w-3 mr-1" />
                  View Config
                </Button>
              </div>
              <div className="bg-muted/50 p-2 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">Performance</Badge>
                </div>
                <h5 className="text-xs font-medium mb-1">Performance Tuning</h5>
                <p className="text-xs text-muted-foreground mb-2">Optimization settings</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Settings className="h-3 w-3 mr-1" />
                  View Config
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
      rightSidebarContent={
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Default Behaviors</h4>
            <div className="space-y-2">
              {technology.defaultBehaviors?.map((behavior: string, index: number) => (
                <div key={index} className="bg-muted/50 p-2 rounded border">
                  <h5 className="text-xs font-medium mb-1">{behavior}</h5>
                  <p className="text-xs text-muted-foreground mb-2">Standard behavior pattern</p>
                  <Button variant="ghost" size="sm" className="h-6 w-full">
                    <Eye className="h-3 w-3 mr-1" />
                    Analyze
                  </Button>
                </div>
              )) || (
                <div className="text-center text-muted-foreground text-xs py-4">
                  No default behaviors defined
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">External Resources</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="h-6 w-full" asChild>
                <a href={technology.docUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Documentation
                </a>
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default function TechnologiesPage() {
  const { currentWorkspaceId } = useAppContext();
  const [technologies, setTechnologies] = useState<TechnologyTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      const data = await technologyAdapter.getAll();
      setTechnologies(data);
    } catch (error) {
      console.error('Failed to load technologies:', error);
      toast.error('Failed to load technologies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState<TechnologyTemplate | null>(null);
  const [newTechnology, setNewTechnology] = useState({
    workspaceId: currentWorkspaceId || 'default-workspace', // TODO: Get from context
    version: '1.0.0',
    name: "",
    vendor: "",
    category: "",
    docUrl: "",
    description: "",
    createdBy: 'current-user',
    modifiedBy: 'current-user'
  });

  const categories = [...new Set(technologies.map(t => t.category))];
  
  const filteredTechnologies = technologies.filter(technology => {
    const matchesSearch = technology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technology.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || technology.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTechnology = async () => {
    try {
      const technologyData = {
        ...newTechnology,
        workspaceId: currentWorkspaceId || 'default-workspace'
      };
      
      await technologyAdapter.create(technologyData);
      toast.success('Technology created successfully');
      setIsCreateDialogOpen(false);
      setNewTechnology({
        workspaceId: currentWorkspaceId || 'default-workspace',
        version: '1.0.0',
        name: "",
        vendor: "",
        category: "",
        docUrl: "",
        description: "",
        createdBy: 'current-user',
        modifiedBy: 'current-user'
      });
      loadTechnologies();
    } catch (error) {
      console.error('Failed to create technology:', error);
      toast.error('Failed to create technology');
    }
  };

  const handleViewTechnology = (technology: any) => {
    setSelectedTechnology(technology);
  };

  const handleSaveNotes = (content: string) => {
    console.log("Saving notes for", selectedTechnology.name, ":", content);
    // Here you would update the technology's notes
  };

  if (selectedTechnology) {
    return (
      <TechnologyDetail
        technology={selectedTechnology}
        onClose={() => setSelectedTechnology(null)}
        onSave={handleSaveNotes}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Technologies</h1>
          <p className="text-muted-foreground">
            Manage technology templates and their security configurations
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Technology
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Technology</DialogTitle>
              <DialogDescription>
                Define a new technology template for security analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newTechnology.name}
                  onChange={(e) => setNewTechnology({ ...newTechnology, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., React"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor" className="text-right">
                  Vendor
                </Label>
                <Input
                  id="vendor"
                  value={newTechnology.vendor}
                  onChange={(e) => setNewTechnology({ ...newTechnology, vendor: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Meta"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newTechnology.category}
                  onChange={(e) => setNewTechnology({ ...newTechnology, category: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., JavaScript Framework"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="docUrl" className="text-right">
                  Documentation URL
                </Label>
                <Input
                  id="docUrl"
                  value={newTechnology.docUrl}
                  onChange={(e) => setNewTechnology({ ...newTechnology, docUrl: e.target.value })}
                  className="col-span-3"
                  placeholder="https://docs.example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="version" className="text-right">
                  Version
                </Label>
                <Input
                  id="version"
                  value={newTechnology.version}
                  onChange={(e) => setNewTechnology({ ...newTechnology, version: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., 1.0.0"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newTechnology.description}
                  onChange={(e) => setNewTechnology({ ...newTechnology, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Describe the technology"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateTechnology}>
                Create Technology
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnologies.map((technology) => (
          <Card key={technology.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewTechnology(technology)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Layers className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{technology.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <Badge variant="secondary">{technology.category}</Badge>
                    <Badge variant="outline">v{technology.version}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleViewTechnology(technology);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Settings className="mr-2 h-4 w-4" />
                      View Configs
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {technology.description}
              </CardDescription>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Vendor:</span>
                  <span className="ml-2">{technology.vendor}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Version:</span>
                  <span className="ml-2">{technology.version}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                <span>Added {new Date(technology.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-1">
                  {technology.docUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a href={technology.docUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Settings className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="text-center py-12">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No technologies found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filter criteria." 
              : "Get started by creating your first technology template."}
          </p>
          {!searchTerm && selectedCategory === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Technology
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
