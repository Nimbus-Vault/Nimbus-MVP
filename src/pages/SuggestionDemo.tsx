import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SuggestionPanel } from "@/components/ui/suggestion-panel";
import { SuggestionWidget } from "@/components/ui/suggestion-widget";
import { useSuggestions, useSuggestionContext, useSuggestionAnalytics } from "@/hooks/use-suggestions";
import { 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  Layers,
  RefreshCw,
  BarChart3,
  Settings
} from "lucide-react";
import { AssetType, type AssetTechnology, type AssetFunctionality, type AssetBehavior } from "@/types";
import type { Suggestion } from "@/lib/suggestion-engine";

// Demo data for testing the suggestion engine
const demoTechnologies = [
  { id: "1", name: "React", category: "JavaScript Framework", vendor: "Meta" },
  { id: "2", name: "Apache Struts", category: "Java Framework", vendor: "Apache" },
  { id: "3", name: "Spring Boot", category: "Java Framework", vendor: "VMware" },
  { id: "4", name: "WordPress", category: "CMS", vendor: "WordPress Foundation" },
  { id: "5", name: "PHP", category: "Programming Language", vendor: "The PHP Group" },
  { id: "6", name: "Node.js", category: "Runtime Environment", vendor: "OpenJS Foundation" },
  { id: "7", name: "Express.js", category: "Web Framework", vendor: "OpenJS Foundation" },
];

const demoFunctionalities = [
  { id: "1", name: "File Upload", category: "Data Management" },
  { id: "2", name: "User Authentication", category: "Authentication" },
  { id: "3", name: "Password Reset", category: "Authentication" },
  { id: "4", name: "Payment Processing", category: "Financial" },
  { id: "5", name: "User Registration", category: "Authentication" },
  { id: "6", name: "Profile Upload", category: "User Management" },
  { id: "7", name: "Document Upload", category: "Data Management" },
];

const demoAssetTypes = [
  AssetType.WebApplication,
  AssetType.APIEndpoint,
  AssetType.MobileApplication,
  AssetType.Database,
  AssetType.Server
];

export default function SuggestionDemoPage() {
  const [selectedAssetType, setSelectedAssetType] = useState(AssetType.WebApplication);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(["1", "3"]); // React, Spring Boot
  const [selectedFunctionalities, setSelectedFunctionalities] = useState<string[]>(["1", "2"]); // File Upload, Auth
  
  // Convert selections to proper format for suggestion engine
  const assetTechnologies: AssetTechnology[] = useMemo(() => 
    demoTechnologies
      .filter(tech => selectedTechnologies.includes(tech.id))
      .map(tech => ({
        id: `demo-tech-${tech.id}`,
        assetId: "demo-asset-1",
        technologyTemplateId: tech.id,
        name: tech.name,
        vendor: tech.vendor,
        category: tech.category,
        docUrl: null,
        description: null,
        defaultConfigs: null,
        assignedAt: new Date().toISOString()
      })), [selectedTechnologies]
  );

  const assetFunctionalities: AssetFunctionality[] = useMemo(() => 
    demoFunctionalities
      .filter(func => selectedFunctionalities.includes(func.id))
      .map(func => ({
        id: `demo-func-${func.id}`,
        assetId: "demo-asset-1",
        functionalityTemplateId: func.id,
        name: func.name,
        category: func.category,
        description: null,
        commonEndpoints: null,
        notes: null,
        diagramMd: null,
        commonVectors: null,
        assignedAt: new Date().toISOString()
      })), [selectedFunctionalities]
  );

  const assetBehaviors: AssetBehavior[] = []; // Demo doesn't include behaviors for simplicity

  // Create suggestion context
  const suggestionContext = useSuggestionContext(
    "demo-asset-1",
    selectedAssetType,
    assetTechnologies,
    assetFunctionalities,
    assetBehaviors
  );

  // Use suggestion engine
  const { suggestions, loading, refreshSuggestions, stats } = useSuggestions(suggestionContext);
  
  // Analytics
  const analytics = useSuggestionAnalytics(suggestions);

  const handleTechnologyToggle = (techId: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(techId) 
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  const handleFunctionalityToggle = (funcId: string) => {
    setSelectedFunctionalities(prev => 
      prev.includes(funcId) 
        ? prev.filter(id => id !== funcId)
        : [...prev, funcId]
    );
  };

  const handleViewSuggestion = (suggestion: Suggestion) => {
    console.log('Viewing suggestion:', suggestion);
    // In a real app, this would navigate to the appropriate page
    alert(`Viewing ${suggestion.type}: ${suggestion.title}\n\n${suggestion.description}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Nimbus Vault Suggestion Engine</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interactive demo showcasing contextual security recommendations based on asset context.
          Select technologies and functionalities to see intelligent suggestions for vulnerabilities,
          techniques, payloads, and methodologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Asset Context</span>
              </CardTitle>
              <CardDescription>
                Configure the asset context to generate relevant suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Asset Type Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Asset Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  {demoAssetTypes.map(assetType => (
                    <div key={assetType} className="flex items-center space-x-2">
                      <Checkbox
                        id={assetType}
                        checked={selectedAssetType === assetType}
                        onCheckedChange={() => setSelectedAssetType(assetType)}
                      />
                      <Label htmlFor={assetType} className="text-sm cursor-pointer">
                        {assetType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technology Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Technologies</Label>
                <div className="space-y-2">
                  {demoTechnologies.map(tech => (
                    <div key={tech.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={tech.id}
                        checked={selectedTechnologies.includes(tech.id)}
                        onCheckedChange={() => handleTechnologyToggle(tech.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={tech.id} className="text-sm cursor-pointer block">
                          {tech.name}
                        </Label>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">{tech.category}</Badge>
                          <Badge variant="secondary" className="text-xs">{tech.vendor}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Functionality Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Functionalities</Label>
                <div className="space-y-2">
                  {demoFunctionalities.map(func => (
                    <div key={func.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={func.id}
                        checked={selectedFunctionalities.includes(func.id)}
                        onCheckedChange={() => handleFunctionalityToggle(func.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={func.id} className="text-sm cursor-pointer block">
                          {func.name}
                        </Label>
                        <Badge variant="outline" className="text-xs mt-1">{func.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={refreshSuggestions} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                Generate Suggestions
              </Button>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!analytics.isEmpty ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{suggestions.length}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{analytics.criticalCount}</div>
                      <div className="text-xs text-muted-foreground">Critical</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Risk Score</div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-red-500 h-2 rounded-full" 
                        style={{ width: `${analytics.riskScore}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{analytics.riskScore}%</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Coverage</div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-green-500 h-2 rounded-full" 
                        style={{ width: `${analytics.completenessScore}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{analytics.completenessScore}%</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Select context to see analytics
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="panel" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="panel">Full Panel View</TabsTrigger>
              <TabsTrigger value="widget">Compact Widget</TabsTrigger>
            </TabsList>

            <TabsContent value="panel" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Smart Suggestions</span>
                  </CardTitle>
                  <CardDescription>
                    Contextual recommendations based on your asset configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] border rounded-lg">
                    <SuggestionPanel
                      suggestions={suggestions}
                      onSuggestionClick={handleViewSuggestion}
                      title="Contextual Recommendations"
                      className="h-full"
                      groupByType={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="widget" className="space-y-4">
              <div className="grid gap-4">
                {/* Compact Widget */}
                <SuggestionWidget
                  suggestions={suggestions}
                  onSuggestionClick={handleViewSuggestion}
                  title="Quick Suggestions"
                  maxVisible={3}
                />

                {/* Ultra-compact Widget */}
                <SuggestionWidget
                  suggestions={suggestions}
                  onSuggestionClick={handleViewSuggestion}
                  title="Compact View"
                  maxVisible={5}
                  compact={true}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer with Engine Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Powered by rule-based ontological relationships</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This suggestion engine uses deterministic rule evaluation based on 
              pre-defined vulnerability ontology relationships, not AI/ML algorithms.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
