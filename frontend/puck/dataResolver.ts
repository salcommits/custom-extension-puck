import { useBase, useRecords } from '@airtable/blocks/interface/ui';
import type { DataRef } from './types';

export function useResolveDataRef(ref: DataRef | undefined) {
  const base = useBase();
  
  // Find table (may be undefined)
  const table = ref?.tableName 
    ? base.tables.find((t) => t.name === ref.tableName)
    : undefined;

  // Always call useRecords (required by React Hooks rules)
  const records = useRecords(table || base.tables[0]);
  
  // Early returns after all hooks have been called
  if (!ref || !ref.tableName) {
    return { value: undefined, records: [], loading: false } as const;
  }

  if (!table) {
    return { value: '(table not found)', records: [], loading: false } as const;
  }

  if (!records || records.length === 0) {
    return { value: '—', records: [], loading: false } as const;
  }

  // Apply filters in-memory
  const filtered = records.filter((r) => {
    if (!ref.filters?.length) return true;
    return ref.filters.every((f) => {
      try {
        const fieldObj = table.getFieldIfExists(f.field);
        if (!fieldObj) return true;
        
        const v = r.getCellValueAsString(fieldObj);
        const numVal = typeof f.value === 'number' ? Number(v) : null;

        switch (f.op) {
          case 'eq':
            return v === String(f.value);
          case 'neq':
            return v !== String(f.value);
          case 'contains':
            return v?.toLowerCase().includes(String(f.value).toLowerCase());
          case 'gt':
            return numVal !== null && numVal > Number(f.value);
          case 'gte':
            return numVal !== null && numVal >= Number(f.value);
          case 'lt':
            return numVal !== null && numVal < Number(f.value);
          case 'lte':
            return numVal !== null && numVal <= Number(f.value);
          default:
            return true;
        }
      } catch {
        return true;
      }
    });
  });

  // Sort
  const sorted =
    ref.sort && ref.sort.length
      ? [...filtered].sort((a, b) => {
          for (const s of ref.sort!) {
            try {
              const fieldObj = table.getFieldIfExists(s.field);
              if (!fieldObj) continue;
              
              const av = a.getCellValueAsString(fieldObj) ?? '';
              const bv = b.getCellValueAsString(fieldObj) ?? '';
              if (av === bv) continue;
              const cmp = av > bv ? 1 : -1;
              return s.direction === 'asc' ? cmp : -cmp;
            } catch {
              continue;
            }
          }
          return 0;
        })
      : filtered;

  // Pick strategy
  let chosen = sorted[0];
  
  if (ref.pick?.type === 'last') {
    chosen = sorted[sorted.length - 1];
  }
  
  if (ref.pick?.type === 'maxBy' && ref.pick.field) {
    chosen = sorted.reduce((best, r) => {
      try {
        const fieldObj = table.getFieldIfExists(ref.pick!.field!);
        if (!fieldObj) return best || r;
        
        const v = Number(r.getCellValueAsString(fieldObj)) || -Infinity;
        const bv = best ? Number(best.getCellValueAsString(fieldObj)) || -Infinity : -Infinity;
        return v > bv ? r : best;
      } catch {
        return best || r;
      }
    }, sorted[0]);
  }
  
  if (ref.pick?.type === 'minBy' && ref.pick.field) {
    chosen = sorted.reduce((best, r) => {
      try {
        const fieldObj = table.getFieldIfExists(ref.pick!.field!);
        if (!fieldObj) return best || r;
        
        const v = Number(r.getCellValueAsString(fieldObj)) || Infinity;
        const bv = best ? Number(best.getCellValueAsString(fieldObj)) || Infinity : Infinity;
        return v < bv ? r : best;
      } catch {
        return best || r;
      }
    }, sorted[0]);
  }

  // Get the value
  let value = '—';
  if (chosen && ref.fieldName) {
    try {
      const fieldObj = table.getFieldIfExists(ref.fieldName);
      if (fieldObj) {
        value = chosen.getCellValueAsString(fieldObj) || '—';
      } else {
        value = '(field not found)';
      }
    } catch {
      value = '(error)';
    }
  }

  return { value, records: sorted, loading: false } as const;
}

