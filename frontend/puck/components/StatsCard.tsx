import type { ComponentConfig } from '@measured/puck';
import type { Base } from '@airtable/blocks/interface/models';
import { useBase, useRecords } from '@airtable/blocks/interface/ui';

export type StatsCardProps = {
  title: string;
  tableName: string;
  recordId: string;
  fieldName: string;
};

export function createStatsCard(base: Base): ComponentConfig<StatsCardProps> {
  // Get all table names for dropdown
  const tableOptions = base.tables.map((table) => ({
    label: table.name,
    value: table.name,
  }));

  return {
    label: 'Stats Card',
    fields: {
      title: {
        type: 'text',
        label: 'Title',
      },
      tableName: {
        type: 'select',
        label: 'Table',
        options: tableOptions,
      },
      recordId: {
        type: 'text',
        label: 'Record ID',
      },
    fieldName: ((props: { tableName: string }) => {
      // Get fields for the selected table
      const selectedTable = base.tables.find((t) => t.name === props.tableName);
      const fieldOptions = selectedTable
        ? selectedTable.fields.map((field) => ({
            label: field.name,
            value: field.name,
          }))
        : [];

      return {
        type: 'select' as const,
        label: 'Field to Display',
        options: fieldOptions.length > 0 ? fieldOptions : [{ label: 'Select a table first', value: '' }],
      };
    }) as any,
  },
  defaultProps: {
    title: 'Stat Card',
    tableName: base.tables[0]?.name || '',
    recordId: '',
    fieldName: '',
  },
  render: (props) => {
    const { title, tableName, recordId, fieldName } = props;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const currentBase = useBase();
    
    // Find the selected table
    const table = currentBase.tables.find((t) => t.name === tableName);
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const records = useRecords(table || currentBase.tables[0]);
    
    // Find the specific record
    const record = records?.find((r) => r.id === recordId);
    
    let value = '—';
    if (record && fieldName && table) {
      const field = table.fields.find((f) => f.name === fieldName);
      if (field) {
        try {
          value = record.getCellValueAsString(field) || '—';
        } catch {
          value = '(error)';
        }
      } else {
        value = '(field not found)';
      }
    } else if (!recordId) {
      value = '(select a record)';
    } else if (!fieldName) {
      value = '(select a field)';
    } else if (!record) {
      value = '(record not found)';
    }

    return (
      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333',
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: '500',
            opacity: 0.6,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title || 'Stat'}
        </div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#111',
            lineHeight: '1',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: '11px',
            opacity: 0.4,
            marginTop: '12px',
            fontStyle: 'italic',
          }}
        >
          {tableName} → {fieldName}
        </div>
      </div>
    );
  },
  };
}
