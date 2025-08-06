import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  AlertTriangle,
  TrendingUp,
  Info,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Suggestion } from "@/lib/suggestion-engine";
import { SuggestionPriority } from "@/lib/suggestion-engine";

interface SuggestionWidgetProps {
  suggestions: Suggestion[];
  title?: string;
  maxVisible?: number;
  onSuggestionClick: (suggestion: Suggestion) => void;
  compact?: boolean;
  className?: string;
}

const priorityConfig = {
  [SuggestionPriority.CRITICAL]: {
    color: 'bg-red-500/10 text-red-700 border-red-500/20',
    icon: AlertTriangle,
    label: 'Critical'
  },
  [SuggestionPriority.HIGH]: {
    color: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
    icon: TrendingUp,
    label: 'High'
  },
  [SuggestionPriority.MEDIUM]: {
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    icon: Info,
    label: 'Medium'
  },
  [SuggestionPriority.LOW]: {
    color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    icon: CheckCircle2,
    label: 'Low'
  }
};

function CompactSuggestionItem({ 
  suggestion, 
  onClick 
}: { 
  suggestion: Suggestion; 
  onClick: (suggestion: Suggestion) => void;
}) {
  const priorityInfo = priorityConfig[suggestion.priority];
  const PriorityIcon = priorityInfo.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-md border cursor-pointer hover:shadow-sm transition-all duration-150",
        priorityInfo.color
      )}
      onClick={() => onClick(suggestion)}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <PriorityIcon className="h-4 w-4 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{suggestion.title}</p>
          <p className="text-xs opacity-75 truncate">{suggestion.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Badge variant="outline" className="text-xs">
          {suggestion.confidence}%
        </Badge>
        <Zap className="h-3 w-3 opacity-50" />
      </div>
    </div>
  );
}

export function SuggestionWidget({
  suggestions,
  title = "Suggestions",
  maxVisible = 3,
  onSuggestionClick,
  compact = false,
  className
}: SuggestionWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleSuggestions = isExpanded ? suggestions : suggestions.slice(0, maxVisible);
  const hasMoreSuggestions = suggestions.length > maxVisible;

  // Group by priority for better display
  const priorityOrder = [
    SuggestionPriority.CRITICAL,
    SuggestionPriority.HIGH,
    SuggestionPriority.MEDIUM,
    SuggestionPriority.LOW
  ];

  const sortedSuggestions = [...visibleSuggestions].sort((a, b) => {
    const aPriorityIndex = priorityOrder.indexOf(a.priority);
    const bPriorityIndex = priorityOrder.indexOf(b.priority);
    if (aPriorityIndex !== bPriorityIndex) {
      return aPriorityIndex - bPriorityIndex;
    }
    return b.confidence - a.confidence;
  });

  if (suggestions.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <Brain className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">No suggestions available</p>
              <p className="text-xs">Add context to see recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Summary stats
  const criticalCount = suggestions.filter(s => s.priority === SuggestionPriority.CRITICAL).length;
  const highCount = suggestions.filter(s => s.priority === SuggestionPriority.HIGH).length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {suggestions.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-1">
            {criticalCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs">
                {criticalCount} Critical
              </Badge>
            )}
            {highCount > 0 && (
              <Badge className="bg-orange-500 text-white text-xs">
                {highCount} High
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {compact ? (
            // Compact view - just list titles with priority colors
            <div className="space-y-1">
              {sortedSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between p-2 rounded text-sm cursor-pointer hover:bg-muted/50"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  <span className="truncate flex-1">{suggestion.title}</span>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Badge
                      className={cn(
                        "text-xs",
                        priorityConfig[suggestion.priority].color
                      )}
                    >
                      {suggestion.confidence}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Full view with descriptions
            <div className="space-y-2">
              {sortedSuggestions.map((suggestion) => (
                <CompactSuggestionItem
                  key={suggestion.id}
                  suggestion={suggestion}
                  onClick={onSuggestionClick}
                />
              ))}
            </div>
          )}

          {hasMoreSuggestions && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show {suggestions.length - maxVisible} More
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* Content is handled by the state change above */}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Inline suggestion badge for quick access
export function SuggestionBadge({ 
  count, 
  criticalCount = 0, 
  onClick 
}: { 
  count: number; 
  criticalCount?: number;
  onClick: () => void;
}) {
  if (count === 0) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="relative"
    >
      <Brain className="h-3 w-3 mr-1" />
      <span>{count} Suggestions</span>
      {criticalCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500 text-white">
          {criticalCount}
        </Badge>
      )}
    </Button>
  );
}

export default SuggestionWidget;
