import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Users, Calendar, Lock, Globe, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { WorkspaceDialog } from "@/components/workspaces/workspace-dialog";
import { getWorkspaces, deleteWorkspace, getPrograms } from "@/lib/data-store";
import { useEffect, useState } from "react";
import { Workspace } from "@/types";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; workspace: Workspace | null }>({ open: false, workspace: null });
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkspaces = () => {
    const allWorkspaces = getWorkspaces();
    const allPrograms = getPrograms();
    
    // Add program counts to workspaces
    const workspacesWithCounts = allWorkspaces.map(workspace => ({
      ...workspace,
      programsCount: allPrograms.filter(program => program.workspaceId === workspace.id).length,
      membersCount: 1 // Default to 1 for now (current user)
    }));
    
    setWorkspaces(workspacesWithCounts);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleDelete = (workspace: Workspace) => {
    setDeleteDialog({ open: true, workspace });
  };

  const confirmDelete = () => {
    if (deleteDialog.workspace) {
      deleteWorkspace(deleteDialog.workspace.id);
      setDeleteDialog({ open: false, workspace: null });
      loadWorkspaces();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <div className="text-center py-8">Loading workspaces...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Organize your security testing projects into dedicated workspaces
          </p>
        </div>
        <WorkspaceDialog onSave={loadWorkspaces} />
      </div>
      
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {workspace.isPublic ? (
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <WorkspaceDialog 
                        workspace={workspace} 
                        onSave={loadWorkspaces}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        }
                      />
                      <DropdownMenuItem
                        onClick={() => handleDelete(workspace)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <CardDescription className="line-clamp-3">
                  {workspace.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{workspace.membersCount || 1} member{(workspace.membersCount || 1) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{workspace.programsCount || 0} program{(workspace.programsCount || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created {formatDate(workspace.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No workspaces yet. Create your first workspace to start organizing your security testing projects.</p>
          <div className="mt-4">
            <WorkspaceDialog onSave={loadWorkspaces} />
          </div>
        </div>
      )}
      
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, workspace: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the workspace "{deleteDialog.workspace?.name}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
