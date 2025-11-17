import { useCallback, useEffect, useState, useMemo } from 'react';
import { useBase, useRecords, useCustomProperties } from '@airtable/blocks/interface/ui';
import { Puck, Data } from '@measured/puck';
import type { Table, Field } from '@airtable/blocks/interface/models';
import { getCustomProperties } from '../airtable/customProperties';
import { createConfig } from '../puck/config';

export default function ExtensionRoot() {
  const base = useBase();
  const { customPropertyValueByKey, errorState } = useCustomProperties(
    useCallback(() => getCustomProperties(base), [base])
  );

  // Create dynamic Puck config based on base tables/fields
  const config = useMemo(() => createConfig(base), [base]);

  // Get configured table and fields
  const table = customPropertyValueByKey.layoutsTable as Table | undefined;
  const nameField = customPropertyValueByKey.nameField as Field | undefined;
  const docField = customPropertyValueByKey.docField as Field | undefined;
  const assetsField = customPropertyValueByKey.assetsField as Field | undefined;

  // Load records from the Layouts table
  const records = useRecords(table || base.tables[0]);
  const record = records?.[0]; // Use first record for simplicity

  // State for Puck data
  const [puckData, setPuckData] = useState<Data>(() => {
    if (!record || !docField) {
      return { content: [], root: { props: {} } };
    }
    try {
      const cellValue = record.getCellValueAsString(docField);
      return cellValue ? JSON.parse(cellValue) : { content: [], root: { props: {} } };
    } catch {
      return { content: [], root: { props: {} } };
    }
  });

  // Sync record changes to Puck data
  useEffect(() => {
    if (!record || !docField) return;
    try {
      const cellValue = record.getCellValueAsString(docField);
      const parsed = cellValue ? JSON.parse(cellValue) : { content: [], root: { props: {} } };
      setPuckData(parsed);
    } catch {
      setPuckData({ content: [], root: { props: {} } });
    }
  }, [record, docField]);

  // Handle publish (save when clicking Publish button)
  const handlePuckPublish = useCallback(
    async (data: Data) => {
      setPuckData(data);
      if (!record || !docField || !table) {
        alert('❌ Missing required data. Please check your configuration.');
        return;
      }

      // Check permissions
      const canUpdate = table.hasPermissionToUpdateRecords();
      if (!canUpdate) {
        alert(
          '❌ Permission Error\n\n' +
          'This interface does not have permission to edit records.\n\n' +
          'To fix:\n' +
          '1. Click "..." menu (top-right)\n' +
          '2. Select "Edit page"\n' +
          '3. Under "Data access", enable "Edit records"\n' +
          '4. Save and try again'
        );
        console.error('No permission to update records in this interface');
        return;
      }

      try {
        // Save to Airtable
        await table.updateRecordAsync(record.id, {
          [docField.name]: JSON.stringify(data),
        });
        
        console.log('✅ Published successfully!');
        alert('✅ Published successfully!');
      } catch (error) {
        console.error('❌ Failed to publish:', error);
        alert(
          '❌ Failed to publish\n\n' +
          'Error: ' + (error instanceof Error ? error.message : String(error)) +
          '\n\nCheck the console for more details.'
        );
      }
    },
    [record, docField, table]
  );

  // Show configuration instructions if custom properties aren't set
  if (errorState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-gray50 dark:bg-gray-gray800 p-4">
        <div className="bg-white dark:bg-gray-gray700 rounded-lg p-6 max-w-lg shadow-xl">
          <h1 className="text-2xl font-bold text-red-red mb-2">Configuration Error</h1>
          <p className="text-gray-gray600 dark:text-gray-gray300">
            {String(errorState.error?.message || 'Unknown error')}
          </p>
        </div>
      </div>
    );
  }

  if (!table || !nameField || !docField || !assetsField) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-gray50 dark:bg-gray-gray800 p-4">
        <div className="bg-white dark:bg-gray-gray700 rounded-lg p-6 max-w-lg shadow-xl">
          <h1 className="text-2xl font-bold text-blue-blue mb-4">⚙️ Setup Required</h1>
          <p className="text-gray-gray600 dark:text-gray-gray300 mb-4">
            Please configure this extension using the <strong>Properties Panel</strong> on the
            right:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-gray700 dark:text-gray-gray200">
            <li>
              Select the <strong>Layouts Table</strong>
            </li>
            <li>
              Choose the <strong>Name Field</strong> (single line text)
            </li>
            <li>
              Choose the <strong>Doc Field</strong> (long text for JSON)
            </li>
            <li>
              Choose the <strong>Assets Field</strong> (attachments)
            </li>
          </ol>
          <div className="mt-6 p-4 bg-blue-blueLight3 dark:bg-blue-blueDark1 rounded-md">
            <p className="text-sm text-blue-blueDark1 dark:text-blue-blueLight1">
              💡 <strong>Tip:</strong> Create a table called &quot;Layouts&quot; with these three
              fields if you don&apos;t have one yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-gray50 dark:bg-gray-gray800 p-4">
        <div className="bg-white dark:bg-gray-gray700 rounded-lg p-6 max-w-lg shadow-xl">
          <h1 className="text-2xl font-bold text-yellow-yellow mb-2">No Records Found</h1>
          <p className="text-gray-gray600 dark:text-gray-gray300">
            Please add at least one record to the &quot;{table.name}&quot; table to start editing.
          </p>
        </div>
      </div>
    );
  }

  // Get background color from puck data
  const rootProps = puckData?.root?.props || {};
  const backgroundColor = rootProps.backgroundColor || 'white';
  const colors = rootProps.colors || {};
  
  const colorMap: Record<string, string> = {
    white: '#ffffff',
    color1: colors.color1 || '#1d4ed8',
    color2: colors.color2 || '#059669',
    color3: colors.color3 || '#dc2626',
    color4: colors.color4 || '#d97706',
    color5: colors.color5 || '#7c3aed',
    color6: colors.color6 || '#0891b2',
    color7: colors.color7 || '#db2777',
    color8: colors.color8 || '#65a30d',
  };

  const bgColor = colorMap[backgroundColor] || '#f9fafb';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <Puck config={config} data={puckData} onPublish={handlePuckPublish} />
    </div>
  );
}
