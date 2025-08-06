import { useState, useEffect } from 'react';
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
  BookIcon, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Shield,
  Layers,
  Cog,
  Settings,
  Tag
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Methodology, MethodologyCategory } from "@/types";
import { methodologyAdapter } from '@/lib/data-adapter';
import { toast } from 'sonner';
const categoryColors = {
  "Web Application Security": "bg-blue-100 text-blue-800 border-blue-200",
  "API Security": "bg-green-100 text-green-800 border-green-200", 
  "Mobile Security": "bg-purple-100 text-purple-800 border-purple-200",
  "Network Security": "bg-orange-100 text-orange-800 border-orange-200",
  "Application Logic": "bg-pink-100 text-pink-800 border-pink-200"
};

export default function MethodologiesPage() {
    const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMethodologies = async () => {
    try {
      setLoading(true);
      const data = await methodologyAdapter.getAll();
      setMethodologies(data);
    } catch (error) {
      console.error('Failed to load methodologies:', error);
      toast.error('Failed to load methodologies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMethodologies();
  }, []);

  const handleCreateMethodologie = async () => {
    try {
      await methodologyAdapter.create(newMethodology);
      toast.success('Created successfully');
      loadMethodologies();
      // Reset form state here
    } catch (error) {
      console.error('Failed to create:', error);
      toast.error('Failed to create');
    }
  };

  const handleUpdateMethodologie = async () => {
    try {
      await methodologyAdapter.update(id, updates);
      toast.success('Updated successfully');
      loadMethodologies();
      // Reset edit state here
    } catch (error) {
      console.error('Failed to update:', error);
      toast.error('Failed to update');
    }
  };

  const handleDeleteMethodologie = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await methodologyAdapter.delete(id);
        toast.success('Deleted successfully');
        loadMethodologies();
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete');
      }
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMethodology, setSelectedMethodology] = useState<any>(null);
  const [methodologyInNoteSpace, setMethodologyInNoteSpace] = useState<any>(null);
  const [editingMethodology, setEditingMethodology] = useState<any>(null);
  const [newMethodology, setNewMethodology] = useState({
    name: "",
    category: "",
    vulnClass: "",
    description: "",
    tags: "",
    contentMd: ""
  });

  const filteredMethodologies = methodologies.filter(methodology => {
    const matchesSearch = methodology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.vulnClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodology.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || methodology.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateMethodology = () => {
    console.log("Creating methodology:", newMethodology);
    // In real implementation, this would make an API call
    methodologies.push({
      id: (methodologies.length + 1).toString(),
      ...newMethodology,
      tags: newMethodology.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdBy: "current.user@example.com",
      createdAt: new Date().toISOString().split('T')[0],
      playbookCount: 0
    });
    setIsCreateDialogOpen(false);
    setNewMethodology({
      name: "",
      category: "",
      vulnClass: "",
      description: "",
      tags: "",
      contentMd: ""
    });
  };

  const handleEditMethodology = (methodology: any) => {
    setEditingMethodology({ ...methodology, tags: methodology.tags.join(', ') });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMethodology = () => {
    console.log("Updating methodology:", editingMethodology);
    // In real implementation, this would make an API call
    const index = methodologies.findIndex(m => m.id === editingMethodology.id);
    if (index !== -1) {
      methodologies[index] = {
        ...editingMethodology,
        tags: editingMethodology.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      };
    }
    setIsEditDialogOpen(false);
    setEditingMethodology(null);
  };

  const handleDeleteMethodology = (methodologyId: string) => {
    if (window.confirm('Are you sure you want to delete this methodology?')) {
      console.log("Deleting methodology:", methodologyId);
      // In real implementation, this would make an API call
      const index = methodologies.findIndex(m => m.id === methodologyId);
      if (index !== -1) {
        methodologies.splice(index, 1);
      }
    }
  };

  const handleOpenNoteSpace = (methodology: any) => {
    setMethodologyInNoteSpace(methodology);
  };

  const handleSaveInNoteSpace = (updatedMethodology: any) => {
    console.log("Saving in note space:", updatedMethodology);
    // In real implementation, this would make an API call
    const index = methodologies.findIndex(m => m.id === updatedMethodology.id);
    if (index !== -1) {
      methodologies[index] = updatedMethodology;
    }
  };

  const categories = [...new Set(methodologies.map(m => m.category))];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Methodologies</h1>
          <p className="text-muted-foreground">
            Organize and manage your security testing methodologies and approaches
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Methodology
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Methodology</DialogTitle>
              <DialogDescription>
                Create a new testing methodology to standardize your security assessment approach.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMethodology.name}
                  onChange={(e) => setNewMethodology({ ...newMethodology, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Methodology name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newMethodology.category}
                  onChange={(e) => setNewMethodology({ ...newMethodology, category: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Web Application Security"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vulnClass" className="text-right">
                  Vulnerability Class
                </Label>
                <Input
                  id="vulnClass"
                  value={newMethodology.vulnClass}
                  onChange={(e) => setNewMethodology({ ...newMethodology, vulnClass: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., SQL Injection"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newMethodology.description}
                  onChange={(e) => setNewMethodology({ ...newMethodology, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Describe the methodology approach"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={newMethodology.tags}
                  onChange={(e) => setNewMethodology({ ...newMethodology, tags: e.target.value })}
                  className="col-span-3"
                  placeholder="web, api, manual (comma separated)"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Initial Content
                </Label>
                <Textarea
                  id="content"
                  value={newMethodology.contentMd}
                  onChange={(e) => setNewMethodology({ ...newMethodology, contentMd: e.target.value })}
                  className="col-span-3"
                  placeholder="Initial methodology content (optional)"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateMethodology}>
                Create Methodology
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Methodology</DialogTitle>
              <DialogDescription>
                Update the methodology details.
              </DialogDescription>
            </DialogHeader>
            {editingMethodology && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingMethodology.name}
                    onChange={(e) => setEditingMethodology({ ...editingMethodology, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Methodology name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="edit-category"
                    value={editingMethodology.category}
                    onChange={(e) => setEditingMethodology({ ...editingMethodology, category: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., Web Application Security"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-vulnClass" className="text-right">
                    Vulnerability Class
                  </Label>
                  <Input
                    id="edit-vulnClass"
                    value={editingMethodology.vulnClass}
                    onChange={(e) => setEditingMethodology({ ...editingMethodology, vulnClass: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., SQL Injection"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={editingMethodology.description}
                    onChange={(e) => setEditingMethodology({ ...editingMethodology, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Describe the methodology approach"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="edit-tags"
                    value={editingMethodology.tags}
                    onChange={(e) => setEditingMethodology({ ...editingMethodology, tags: e.target.value })}
                    className="col-span-3"
                    placeholder="web, api, manual (comma separated)"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateMethodology}>
                Update Methodology
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search methodologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMethodologies.map((methodology) => (
          <Card key={methodology.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <BookIcon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg leading-tight">{methodology.name}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={categoryColors[methodology.category]}>
                      {methodology.category}
                    </Badge>
                    <Badge variant="outline">
                      {methodology.vulnClass}
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
                    <DropdownMenuItem onClick={() => handleOpenNoteSpace(methodology)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Open Note Space
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditMethodology(methodology)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMethodology(methodology.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 line-clamp-3">
                {methodology.description}
              </CardDescription>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {methodology.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag className="mr-1 h-2 w-2" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center space-x-1">
                  <span>{methodology.playbookCount} playbooks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(methodology.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Created by {methodology.createdBy}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMethodologies.length === 0 && (
        <div className="text-center py-12">
          <BookIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No methodologies found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter !== "all" 
              ? "Try adjusting your search or filter criteria." 
              : "Get started by creating your first testing methodology."}
          </p>
          {!searchTerm && categoryFilter === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Methodology
            </Button>
          )}
        </div>
      )}

      {/* Attack Note Space */}
      {methodologyInNoteSpace && (
        <AttackNoteSpace
          entity={methodologyInNoteSpace}
          entityType="methodology"
          onSave={handleSaveInNoteSpace}
          onClose={() => setMethodologyInNoteSpace(null)}
          showLeftSidebar={true}
          showRightSidebar={true}
          leftSidebarTitle="Technologies & Behaviors"
          rightSidebarTitle="Suggestions"
          leftSidebarContent={
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Associated Technologies</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Technology
                  </Button>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">React.js</Badge>
                    <Badge variant="secondary" className="text-xs">Node.js</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Associated Behaviors</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Behavior
                  </Button>
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-xs">Input Validation</Badge>
                  </div>
                </div>
              </div>
            </div>
          }
          rightSidebarContent={
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Suggested Playbooks</h4>
                <div className="space-y-2">
                  <Card className="p-2">
                    <p className="text-xs">SQL Injection Testing Guide</p>
                    <Button variant="ghost" size="sm" className="h-6 w-full mt-1">
                      View
                    </Button>
                  </Card>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Related Techniques</h4>
                <div className="space-y-2">
                  <Card className="p-2">
                    <p className="text-xs">Union-based SQL Injection</p>
                    <Button variant="ghost" size="sm" className="h-6 w-full mt-1">
                      View
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
