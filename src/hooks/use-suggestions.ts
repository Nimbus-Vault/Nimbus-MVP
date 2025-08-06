import { useState, useEffect, useCallback, useMemo } from 'react';
import { suggestionEngine, SuggestionType, SuggestionPriority } from '@/lib/suggestion-engine';
import type { Suggestion, SuggestionContext } from '@/lib/suggestion-engine';
import type { AssetTechnology, AssetFunctionality, AssetBehavior } from '@/types';

export interface UseSuggestionsOptions {
  autoRefresh?: boolean;
  debounceMs?: number;
  maxSuggestions?: number;
  filterByType?: SuggestionType[];
  minConfidence?: number;
  priorityFilter?: SuggestionPriority[];
}

export interface UseSuggestionsResult {
  suggestions: Suggestion[];
  loading: boolean;
  error: string | null;
  refreshSuggestions: () => void;
  clearError: () => void;
  filterByType: (types: SuggestionType[]) => Suggestion[];
  filterByPriority: (priorities: SuggestionPriority[]) => Suggestion[];
  getHighConfidenceSuggestions: (threshold?: number) => Suggestion[];
  getSuggestionsByCategory: (category: string) => Suggestion[];
  stats: {
    total: number;
    byType: Record<SuggestionType, number>;
    byPriority: Record<SuggestionPriority, number>;
    averageConfidence: number;
  };
}

export function useSuggestions(
  context: SuggestionContext | null,
  options: UseSuggestionsOptions = {}
): UseSuggestionsResult {
  const {
    autoRefresh = true,
    debounceMs = 300,
    maxSuggestions = 50,
    filterByType,
    minConfidence = 0,
    priorityFilter
  } = options;

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce context changes
  const [debouncedContext, setDebouncedContext] = useState(context);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedContext(context);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [context, debounceMs]);

  // Generate suggestions when context changes
  const generateSuggestions = useCallback(async () => {
    if (!debouncedContext) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate suggestions from the engine
      const rawSuggestions = suggestionEngine.generateSuggestions(debouncedContext);
      
      // Apply filters
      let filteredSuggestions = rawSuggestions;

      // Filter by confidence
      if (minConfidence > 0) {
        filteredSuggestions = filteredSuggestions.filter(s => s.confidence >= minConfidence);
      }

      // Filter by type
      if (filterByType && filterByType.length > 0) {
        filteredSuggestions = filteredSuggestions.filter(s => filterByType.includes(s.type));
      }

      // Filter by priority
      if (priorityFilter && priorityFilter.length > 0) {
        filteredSuggestions = filteredSuggestions.filter(s => priorityFilter.includes(s.priority));
      }

      // Limit results
      if (maxSuggestions > 0) {
        filteredSuggestions = filteredSuggestions.slice(0, maxSuggestions);
      }

      setSuggestions(filteredSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  }, [debouncedContext, minConfidence, filterByType, priorityFilter, maxSuggestions]);

  // Auto-refresh when context changes
  useEffect(() => {
    if (autoRefresh) {
      generateSuggestions();
    }
  }, [autoRefresh, generateSuggestions]);

  // Manual refresh function
  const refreshSuggestions = useCallback(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Filter functions
  const filterByTypeFunc = useCallback((types: SuggestionType[]) => {
    return suggestionEngine.filterSuggestionsByType(suggestions, types[0]); // Engine method takes single type
  }, [suggestions]);

  const filterByPriority = useCallback((priorities: SuggestionPriority[]) => {
    return suggestions.filter(s => priorities.includes(s.priority));
  }, [suggestions]);

  const getHighConfidenceSuggestions = useCallback((threshold = 80) => {
    return suggestionEngine.getHighConfidenceSuggestions(suggestions, threshold);
  }, [suggestions]);

  const getSuggestionsByCategory = useCallback((category: string) => {
    return suggestions.filter(s => s.category === category);
  }, [suggestions]);

  // Statistics
  const stats = useMemo(() => {
    const byType = suggestions.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<SuggestionType, number>);

    const byPriority = suggestions.reduce((acc, s) => {
      acc[s.priority] = (acc[s.priority] || 0) + 1;
      return acc;
    }, {} as Record<SuggestionPriority, number>);

    const averageConfidence = suggestions.length > 0 
      ? suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length
      : 0;

    return {
      total: suggestions.length,
      byType,
      byPriority,
      averageConfidence: Math.round(averageConfidence * 100) / 100
    };
  }, [suggestions]);

  return {
    suggestions,
    loading,
    error,
    refreshSuggestions,
    clearError,
    filterByType: filterByTypeFunc,
    filterByPriority,
    getHighConfidenceSuggestions,
    getSuggestionsByCategory,
    stats
  };
}

// Hook for managing suggestion context from asset data
export function useSuggestionContext(
  assetId: string,
  assetType: string,
  technologies: AssetTechnology[] = [],
  functionalities: AssetFunctionality[] = [],
  behaviors: AssetBehavior[] = [],
  contextTags: string[] = []
): SuggestionContext | null {
  return useMemo(() => {
    if (!assetId || !assetType) {
      return null;
    }

    return {
      assetId,
      assetType,
      assignedTechnologies: technologies,
      assignedFunctionalities: functionalities,
      assignedBehaviors: behaviors,
      contextTags
    };
  }, [assetId, assetType, technologies, functionalities, behaviors, contextTags]);
}

// Hook for suggestion analytics and insights
export function useSuggestionAnalytics(suggestions: Suggestion[]) {
  return useMemo(() => {
    if (suggestions.length === 0) {
      return {
        isEmpty: true,
        criticalCount: 0,
        highConfidenceCount: 0,
        topCategories: [],
        riskScore: 0,
        completenessScore: 0
      };
    }

    const criticalCount = suggestions.filter(s => s.priority === SuggestionPriority.CRITICAL).length;
    const highConfidenceCount = suggestions.filter(s => s.confidence >= 80).length;
    
    // Top categories by suggestion count
    const categoryCount = suggestions.reduce((acc, s) => {
      if (s.category) {
        acc[s.category] = (acc[s.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Risk score based on critical/high priority suggestions
    const priorityWeights = {
      [SuggestionPriority.CRITICAL]: 4,
      [SuggestionPriority.HIGH]: 3,
      [SuggestionPriority.MEDIUM]: 2,
      [SuggestionPriority.LOW]: 1
    };

    const totalRiskPoints = suggestions.reduce((sum, s) => sum + priorityWeights[s.priority], 0);
    const maxPossibleRisk = suggestions.length * priorityWeights[SuggestionPriority.CRITICAL];
    const riskScore = Math.round((totalRiskPoints / maxPossibleRisk) * 100);

    // Completeness score based on suggestion diversity
    const uniqueTypes = new Set(suggestions.map(s => s.type)).size;
    const maxTypes = Object.keys(SuggestionType).length;
    const completenessScore = Math.round((uniqueTypes / maxTypes) * 100);

    return {
      isEmpty: false,
      criticalCount,
      highConfidenceCount,
      topCategories,
      riskScore,
      completenessScore,
      totalSuggestions: suggestions.length,
      averageConfidence: suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length
    };
  }, [suggestions]);
}

export default useSuggestions;
