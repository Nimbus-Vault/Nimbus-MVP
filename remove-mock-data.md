# Remove Mock Data - Action Plan

## Critical Pages with Mock Data (16 total)

### 1. **Programs.tsx** ⚠️ PARTIALLY UPDATED
- Still has references to `mockPrograms` and `mockPlatforms` 
- Need to complete the remaining function updates
- Need to fix display fields that don't match the Program interface

### 2. **Playbooks.tsx** 
- `mockPlaybooks` array with 6 entries
- Mock CRUD operations 
- Mock methodology associations

### 3. **Techniques.tsx**
- `mockTechniques` array with 8 entries
- Mock CRUD operations
- Mock difficulty/category filters

### 4. **Payloads.tsx** 
- `mockPayloads` array with 8 entries
- Mock CRUD operations
- Mock success rate data

### 5. **Assets.tsx**
- Mock assets array
- Mock CRUD operations

### 6. **Vulnerabilities.tsx**
- Mock vulnerabilities array
- Mock CRUD operations

### 7. **Methodologies.tsx**
- Mock methodologies array
- Mock CRUD operations

### 8. **Other Pages** (Lower priority)
- AtomicVulnerabilities.tsx
- LogicFlaws.tsx
- Platforms.tsx
- Technologies.tsx
- Functionalities.tsx
- Behaviors.tsx

## Strategy

### **Phase 1: Complete Critical Pages** (Programs, Playbooks, Techniques, Payloads)
1. Update each to use data adapters
2. Add proper loading states
3. Add error handling with toast notifications
4. Fix any interface mismatches

### **Phase 2: Update Remaining Pages**
1. Follow same pattern as Phase 1
2. Ensure consistency across all pages

### **Phase 3: Test & Verify**
1. Test with both local storage and Supabase
2. Verify CRUD operations work correctly
3. Check error handling

## Template Pattern for Updates

```typescript
// 1. Add imports
import { useState, useEffect } from 'react';
import { [entityName]Adapter } from '@/lib/data-adapter';
import { toast } from 'sonner';
import { [EntityType] } from '@/types';

// 2. Add state management
const [entities, setEntities] = useState<EntityType[]>([]);
const [loading, setLoading] = useState(true);

// 3. Add data loading
useEffect(() => {
  loadEntities();
}, []);

const loadEntities = async () => {
  try {
    setLoading(true);
    const data = await [entityName]Adapter.getAll();
    setEntities(data);
  } catch (error) {
    console.error('Failed to load entities:', error);
    toast.error('Failed to load entities');
  } finally {
    setLoading(false);
  }
};

// 4. Update CRUD operations
const handleCreate = async () => {
  try {
    await [entityName]Adapter.create(newEntity);
    toast.success('Created successfully');
    loadEntities();
    // Reset form...
  } catch (error) {
    console.error('Failed to create:', error);
    toast.error('Failed to create');
  }
};

// Similar pattern for update, delete operations
```

This systematic approach will eliminate all mock data and create a consistent, real data-driven application.
