import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Plus, 
  Zap, 
  Layers, 
  Brain, 
  Target,
  CheckSquare,
  Square,
  RefreshCw
} from "lucide-react";
import { EnhancedNoteSpace } from "@/components/ui/enhanced-note-space";
import { SuggestionPanel } from "@/components/ui/suggestion-panel";
import { useSuggestions, useSuggestionContext } from "@/hooks/use-suggestions";
import { AssetType, type AssetTechnology, type AssetFunctionality, type AssetBehavior } from "@/types";
import type { Suggestion } from "@/lib/suggestion-engine";

// Sample asset data (will be loaded from API)
const sampleAsset = {
  id: "1",
  name: "Main Web Application",
  assetType: AssetType.WebApplication,
  assetUrl: "https://app.acme.com",
  discoveredAt: "2024-01-20",
  lastTestedAt: "2024-03-15",
  notes: "# Asset Analysis Notes\n\n## Overview\nPrimary customer-facing application with comprehensive functionality.\n\n## Security Assessment Progress\n- [x] Initial reconnaissance\n- [x] Technology stack identification\n- [ ] Functionality mapping\n- [ ] Behavioral analysis\n\n## Key Findings\n- Modern React-based SPA\n- JWT authentication\n- REST API backend\n- Third-party integrations",
  assignedFunctionalities: [
    { id: "1", name: "Password Reset", category: "Authentication" },
    { id: "2", name: "File Upload", category: "Data Management" }
  ],
  assignedTechnologies: [
    { id: "1", name: "React", category: "JavaScript Framework", vendor: "Meta" },
    { id: "3", name: "Spring Boot", category: "Java Framework", vendor: "VMware" }
  ]
};

// Available functionalities and technologies (will be loaded from API)
const availableFunctionalitiesData = [
  { id: "1", name: "Password Reset", category: "Authentication", assigned: true },
  { id: "2", name: "File Upload", category: "Data Management", assigned: true },
  { id: "3", name: "User Registration", category: "Authentication", assigned: false },
  { id: "4", name: "Payment Processing", category: "Financial", assigned: false },
  { id: "5", name: "Two-Factor Authentication", category: "Authentication", assigned: false },
];

const availableTechnologiesData = [
  { id: "1", name: "React", category: "JavaScript Framework", vendor: "Meta", assigned: true },
  { id: "2", name: "Apache Struts", category: "Java Framework", vendor: "Apache", assigned: false },
  { id: "3", name: "Spring Boot", category: "Java Framework", vendor: "VMware", assigned: true },
  { id: "4", name: "WordPress", category: "CMS", vendor: "WordPress Foundation", assigned: false },
];

// Sample suggestions from the suggestion engine
const sampleSuggestions = [
  {
    id: "1",
    type: "playbook",
    title: "React XSS Testing Playbook",
    description: "Comprehensive XSS testing for React applications",
    relevantTo: ["React", "User Registration"]
  },
  {
    id: "2", 
    type: "technique",
    title: "JWT Token Manipulation",
    description: "Techniques for testing JWT implementation flaws",
    relevantTo: ["Authentication", "Spring Boot"]
  },
  {
    id: "3",
    type: "methodology",
    title: "File Upload Security Testing",
    description: "Systematic approach to testing file upload functionality",
    relevantTo: ["File Upload"]
  },
  {
    id: "4",
    type: "payload",
    title: "React Component Injection Payloads",
    description: "Payloads for testing React component injection vulnerabilities",
    relevantTo: ["React"]
  }
];

export default function AssetDetailPage() {
  const { programId, assetId } = useParams<{ programId: string; assetId: string }>();
  const navigate = useNavigate();
  const [asset] = useState(sampleAsset);
  const [availableFunctionalities, setAvailableFunctionalities] = useState(availableFunctionalitiesData);
  const [availableTechnologies, setAvailableTechnologies] = useState(availableTechnologiesData);
  const [isFunctionalityDialogOpen, setIsFunctionalityDialogOpen] = useState(false);
  const [isTechnologyDialogOpen, setIsTechnologyDialogOpen] = useState(false);

  // Convert sample data to proper types for suggestion engine
  const assetTechnologies: AssetTechnology[] = useMemo(() => 
    asset.assignedTechnologies.map(tech => ({
      id: `asset-tech-${tech.id}`,
      assetId: asset.id,
      technologyTemplateId: tech.id,
      name: tech.name,
      vendor: tech.vendor,
      category: tech.category,
      docUrl: null,
      description: null,
      defaultConfigs: null,
      assignedAt: new Date().toISOString()
    })), [asset.assignedTechnologies]
  );

  const assetFunctionalities: AssetFunctionality[] = useMemo(() => 
    asset.assignedFunctionalities.map(func => ({
      id: `asset-func-${func.id}`,
      assetId: asset.id,
      functionalityTemplateId: func.id,
      name: func.name,
      category: func.category,
      description: null,
      commonEndpoints: null,
      notes: null,
      diagramMd: null,
      commonVectors: null,
      assignedAt: new Date().toISOString()
    })), [asset.assignedFunctionalities]
  );

  const assetBehaviors: AssetBehavior[] = []; // Empty for now, will be populated as user identifies behaviors

  // Create suggestion context
  const suggestionContext = useSuggestionContext(
    asset.id,
    asset.assetType,
    assetTechnologies,
    assetFunctionalities,
    assetBehaviors
  );

  // Use suggestion engine
  const { suggestions, loading: suggestionsLoading, refreshSuggestions } = useSuggestions(suggestionContext);

  const handleBackToProgram = () => {
    navigate(`/app/programs/${programId}`);
  };

  const handleSaveNotes = (content: string) => {
    console.log("Saving asset notes:", content);
    // Here you would update the asset's notes in the backend
  };

  const handleFunctionalityToggle = (functionalityId: string) => {
    setAvailableFunctionalities(prev => 
      prev.map(func => 
        func.id === functionalityId 
          ? { ...func, assigned: !func.assigned }
          : func
      )
    );
  };

  const handleTechnologyToggle = (technologyId: string) => {
    setAvailableTechnologies(prev => 
      prev.map(tech => 
        tech.id === technologyId 
          ? { ...tech, assigned: !tech.assigned }
          : tech
      )
    );
  };

  const handleApplyFunctionalities = () => {
    console.log("Applying functionalities:", availableFunctionalities.filter(f => f.assigned));
    setIsFunctionalityDialogOpen(false);
  };

  const handleApplyTechnologies = () => {
    console.log("Applying technologies:", availableTechnologies.filter(t => t.assigned));
    setIsTechnologyDialogOpen(false);
  };

  const handleNavigateToFunctionality = (functionalityId: string) => {
    navigate(`/app/functionalities/${functionalityId}`);
  };

  const handleNavigateToTechnology = (technologyId: string) => {
    navigate(`/app/technologies/${technologyId}`);
  };

  const handleViewSuggestion = (suggestion: Suggestion) => {
    console.log('Viewing suggestion:', suggestion);
    // Navigate to the appropriate page based on suggestion type
    switch (suggestion.type) {
      case 'playbook':
        navigate('/app/playbooks');
        break;
      case 'technique':
        navigate('/app/techniques');
        break;
      case 'methodology':
        navigate('/app/methodologies');
        break;
      case 'payload':
        navigate('/app/payloads');
        break;
      case 'vulnerability_class':
        navigate('/app/vulnerabilities');
        break;
      case 'technology':
        navigate('/app/technologies');
        break;
      case 'functionality':
        navigate('/app/functionalities');
        break;
      case 'behavior':
        navigate('/app/behaviors');
        break;
      default:
        console.log('Unknown suggestion type:', suggestion.type);
    }
  };

  // Left sidebar items for Functionalities & Technologies
  const leftSidebarItems = [
    // Functionalities section
    ...asset.assignedFunctionalities.map(func => ({
      id: `func-${func.id}`,
      title: func.name,
      onClick: () => handleNavigateToFunctionality(func.id)
    })),
    // Divider
    {
      id: 'divider',
      title: '─────────────────',
      onClick: () => {}
    },
    // Technologies section
    ...asset.assignedTechnologies.map(tech => ({
      id: `tech-${tech.id}`,
      title: tech.name,
      onClick: () => handleNavigateToTechnology(tech.id)
    }))
  ];

  // Right sidebar items for Suggestions
  const rightSidebarItems = sampleSuggestions.map(suggestion => ({
    id: suggestion.id,
    title: `${suggestion.title}`,
    onClick: () => handleViewSuggestion(suggestion)
  }));

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-4 border-b bg-background flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToProgram}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Program
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <h1 className="text-xl font-semibold">{asset.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{asset.assetType}</Badge>
              <span className="text-sm text-muted-foreground">
                Last tested: {new Date(asset.lastTestedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Assign Functionalities Dialog */}
          <Dialog open={isFunctionalityDialogOpen} onOpenChange={setIsFunctionalityDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Zap className="mr-2 h-4 w-4" />
                Assign Functionalities
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Assign Functionalities</DialogTitle>
                <DialogDescription>
                  Select functionalities that this asset implements. Assigned functionalities will appear in the left sidebar.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-4">
                  {availableFunctionalities.map((functionality) => (
                    <div key={functionality.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={functionality.id}
                        checked={functionality.assigned}
                        onCheckedChange={() => handleFunctionalityToggle(functionality.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={functionality.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {functionality.name}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {functionality.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button onClick={handleApplyFunctionalities}>
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Assign Technologies Dialog */}
          <Dialog open={isTechnologyDialogOpen} onOpenChange={setIsTechnologyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Layers className="mr-2 h-4 w-4" />
                Assign Technologies
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Assign Technologies</DialogTitle>
                <DialogDescription>
                  Select technologies that this asset uses. Assigned technologies will appear in the left sidebar.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-4">
                  {availableTechnologies.map((technology) => (
                    <div key={technology.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={technology.id}
                        checked={technology.assigned}
                        onCheckedChange={() => handleTechnologyToggle(technology.id)}
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={technology.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {technology.name}
                        </Label>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {technology.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {technology.vendor}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button onClick={handleApplyTechnologies}>
                  Apply Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Note Space - Flexible height */}
      <div className="flex-1 overflow-hidden">
        <EnhancedNoteSpace
          entity={asset}
          entityType="asset"
          onSave={(updatedAsset) => {
            console.log('Saving asset:', updatedAsset);
            // Update the asset in your data store
          }}
          onClose={() => navigate(`/app/programs/${programId}`)}
          leftSidebarTitle="Functionalities & Technologies"
          rightSidebarTitle="Suggestions"
          showLeftSidebar={true}
          showRightSidebar={true}
          leftSidebarContent={
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Assigned Functionalities</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setIsFunctionalityDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    Assign Functionalities
                  </Button>
                  <div className="space-y-1">
                    {asset.assignedFunctionalities.map((func) => (
                      <div key={func.id} className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80"
                               onClick={() => handleNavigateToFunctionality(func.id)}>
                          {func.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2">Assigned Technologies</h4>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setIsTechnologyDialogOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    Assign Technologies
                  </Button>
                  <div className="space-y-1">
                    {asset.assignedTechnologies.map((tech) => (
                      <div key={tech.id} className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80"
                               onClick={() => handleNavigateToTechnology(tech.id)}>
                          {tech.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
          rightSidebarContent={
            <div className="h-full">
              <SuggestionPanel
                suggestions={suggestions}
                onSuggestionClick={handleViewSuggestion}
                title="Smart Suggestions"
                className="h-full border-0 shadow-none"
                maxSuggestions={20}
              />
              {suggestionsLoading && (
                <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing context...
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
