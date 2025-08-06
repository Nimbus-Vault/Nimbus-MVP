import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from "lucide-react";
import { Workspace } from "@/types";
import { addWorkspace, updateWorkspace } from "@/lib/data-store";

interface WorkspaceDialogProps {
  workspace?: Workspace;
  onSave: () => void;
  trigger?: React.ReactNode;
}

export function WorkspaceDialog({ workspace, onSave, trigger }: WorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(workspace?.name || "");
  const [description, setDescription] = useState(workspace?.description || "");
  const [isPublic, setIsPublic] = useState(workspace?.isPublic || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    
    try {
      if (workspace) {
        // Edit existing workspace
        updateWorkspace(workspace.id, {
          name: name.trim(),
          description: description.trim() || null,
          isPublic,
        });
      } else {
        // Create new workspace
        addWorkspace({
          name: name.trim(),
          description: description.trim() || null,
          isPublic,
          createdBy: "current-user",
          ownerId: "current-user",
        });
      }
      
      onSave();
      setOpen(false);
      
      // Reset form for new workspaces
      if (!workspace) {
        setName("");
        setDescription("");
        setIsPublic(false);
      }
    } catch (error) {
      console.error("Failed to save workspace:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = workspace ? (
    <Button variant="ghost" size="icon">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      New Workspace
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {workspace ? "Edit Workspace" : "Create New Workspace"}
            </DialogTitle>
            <DialogDescription>
              {workspace 
                ? "Update your workspace details below."
                : "Create a new workspace to organize your security testing projects."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Workspace"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this workspace..."
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="public">Make workspace public</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Saving..." : (workspace ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
