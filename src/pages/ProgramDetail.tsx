import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BriefcaseIcon, 
  Plus, 
  Search, 
  ExternalLink, 
  Calendar,
  Globe2,
  MoreVertical,
  Edit,
  Trash2,
  ArrowLeft,
  Monitor,
  Eye
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ProgramStatus, AssetType, Program, Asset } from "@/types";
import { programAdapter } from '@/lib/data-adapter';
import { toast } from 'sonner';
import { assetAdapter } from '@/lib/data-adapter';
// Mock assets data for this program

const statusVariants = {
  [ProgramStatus.Active]: "default",
  [ProgramStatus.Paused]: "secondary", 
  [ProgramStatus.Ended]: "outline"
} as const;

export default function ProgramDetailPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await programAdapter.getAll();
      setPrograms(data);
    } catch (error) {
      console.error('Failed to load programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      const data = await assetAdapter.getAll();
      setAssets(data);
    } catch (error) {
      console.error('Failed to load assets:', error);
      toast.error('Failed to load assets');
    }
  };

  useEffect(() => {
    loadPrograms();
    loadAssets();
  }, []);

  const handleCreateAsset = async () => {
    try {
      const assetData = {
        ...newAsset,
        programId: id!,
        discoveredAt: new Date().toISOString(),
        lastTestedAt: new Date().toISOString()
      };
      await assetAdapter.create(assetData);
      toast.success('Asset created successfully');
      loadAssets();
      setIsCreateAssetDialogOpen(false);
      setNewAsset({
        name: "",
        assetType: AssetType.WebApplication,
        assetUrl: "",
        notes: ""
      });
    } catch (error) {
      console.error('Failed to create asset:', error);
      toast.error('Failed to create asset');
    }
  };

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateAssetDialogOpen, setIsCreateAssetDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    assetType: AssetType.WebApplication,
    assetUrl: "",
    notes: ""
  });

  const program = programs.find(p => p.id === id);
  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetUrl?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!program) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested program could not be found.</p>
        <Button onClick={() => navigate('/app/programs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Programs
        </Button>
      </div>
    );
  }


  const handleViewAsset = (assetId: string) => {
    navigate(`/app/programs/${id}/assets/${assetId}`);
  };

  const getStatusColor = (status: ProgramStatus) => {
    switch (status) {
      case ProgramStatus.Active:
        return "bg-green-500";
      case ProgramStatus.Paused:
        return "bg-amber-500";
      case ProgramStatus.Ended:
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAssetTypeIcon = (assetType: AssetType) => {
    switch (assetType) {
      case AssetType.WebApplication:
        return Globe2;
      case AssetType.APIEndpoint:
        return Monitor;
      case AssetType.MobileApplication:
        return Globe2;
      default:
        return Globe2;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/programs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Programs
        </Button>
      </div>

      {/* Program Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <BriefcaseIcon className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-2xl">{program.name}</CardTitle>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(program.status)}`}></div>
                <Badge variant={statusVariants[program.status]}>{program.status}</Badge>
                <Badge variant="outline">{program.platformId}</Badge>
                <span className="text-sm text-muted-foreground">
                  Started {new Date(program.launchDate).toLocaleDateString()}
                </span>
              </div>
              <CardDescription className="max-w-2xl">
                {program.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {program.programUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={program.programUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Platform
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
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Program
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Program
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {program.notes && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground">{program.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assets Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Assets</h2>
          <p className="text-muted-foreground">
            Security assessment targets for this program
          </p>
        </div>
        
        <Dialog open={isCreateAssetDialogOpen} onOpenChange={setIsCreateAssetDialogOpen}>
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
                Add a new asset to this program for security assessment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="asset-name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Asset name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-type" className="text-right">
                  Type
                </Label>
                <Select value={newAsset.assetType} onValueChange={(value) => setNewAsset({ ...newAsset, assetType: value as AssetType })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AssetType.WebApplication}>Web Application</SelectItem>
                    <SelectItem value={AssetType.APIEndpoint}>API Endpoint</SelectItem>
                    <SelectItem value={AssetType.MobileApplication}>Mobile Application</SelectItem>
                    <SelectItem value={AssetType.Database}>Database</SelectItem>
                    <SelectItem value={AssetType.Server}>Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset-url" className="text-right">
                  URL/Link
                </Label>
                <Input
                  id="asset-url"
                  value={newAsset.assetUrl}
                  onChange={(e) => setNewAsset({ ...newAsset, assetUrl: e.target.value })}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="asset-notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="asset-notes"
                  value={newAsset.notes}
                  onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
                  className="col-span-3"
                  placeholder="Asset description or notes"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const AssetIcon = getAssetTypeIcon(asset.assetType);
          
          return (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewAsset(asset.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AssetIcon className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{asset.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{asset.assetType}</Badge>
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
                        handleViewAsset(asset.id);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
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
                {asset.assetUrl && (
                  <div className="mb-4">
                    <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                      {asset.assetUrl}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium">Functionalities:</span>
                    <div className="text-lg font-bold">0</div>
                  </div>
                  <div>
                    <span className="font-medium">Technologies:</span>
                    <div className="text-lg font-bold">0</div>
                  </div>
                  <div>
                    <span className="font-medium">Behaviors:</span>
                    <div className="text-lg font-bold">0</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Discovered {new Date(asset.discoveredAt).toLocaleDateString()}</span>
                  </div>
                  <span>Tested {new Date(asset.lastTestedAt).toLocaleDateString()}</span>
                </div>

                {asset.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {asset.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <Globe2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No assets found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? "Try adjusting your search criteria." 
              : "Add your first asset to start security assessment."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateAssetDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
