import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Image,
  Code
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EnhancedNoteSpace } from "@/components/ui/enhanced-note-space";
import { functionalityAdapter } from '@/lib/data-adapter';
import type { FunctionalityTemplate } from '@/types';
import { toast } from 'sonner';
import { useAppContext } from '@/lib/supabase-app-context';

interface FunctionalityDetailProps {
  functionality: FunctionalityTemplate;
  onClose: () => void;
  onSave: (content: string) => void;
}

function FunctionalityDetail({ functionality, onClose, onSave }: FunctionalityDetailProps) {
  const handleSave = (content: string) => {
    onSave(content);
  };

  return (
    <EnhancedNoteSpace
      entity={functionality}
      entityType="functionality"
      onSave={handleSave}
      onClose={onClose}
      leftSidebarTitle="Workflows"
      rightSidebarTitle="Code Snippets"
      showLeftSidebar={true}
      showRightSidebar={true}
      leftSidebarContent={
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Workflow Diagrams</h4>
            <div className="space-y-2">
              <div className="bg-muted/50 p-2 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">Mermaid</Badge>
                </div>
                <h5 className="text-xs font-medium mb-1">Main Workflow Diagram</h5>
                <p className="text-xs text-muted-foreground mb-2">Primary functionality flow</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Image className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
              <div className="bg-muted/50 p-2 rounded border">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">Mermaid</Badge>
                </div>
                <h5 className="text-xs font-medium mb-1">Error Handling Flow</h5>
                <p className="text-xs text-muted-foreground mb-2">Error and exception handling</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Image className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
      rightSidebarContent={
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Code Snippets</h4>
            <div className="space-y-2">
              <div className="bg-muted/50 p-2 rounded border">
                <h5 className="text-xs font-medium mb-1">Basic Implementation</h5>
                <p className="text-xs text-muted-foreground mb-2">Standard implementation pattern</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Code className="h-3 w-3 mr-1" />
                  View Code
                </Button>
              </div>
              <div className="bg-muted/50 p-2 rounded border">
                <h5 className="text-xs font-medium mb-1">Security Controls</h5>
                <p className="text-xs text-muted-foreground mb-2">Security implementation patterns</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Code className="h-3 w-3 mr-1" />
                  View Code
                </Button>
              </div>
              <div className="bg-muted/50 p-2 rounded border">
                <h5 className="text-xs font-medium mb-1">Testing Examples</h5>
                <p className="text-xs text-muted-foreground mb-2">Unit and integration tests</p>
                <Button variant="ghost" size="sm" className="h-6 w-full">
                  <Code className="h-3 w-3 mr-1" />
                  View Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default function FunctionalitiesPage() {
  const { currentWorkspaceId } = useAppContext();
  const [functionalities, setFunctionalities] = useState<FunctionalityTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFunctionalities = async () => {
    try {
      setLoading(true);
      const data = await functionalityAdapter.getAll();
      setFunctionalities(data);
    } catch (error) {
      console.error('Failed to load functionalities:', error);
      toast.error('Failed to load functionalities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunctionalities();
  }, []);


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFunctionality, setSelectedFunctionality] = useState<FunctionalityTemplate | null>(null);
  const [newFunctionality, setNewFunctionality] = useState({
    workspaceId: currentWorkspaceId || 'default-workspace',
    version: '1.0.0',
    name: "",
    category: "",
    description: "",
    commonEndpoints: "",
    commonVectors: "",
    notes: "",
    diagramMd: "",
    createdBy: 'current-user',
    modifiedBy: 'current-user'
  });

  const categories = [...new Set(functionalities.map(f => f.category))];
  
  const filteredFunctionalities = functionalities.filter(functionality => {
    const matchesSearch = functionality.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         functionality.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         functionality.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || functionality.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateFunctionality = async () => {
    try {
      const functionalityData = {
        ...newFunctionality,
        workspaceId: currentWorkspaceId || 'default-workspace'
      };
      
      await functionalityAdapter.create(functionalityData);
      toast.success('Functionality created successfully');
      setIsCreateDialogOpen(false);
      setNewFunctionality({
        workspaceId: currentWorkspaceId || 'default-workspace',
        version: '1.0.0',
        name: "",
        category: "",
        description: "",
        commonEndpoints: "",
        commonVectors: "",
        notes: "",
        diagramMd: "",
        createdBy: 'current-user',
        modifiedBy: 'current-user'
      });
      loadFunctionalities();
    } catch (error) {
      console.error('Failed to create functionality:', error);
      toast.error('Failed to create functionality');
    }
  };

  const handleViewFunctionality = (functionality: FunctionalityTemplate) => {
    setSelectedFunctionality(functionality);
  };

  const handleSaveNotes = (content: string) => {
    console.log("Saving notes for", selectedFunctionality.name, ":", content);
    // Here you would update the functionality's notes
  };

  if (selectedFunctionality) {
    return (
      <FunctionalityDetail
        functionality={selectedFunctionality}
        onClose={() => setSelectedFunctionality(null)}
        onSave={handleSaveNotes}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Functionalities</h1>
          <p className="text-muted-foreground">
            Manage functionality templates for security analysis
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Functionality
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Functionality</DialogTitle>
              <DialogDescription>
                Define a new functionality template for security testing.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newFunctionality.name}
                  onChange={(e) => setNewFunctionality({ ...newFunctionality, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Password Reset"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newFunctionality.category}
                  onChange={(e) => setNewFunctionality({ ...newFunctionality, category: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Authentication"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newFunctionality.description}
                  onChange={(e) => setNewFunctionality({ ...newFunctionality, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Describe the functionality"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="endpoints" className="text-right pt-2">
                  Common Endpoints
                </Label>
                <Textarea
                  id="endpoints"
                  value={newFunctionality.commonEndpoints}
                  onChange={(e) => setNewFunctionality({ ...newFunctionality, commonEndpoints: e.target.value })}
                  className="col-span-3"
                  placeholder="/api/endpoint1, /endpoint2"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="vectors" className="text-right pt-2">
                  Common Vectors
                </Label>
                <Textarea
                  id="vectors"
                  value={newFunctionality.commonVectors}
                  onChange={(e) => setNewFunctionality({ ...newFunctionality, commonVectors: e.target.value })}
                  className="col-span-3"
                  placeholder="Known attack vectors"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newFunctionality.notes}
                  onChange={(e) => setNewFunctionality({ ...newFunctionality, notes: e.target.value })}
                  className="col-span-3"
                  placeholder="Markdown notes"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateFunctionality}>
                Create Functionality
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search functionalities..."
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
        {filteredFunctionalities.map((functionality) => (
          <Card key={functionality.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewFunctionality(functionality)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{functionality.name}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{functionality.category}</Badge>
                    <Badge variant="outline">v{functionality.version}</Badge>
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
                      handleViewFunctionality(functionality);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Image className="mr-2 h-4 w-4" />
                      View Diagrams
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
                {functionality.description}
              </CardDescription>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Endpoints:</span>
                  <p className="text-xs mt-1 font-mono bg-muted p-1 rounded">
                    {functionality.commonEndpoints}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                <span>Added {new Date(functionality.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center space-x-1">
                  <Code className="h-4 w-4" />
                  <Image className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFunctionalities.length === 0 && (
        <div className="text-center py-12">
          <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No functionalities found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filter criteria." 
              : "Get started by creating your first functionality template."}
          </p>
          {!searchTerm && selectedCategory === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Functionality
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
