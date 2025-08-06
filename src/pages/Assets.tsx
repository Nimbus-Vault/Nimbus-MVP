import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Globe2Icon, 
  Plus, 
  Search, 
  ExternalLink, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Target,
  Server,
  Smartphone,
  Code,
  Database
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { assetAdapter } from '@/lib/data-adapter';
import { toast } from 'sonner';
const assetTypeIcons = {
  "Web Application": Globe2Icon,
  "API Endpoint": Code,
  "Mobile Application": Smartphone,
  "Database": Database,
  "Server": Server
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [newAsset, setNewAsset] = useState({
    name: "",
    assetType: "",
    assetUrl: "",
    program: "",
    tags: "",
    notes: ""
  });

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || asset.assetType === typeFilter;
    return matchesSearch && matchesType;
  });

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await assetAdapter.getAll();
      setAssets(data);
    } catch (error) {
      console.error('Failed to load assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCreateAsset = async () => {
    try {
      await assetAdapter.create(newAsset);
      toast.success('Created successfully');
      loadAssets();
      // Reset form state here
    } catch (error) {
      console.error('Failed to create:', error);
      toast.error('Failed to create');
    }
  };

  const handleEditAsset = (asset: any) => {
    setEditingAsset({ ...asset });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAsset = () => {
    console.log("Updating asset:", editingAsset);
    // In real implementation, this would make an API call
    const tagsArray = editingAsset.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
    const index = assets.findIndex(a => a.id === editingAsset.id);
    if (index !== -1) {
      assets[index] = {
        ...editingAsset,
        tags: tagsArray,
        lastTestedAt: new Date().toISOString().split('T')[0]
      };
    }
    setIsEditDialogOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      console.log("Deleting asset:", assetId);
      // In real implementation, this would make an API call
      const index = assets.findIndex(a => a.id === assetId);
      if (index !== -1) {
        assets.splice(index, 1);
      }
    }
  };

  const getAssetIcon = (assetType: string) => {
    const IconComponent = assetTypeIcons[assetType as keyof typeof assetTypeIcons] || Target;
    return IconComponent;
  };

  const assetTypes = [...new Set(assets.map(asset => asset.assetType))];

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assets</h1>
          <p className="text-muted-foreground">
            Manage and track your security testing targets and discovered assets
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
              <DialogDescription>
                Add a new asset to track for security testing and vulnerability assessment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., www.example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={newAsset.assetType} onValueChange={(value) => setNewAsset({ ...newAsset, assetType: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Application">Web Application</SelectItem>
                    <SelectItem value="API Endpoint">API Endpoint</SelectItem>
                    <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={newAsset.assetUrl}
                  onChange={(e) => setNewAsset({ ...newAsset, assetUrl: e.target.value })}
                  className="col-span-3"
                  placeholder="https://example.com or IP:port"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="program" className="text-right">
                  Program
                </Label>
                <Input
                  id="program"
                  value={newAsset.program}
                  onChange={(e) => setNewAsset({ ...newAsset, program: e.target.value })}
                  className="col-span-3"
                  placeholder="Associated program"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="tags"
                  value={newAsset.tags}
                  onChange={(e) => setNewAsset({ ...newAsset, tags: e.target.value })}
                  className="col-span-3"
                  placeholder="production, critical, api (comma separated)"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={newAsset.notes}
                  onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
                  className="col-span-3"
                  placeholder="Additional notes about this asset"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateAsset}>
                Add Asset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {assetTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assets Overview</CardTitle>
          <CardDescription>
            {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Vulnerabilities</TableHead>
                <TableHead>Last Tested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => {
                const IconComponent = getAssetIcon(asset.assetType);
                return (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {asset.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {asset.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{asset.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{asset.assetType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {asset.program}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${asset.vulnCount > 10 ? 'text-red-600' : asset.vulnCount > 5 ? 'text-amber-600' : 'text-green-600'}`}>
                          {asset.vulnCount}
                        </span>
                        <span className="text-muted-foreground text-sm">found</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(asset.lastTestedAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {asset.assetUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={asset.assetUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditAsset(asset)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAsset(asset.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No assets found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || typeFilter !== "all" 
              ? "Try adjusting your search or filter criteria." 
              : "Get started by adding your first asset to track."}
          </p>
          {!searchTerm && typeFilter === "all" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          )}
        </div>
      )}

      {/* Edit Asset Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>
              Update the asset details and information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editingAsset?.name || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                className="col-span-3"
                placeholder="e.g., www.example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={editingAsset?.assetType || ""} onValueChange={(value) => setEditingAsset({ ...editingAsset, assetType: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Application">Web Application</SelectItem>
                  <SelectItem value="API Endpoint">API Endpoint</SelectItem>
                  <SelectItem value="Mobile Application">Mobile Application</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-url" className="text-right">
                URL
              </Label>
              <Input
                id="edit-url"
                value={editingAsset?.assetUrl || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, assetUrl: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com or IP:port"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-program" className="text-right">
                Program
              </Label>
              <Input
                id="edit-program"
                value={editingAsset?.program || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, program: e.target.value })}
                className="col-span-3"
                placeholder="Associated program"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tags" className="text-right">
                Tags
              </Label>
              <Input
                id="edit-tags"
                value={editingAsset?.tags || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, tags: e.target.value })}
                className="col-span-3"
                placeholder="production, critical, api (comma separated)"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                value={editingAsset?.notes || ""}
                onChange={(e) => setEditingAsset({ ...editingAsset, notes: e.target.value })}
                className="col-span-3"
                placeholder="Additional notes about this asset"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateAsset}>
              Update Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
