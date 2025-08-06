import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Target, 
  Shield, 
  Code, 
  BookOpen, 
  Layers,
  Brain,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Suggestion } from "@/lib/suggestion-engine";
import { SuggestionType, SuggestionPriority } from "@/lib/suggestion-engine";

interface SuggestionPanelProps {
  suggestions: Suggestion[];
  title?: string;
  onSuggestionClick: (suggestion: Suggestion) => void;
  className?: string;
  showConfidence?: boolean;
  groupByType?: boolean;
  maxSuggestions?: number;
}

const suggestionTypeIcons: Record<SuggestionType, React.ElementType> = {
  [SuggestionType.TECHNOLOGY]: Layers,
  [SuggestionType.FUNCTIONALITY]: Target,
  [SuggestionType.BEHAVIOR]: Brain,
  [SuggestionType.VULNERABILITY_CLASS]: Shield,
  [SuggestionType.TECHNIQUE]: Code,
  [SuggestionType.PAYLOAD]: Zap,
  [SuggestionType.PLAYBOOK]: BookOpen,
  [SuggestionType.METHODOLOGY]: BookOpen
};

const suggestionTypeLabels: Record<SuggestionType, string> = {
  [SuggestionType.TECHNOLOGY]: 'Technology',
  [SuggestionType.FUNCTIONALITY]: 'Functionality',
  [SuggestionType.BEHAVIOR]: 'Behavior',
  [SuggestionType.VULNERABILITY_CLASS]: 'Vulnerability',
  [SuggestionType.TECHNIQUE]: 'Technique',
  [SuggestionType.PAYLOAD]: 'Payload',
  [SuggestionType.PLAYBOOK]: 'Playbook',
  [SuggestionType.METHODOLOGY]: 'Methodology'
};

const priorityConfig = {
  [SuggestionPriority.CRITICAL]: {
    color: 'bg-red-500 text-white',
    icon: AlertTriangle,
    label: 'Critical'
  },
  [SuggestionPriority.HIGH]: {
    color: 'bg-orange-500 text-white',
    icon: TrendingUp,
    label: 'High'
  },
  [SuggestionPriority.MEDIUM]: {
    color: 'bg-yellow-500 text-white',
    icon: Info,
    label: 'Medium'
  },
  [SuggestionPriority.LOW]: {
    color: 'bg-blue-500 text-white',
    icon: CheckCircle2,
    label: 'Low'
  }
};

function SuggestionCard({ 
  suggestion, 
  onClick, 
  showConfidence = true 
}: { 
  suggestion: Suggestion; 
  onClick: (suggestion: Suggestion) => void;
  showConfidence?: boolean;
}) {
  const Icon = suggestionTypeIcons[suggestion.type];
  const priorityInfo = priorityConfig[suggestion.priority];
  const PriorityIcon = priorityInfo.icon;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/20 hover:border-l-primary/60">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-1 flex-1">
              <CardTitle className="text-sm font-semibold leading-tight">
                {suggestion.title}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {suggestionTypeLabels[suggestion.type]}
                </Badge>
                <Badge className={cn("text-xs", priorityInfo.color)}>
                  <PriorityIcon className="h-3 w-3 mr-1" />
                  {priorityInfo.label}
                </Badge>
              </div>
            </div>
          </div>
          {showConfidence && (
            <Badge variant="outline" className="text-xs">
              {suggestion.confidence}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm mb-3 line-clamp-2">
          {suggestion.description}
        </CardDescription>
        
        {suggestion.relevantTo.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Relevant to:</p>
            <div className="flex flex-wrap gap-1">
              {suggestion.relevantTo.slice(0, 3).map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
              {suggestion.relevantTo.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{suggestion.relevantTo.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {suggestion.category && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {suggestion.category}
            </Badge>
          </div>
        )}
        
        <div className="mt-3 flex justify-end">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              onClick(suggestion);
            }}
            className="text-xs"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function GroupedSuggestions({ 
  suggestions, 
  onSuggestionClick, 
  showConfidence 
}: { 
  suggestions: Suggestion[]; 
  onSuggestionClick: (suggestion: Suggestion) => void;
  showConfidence?: boolean;
}) {
  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const type = suggestion.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(suggestion);
    return groups;
  }, {} as Record<SuggestionType, Suggestion[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => {
        const Icon = suggestionTypeIcons[type as SuggestionType];
        const label = suggestionTypeLabels[type as SuggestionType];
        
        return (
          <div key={type}>
            <div className="flex items-center space-x-2 mb-3">
              <Icon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">{label}</h3>
              <Badge variant="secondary" className="text-xs">
                {typeSuggestions.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {typeSuggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onClick={onSuggestionClick}
                  showConfidence={showConfidence}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SuggestionPanel({
  suggestions,
  title = "Suggestions",
  onSuggestionClick,
  className,
  showConfidence = true,
  groupByType = true,
  maxSuggestions = 50
}: SuggestionPanelProps) {
  const displaySuggestions = suggestions.slice(0, maxSuggestions);

  if (suggestions.length === 0) {
    return (
      <div className={cn("p-6 text-center", className)}>
        <div className="flex flex-col items-center space-y-3">
          <Brain className="h-8 w-8 text-muted-foreground" />
          <div>
            <h3 className="font-medium text-sm text-foreground mb-1">No Suggestions</h3>
            <p className="text-xs text-muted-foreground">
              Add technologies, functionalities, or behaviors to see relevant suggestions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-sm">{title}</h2>
          <Badge variant="secondary" className="text-xs">
            {suggestions.length}
          </Badge>
        </div>
        {suggestions.length > maxSuggestions && (
          <Badge variant="outline" className="text-xs">
            Showing {maxSuggestions} of {suggestions.length}
          </Badge>
        )}
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {groupByType ? (
          <GroupedSuggestions 
            suggestions={displaySuggestions}
            onSuggestionClick={onSuggestionClick}
            showConfidence={showConfidence}
          />
        ) : (
          <div className="space-y-3">
            {displaySuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onClick={onSuggestionClick}
                showConfidence={showConfidence}
              />
            ))}
          </div>
        )}
        
        {suggestions.length > maxSuggestions && (
          <>
            <Separator className="my-4" />
            <div className="text-center text-xs text-muted-foreground">
              {suggestions.length - maxSuggestions} more suggestions available
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  );
}

export default SuggestionPanel;
