import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Brain, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { behaviorAdapter } from '@/lib/data-adapter';
import type { BehaviorTemplate } from '@/types';
import { toast } from 'sonner';
export default function BehaviorsPage() {
  const [behaviors, setBehaviors] = useState<BehaviorTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBehaviors = async () => {
    try {
      setLoading(true);
      const data = await behaviorAdapter.getAll();
      setBehaviors(data);
    } catch (error) {
      console.error('Failed to load behaviors:', error);
      toast.error('Failed to load behaviors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBehaviors();
  }, []);

  const handleCreateBehavior = async () => {
    try {
      await behaviorAdapter.create(newBehavior);
      toast.success('Created successfully');
      loadBehaviors();
      setIsCreateDialogOpen(false);
      setNewBehavior({
        workspaceId: 'default-workspace',
        version: '1.0.0',
        name: "",
        description: "",
        category: "",
        createdBy: 'current-user',
        modifiedBy: 'current-user'
      });
    } catch (error) {
      console.error('Failed to create:', error);
      toast.error('Failed to create');
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBehavior, setNewBehavior] = useState({
    workspaceId: 'default-workspace',
    version: '1.0.0',
    name: "",
    description: "",
    category: "",
    createdBy: 'current-user',
    modifiedBy: 'current-user'
  });

  const filteredBehaviors = behaviors.filter(behavior =>
    behavior.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    behavior.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Behaviors</h1>
          <p className="text-muted-foreground">
            Manage observed application behaviors for security analysis
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Behavior
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Behavior</DialogTitle>
              <DialogDescription>
                Define a new application behavior to use in your analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newBehavior.name}
                  onChange={(e) => setNewBehavior({ ...newBehavior, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Behavior name (e.g., URL Encodes Input)"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newBehavior.description}
                  onChange={(e) => setNewBehavior({ ...newBehavior, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Describe the behavior"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={newBehavior.category}
                  onChange={(e) => setNewBehavior({ ...newBehavior, category: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Input Validation"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateBehavior}>
                Create Behavior
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search behaviors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBehaviors.map((behavior) => (
          <Card key={behavior.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{behavior.name}</CardTitle>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {behavior.description}
              </CardDescription>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Added {new Date(behavior.createdAt).toLocaleDateString()}
                </span>
                <div className="text-muted-foreground">
                  v{behavior.version}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBehaviors.length === 0 && (
        <div className="text-center py-12">
          <Brain className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No behaviors found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? "Try adjusting your search criteria." 
              : "Get started by defining your first behavior."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Behavior
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

