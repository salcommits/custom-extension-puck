import { useCallback, useRef } from 'react';
import type { Table } from '@airtable/blocks/interface/models';

export function useDebouncedUpdate(table: Table | undefined, delay: number = 1000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    async (recordId: string, fields: Record<string, any>) => {
      if (!table) return;

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(async () => {
        try {
          // Check permissions before updating
          if (!table.hasPermissionToUpdateRecords([{ id: recordId, fields }])) {
            console.error('No permission to update record');
            return;
          }

          await table.updateRecordAsync(recordId, fields);
          console.log('✅ Document saved to Airtable');
        } catch (error) {
          console.error('❌ Failed to save document:', error);
        }
      }, delay);
    },
    [table, delay]
  );
}

// Simple debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

