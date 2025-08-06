# Nimbus Vault Suggestion Engine

## Overview

The Nimbus Vault Suggestion Engine is a **rule-based, deterministic system** that provides contextually relevant security recommendations to researchers. Unlike AI/ML-based systems, it leverages pre-defined ontological relationships and explicit rule mappings to suggest vulnerabilities, techniques, payloads, and methodologies based on asset context.

## Key Features

### 🧠 **Rule-Based Intelligence**
- Deterministic suggestions based on explicit rules and relationships
- No AI/ML dependencies - purely ontological approach
- Transparent and predictable recommendation logic

### 🎯 **Contextual Recommendations**
- Analyzes asset technologies, functionalities, and behaviors
- Provides targeted suggestions based on specific combinations
- Supports complex conditional logic for nuanced scenarios

### 📊 **Multi-Type Suggestions**
- **Vulnerability Classes**: Common security flaws for given contexts
- **Techniques**: Specific testing and exploitation methods
- **Payloads**: Ready-to-use attack vectors and test cases
- **Playbooks**: Complete methodological workflows
- **Behaviors**: Expected system characteristics to investigate
- **Technologies/Functionalities**: Additional context to consider

### ⚡ **Performance Optimized**
- Real-time suggestion generation
- Efficient rule evaluation algorithms
- Debounced context changes to prevent excessive processing
- Configurable suggestion limits and filtering

## Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Asset Context    │───▶│  Suggestion Engine   │───▶│    Suggestions      │
│                     │    │                      │    │                     │
│ • Technologies      │    │ • Rule Evaluation    │    │ • Vulnerability     │
│ • Functionalities   │    │ • Context Analysis   │    │   Classes           │
│ • Behaviors         │    │ • Priority Scoring   │    │ • Techniques        │
│ • Asset Type        │    │ • Confidence Rating  │    │ • Payloads          │
└─────────────────────┘    └──────────────────────┘    │ • Playbooks         │
                                                        │ • Behaviors         │
                                                        └─────────────────────┘
```

## Core Components

### 1. Suggestion Engine (`src/lib/suggestion-engine.ts`)

The main engine class responsible for:
- **Rule Management**: Loading and managing suggestion rules
- **Context Analysis**: Interpreting asset context for relevance
- **Suggestion Generation**: Creating prioritized recommendations
- **Filtering & Scoring**: Applying confidence ratings and priorities

### 2. React Hook (`src/hooks/use-suggestions.ts`)

Provides React integration with:
- **Auto-refresh**: Automatic suggestion updates on context changes
- **Loading States**: Progress tracking for async operations
- **Error Handling**: Graceful failure management
- **Analytics**: Statistical insights into suggestion patterns

### 3. UI Components

#### SuggestionPanel (`src/components/ui/suggestion-panel.tsx`)
- Full-featured suggestion display
- Grouping by type and priority
- Detailed suggestion cards with metadata
- Scrollable interface for large suggestion sets

#### SuggestionWidget (`src/components/ui/suggestion-widget.tsx`)
- Compact suggestion display
- Collapsible/expandable interface
- Priority-based highlighting
- Integration-friendly design

## Usage Examples

### Basic Integration

```typescript
import { useSuggestions, useSuggestionContext } from '@/hooks/use-suggestions';
import { SuggestionPanel } from '@/components/ui/suggestion-panel';

function AssetAnalysis({ asset }) {
  // Create suggestion context
  const context = useSuggestionContext(
    asset.id,
    asset.type,
    asset.technologies,
    asset.functionalities,
    asset.behaviors
  );

  // Get suggestions
  const { suggestions, loading } = useSuggestions(context);

  return (
    <SuggestionPanel
      suggestions={suggestions}
      onSuggestionClick={handleSuggestion}
      loading={loading}
    />
  );
}
```

### Custom Rule Creation

```typescript
import { suggestionEngine } from '@/lib/suggestion-engine';

// Add custom rule for specific technology combination
suggestionEngine.addRule({
  id: 'custom-react-upload',
  name: 'React File Upload Security',
  conditions: [
    { type: 'technology', value: 'React', operator: 'equals' },
    { type: 'functionality', value: 'File Upload', operator: 'contains' }
  ],
  suggestions: [{
    type: 'TECHNIQUE',
    title: 'React Component Upload Bypass',
    description: 'Test for client-side validation bypasses in React upload components',
    confidence: 85,
    category: 'Upload Security'
  }],
  priority: 'HIGH'
});
```

### Advanced Filtering

```typescript
const { suggestions, filterByType, getHighConfidenceSuggestions } = useSuggestions(context, {
  minConfidence: 70,
  maxSuggestions: 20,
  priorityFilter: ['CRITICAL', 'HIGH']
});

// Get only technique suggestions
const techniques = filterByType(['TECHNIQUE']);

// Get high-confidence suggestions only
const highConfidence = getHighConfidenceSuggestions(80);
```

## Pre-defined Rules

The engine comes with comprehensive rules covering:

### Technology-Based Rules
- **React**: XSS vulnerabilities, component injection, unsafe rendering
- **Apache Struts**: RCE vulnerabilities, OGNL injection
- **Spring Boot**: Actuator exposure, configuration vulnerabilities
- **WordPress**: Plugin vulnerabilities, CMS-specific attacks
- **PHP**: File inclusion, type juggling, deserialization

### Functionality-Based Rules
- **File Upload**: Extension bypasses, path traversal, RCE via upload
- **Authentication**: Session management, password policies, bypass techniques
- **Payment Processing**: Business logic flaws, transaction manipulation

### Combination Rules
- **PHP + File Upload**: Web shell deployment, RFI/LFI exploitation
- **React + Authentication**: JWT manipulation, client-side bypass
- **Struts + Any Functionality**: Framework-specific RCE vectors

## Configuration

### Rule Priority Levels
- **CRITICAL**: Immediate security concerns requiring urgent attention
- **HIGH**: Significant vulnerabilities with high exploitability
- **MEDIUM**: Moderate risk findings worth investigating
- **LOW**: Minor issues or hardening recommendations

### Confidence Scoring
- **90-100%**: Well-established, documented attack vectors
- **70-89%**: Likely vulnerabilities based on common patterns
- **50-69%**: Possible issues requiring investigation
- **Below 50%**: Speculative or context-dependent suggestions

## Integration Points

### Asset Detail Pages
```typescript
// Integrated into asset analysis workflow
<EnhancedNoteSpace
  rightSidebarContent={
    <SuggestionPanel
      suggestions={suggestions}
      onSuggestionClick={handleSuggestionClick}
    />
  }
/>
```

### Dashboard Widgets
```typescript
// Quick suggestion overview
<SuggestionWidget
  suggestions={suggestions}
  compact={true}
  maxVisible={3}
/>
```

### Data Adapter
```typescript
import { suggestionAdapter } from '@/lib/data-adapter';

// Generate suggestions through data layer
const suggestions = await suggestionAdapter.generateSuggestions(context);
```

## Analytics & Insights

The engine provides comprehensive analytics:

```typescript
const analytics = useSuggestionAnalytics(suggestions);

console.log({
  riskScore: analytics.riskScore,        // Overall risk assessment
  completenessScore: analytics.completenessScore, // Coverage analysis
  criticalCount: analytics.criticalCount, // High-priority issues
  topCategories: analytics.topCategories  // Most common suggestion types
});
```

## Performance Considerations

### Optimization Strategies
1. **Debounced Updates**: Context changes are debounced to prevent excessive re-computation
2. **Rule Caching**: Rule evaluation results are cached for repeated contexts
3. **Lazy Loading**: Suggestion details loaded on-demand
4. **Configurable Limits**: Maximum suggestion counts prevent UI overload

### Memory Management
- Suggestion objects use minimal memory footprint
- Rule engine maintains efficient internal state
- Automatic cleanup of stale suggestions

## Extending the Engine

### Adding New Rule Types
```typescript
// Extend rule condition types
interface CustomRuleCondition extends RuleCondition {
  type: 'custom_context' | 'vulnerability_history' | 'compliance_requirement';
}

// Implement custom evaluation logic
class CustomSuggestionEngine extends SuggestionEngine {
  protected evaluateCustomCondition(condition: CustomRuleCondition, context: SuggestionContext): boolean {
    // Custom evaluation logic
    return true;
  }
}
```

### Plugin Architecture
The engine supports plugin extensions for:
- Custom suggestion types
- External data integration
- Advanced filtering algorithms
- Custom UI components

## Best Practices

### Rule Design
1. **Specific Conditions**: Use precise matching criteria to avoid false positives
2. **Confidence Scoring**: Assign realistic confidence levels based on attack feasibility
3. **Priority Assignment**: Reserve CRITICAL for immediate security concerns
4. **Description Quality**: Provide clear, actionable descriptions

### UI Integration
1. **Progressive Disclosure**: Show high-priority suggestions first
2. **Context Preservation**: Maintain suggestion context when navigating
3. **Loading States**: Provide feedback during suggestion generation
4. **Error Handling**: Gracefully handle suggestion failures

### Performance
1. **Context Optimization**: Minimize unnecessary context updates
2. **Rule Efficiency**: Design rules for fast evaluation
3. **Suggestion Limiting**: Use appropriate maximum suggestion counts
4. **Caching Strategy**: Implement intelligent caching for frequently accessed patterns

## Troubleshooting

### Common Issues

**No Suggestions Generated**
- Verify asset context is properly formatted
- Check that technologies/functionalities match rule conditions
- Ensure rules are loaded correctly

**Performance Issues**
- Review context update frequency
- Check for infinite re-render loops
- Optimize rule condition complexity

**Incorrect Suggestions**
- Review rule condition matching logic
- Verify asset context data accuracy
- Check for rule conflicts or overlaps

### Debugging

```typescript
// Enable debug logging
const { suggestions, loading } = useSuggestions(context, {
  debug: true  // Logs rule evaluation details
});

// Inspect rule execution
console.log('Active rules:', suggestionEngine.getRules());
console.log('Context evaluation:', context);
```

## Future Enhancements

### Planned Features
1. **Machine Learning Integration**: Optional ML-based confidence adjustment
2. **External Integration**: CVE database and threat intelligence feeds
3. **Custom Dashboards**: Advanced analytics and reporting
4. **Export Capabilities**: Suggestion reports and action plans
5. **Collaborative Features**: Team-based suggestion sharing

### API Extensions
1. **Bulk Analysis**: Process multiple assets simultaneously
2. **Historical Tracking**: Suggestion evolution over time
3. **Integration Hooks**: Webhook support for external systems
4. **Advanced Filtering**: Complex query language for suggestions

---

## Demo

A comprehensive demo is available at `/suggestion-demo` showcasing:
- Interactive context configuration
- Real-time suggestion generation
- Different UI component variants
- Analytics and insights
- Rule evaluation visualization

## Contributing

When adding new rules or features:

1. **Rule Testing**: Ensure rules generate appropriate suggestions
2. **Performance Testing**: Verify no significant impact on suggestion speed
3. **UI Testing**: Test integration with existing components
4. **Documentation**: Update this README with new features

## License

This suggestion engine is part of Nimbus Vault and follows the project's licensing terms.
