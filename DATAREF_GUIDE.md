# 🔗 DataRef Query System Guide

## Overview

The **DataRef** system replaces fragile hard-coded record IDs with a powerful query-based approach. Instead of pasting record IDs, editors can now build queries using Table, View, Filters, Sort, and Pick strategies.

---

## Why DataRef?

### ❌ Old Approach (Fragile)
- **Hard-coded Record IDs**: `rec123ABC456` breaks if the record is deleted
- **Manual Updates**: Every time data changes, you need to update IDs
- **No Flexibility**: Can't dynamically pick "latest", "highest value", etc.

### ✅ New Approach (Robust)
- **Query-Based**: Define what data you want, not which specific record
- **Dynamic**: Automatically picks the right record based on your rules
- **Resilient**: Works even when records are added/deleted

---

## DataRef Type Structure

```typescript
type DataRef = {
  tableName: string;           // Which table to query
  viewName?: string;            // Optional view name (not yet implemented)
  filters?: DataFilter[];       // Filter criteria
  sort?: SortRule[];           // Sort order
  pick?: PickStrategy;         // Which record to select
  fieldName: string;           // Which field value to display
};
```

### Filter Operators

```typescript
type FilterOp = 
  | 'eq'       // Equals
  | 'neq'      // Not equals
  | 'contains' // Contains text (case-insensitive)
  | 'gt'       // Greater than (numbers)
  | 'gte'      // Greater than or equal
  | 'lt'       // Less than
  | 'lte'      // Less than or equal
```

### Pick Strategies

- **`first`**: Select the first record (after filtering & sorting)
- **`last`**: Select the last record
- **`maxBy`**: Select record with highest value in a specific field
- **`minBy`**: Select record with lowest value in a specific field

---

## How to Use in Puck

### Example: Show Latest Signup Count

1. **Add StatsCard component** to your page
2. **Configure the query**:
   - **Title**: `Latest Signups`
   - **Table Name**: `Results`
   - **Field to Display**: `Value`
   - **Pick Strategy**: `Last Record`
   - **Sort Field**: `Created`
   - **Sort Direction**: `Ascending`

This will always show the most recent signup count, even as new records are added!

### Example: Show Highest Conversion Rate

1. **Add StatsCard component**
2. **Configure**:
   - **Title**: `Best Conversion Rate`
   - **Table Name**: `Results`
   - **Field to Display**: `% Conversion Rate`
   - **Pick Strategy**: `Max By Field`
   - **Pick Field**: `% Conversion Rate`

This automatically displays the highest conversion rate from your Results table.

### Example: Filter by Metric Type

1. **Add StatsCard component**
2. **Configure**:
   - **Title**: `Revenue This Month`
   - **Table Name**: `Results`
   - **Filter Field**: `Metric`
   - **Filter Operator**: `Equals`
   - **Filter Value**: `Revenue`
   - **Field to Display**: `Value`

This shows only records where the Metric field equals "Revenue".

---

## Technical Details

### Runtime Resolution

The `useResolveDataRef` hook runs on every render:

1. **Find Table**: Locates the table by name
2. **Load Records**: Uses `useRecords(table)` to get live data
3. **Apply Filters**: Filters records in-memory based on criteria
4. **Sort**: Sorts records if sort rules are defined
5. **Pick**: Selects one record based on strategy
6. **Extract Value**: Gets the cell value from the specified field

### Performance Considerations

- **In-Memory Filtering**: Suitable for small-to-medium datasets (<1000 records)
- **Live Updates**: Automatically refreshes when Airtable data changes
- **No Network Calls**: All resolution happens client-side using cached data

For large datasets (>1000 records), create filtered views in Airtable and reference those.

---

## API Reference

### `useResolveDataRef(ref: DataRef | undefined)`

**Returns:**
```typescript
{
  value: string | undefined;     // The resolved cell value
  records: Record[];            // All matching records (after filtering/sorting)
  loading: boolean;             // Always false (synchronous resolution)
}
```

**Example Usage in Custom Component:**
```tsx
import { useResolveDataRef } from '../dataResolver';
import type { DataRef } from '../types';

function MyComponent({ dataRef }: { dataRef: DataRef }) {
  const { value, records } = useResolveDataRef(dataRef);
  
  return <div>Value: {value || '—'}</div>;
}
```

---

## Common Patterns

### Show Latest Record
```typescript
{
  tableName: 'Results',
  fieldName: 'Value',
  sort: [{ field: 'Created', direction: 'desc' }],
  pick: { type: 'first' }
}
```

### Show Record with Max Value
```typescript
{
  tableName: 'Results',
  fieldName: 'Score',
  pick: { type: 'maxBy', field: 'Score' }
}
```

### Filter and Display
```typescript
{
  tableName: 'Results',
  fieldName: 'Value',
  filters: [
    { field: 'Status', op: 'eq', value: 'Active' },
    { field: 'Score', op: 'gte', value: 100 }
  ]
}
```

---

## Troubleshooting

### "table not found"
- Check that the table name matches exactly (case-sensitive)
- Ensure the table exists in your base

### "field not found"
- Verify the field name is spelled correctly
- Make sure the field is visible in the interface

### Returns "—"
- No records match your filter criteria
- Try removing filters one by one to diagnose

### Value shows "(error)"
- The field might not be readable
- Check field permissions in your Airtable base

---

## Future Enhancements

Planned improvements for the DataRef system:

- [ ] **View Support**: Filter by specific Airtable views
- [ ] **Multiple Values**: Return arrays of values (for charts/lists)
- [ ] **Field Type Awareness**: Better handling of dates, numbers, attachments
- [ ] **Advanced Operators**: `startsWith`, `endsWith`, `between`, `in`
- [ ] **Visual Query Builder**: Drag-and-drop interface for building queries
- [ ] **Query Presets**: Save and reuse common query patterns

---

## Migration Guide

### From Record ID to DataRef

**Old StatsCard (Record ID):**
```tsx
<StatsCard
  title="Monthly Signups"
  resultRecordId="rec123ABC456"
  valueField="Value"
/>
```

**New StatsCard (DataRef):**
```tsx
<StatsCard
  title="Monthly Signups"
  tableName="Results"
  fieldName="Value"
  pickStrategy="first"
/>
```

The new approach is more resilient and doesn't break when records are deleted or reorganized.

---

## Additional Resources

- [Airtable Blocks SDK](https://airtable.com/developers/blocks)
- [Puck Editor Documentation](https://puckeditor.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Questions?** Open an issue or check the source code in:
- `/frontend/puck/types.ts` - Type definitions
- `/frontend/puck/dataResolver.ts` - Resolution logic
- `/frontend/puck/components/StatsCard.tsx` - Example usage

