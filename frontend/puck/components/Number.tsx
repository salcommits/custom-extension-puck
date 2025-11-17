import type { ComponentConfig } from '@measured/puck';
import type { Base } from '@airtable/blocks/interface/models';
import { useBase, useRecords } from '@airtable/blocks/interface/ui';

export type NumberProps = {
  title: string;
  tableName: string;
  displayType: 'count' | 'summary';
  fieldName: string;
  summaryType: 'sum' | 'average' | 'median' | 'min' | 'max' | 'range';
};

export function createNumber(base: Base): ComponentConfig<NumberProps> {
  // Get all table names for dropdown
  const tableOptions = base.tables.map((table) => ({
    label: table.name,
    value: table.name,
  }));

  return {
    label: 'Number',
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
      displayType: {
        type: 'radio',
        label: 'Type',
        options: [
          { label: 'Count', value: 'count' },
          { label: 'Summary', value: 'summary' },
        ],
      },
      fieldName: ((props: { tableName: string; displayType: string }) => {
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
          label: props.displayType === 'summary' ? 'Field' : 'Field (Summary only)',
          options: fieldOptions.length > 0 ? fieldOptions : [{ label: 'Select a table first', value: '' }],
        };
      }) as any,
      summaryType: ((props: { displayType: string }) => {
        return {
          type: 'select' as const,
          label: props.displayType === 'summary' ? 'Summary Type' : 'Summary Type (Summary only)',
          options: [
            { label: 'Sum', value: 'sum' },
            { label: 'Average', value: 'average' },
            { label: 'Median', value: 'median' },
            { label: 'Min', value: 'min' },
            { label: 'Max', value: 'max' },
            { label: 'Range', value: 'range' },
          ],
        };
      }) as any,
    },
    defaultProps: {
      title: 'Count',
      tableName: base.tables[0]?.name || '',
      displayType: 'count',
      fieldName: '',
      summaryType: 'sum',
    },
    render: (props) => {
      const { title, tableName, displayType, fieldName, summaryType } = props;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const currentBase = useBase();
      
      // Find the selected table
      const table = currentBase.tables.find((t) => t.name === tableName);
      
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const records = useRecords(table || currentBase.tables[0]);
      
      let value = '—';
      let subtitle = '';

      if (displayType === 'count') {
        // Simple count of records
        value = records?.length.toString() || '0';
        subtitle = `${tableName}`;
      } else if (displayType === 'summary' && fieldName && table) {
        // Summary calculations
        const field = table.fields.find((f) => f.name === fieldName);
        
        if (!field) {
          value = '(field not found)';
        } else {
          try {
            // Get numeric values from records
            const values: number[] = [];
            records?.forEach((record) => {
              try {
                const cellValue = record.getCellValueAsString(field);
                const numValue = parseFloat(cellValue);
                if (!isNaN(numValue)) {
                  values.push(numValue);
                }
              } catch {
                // Skip invalid values
              }
            });

            if (values.length === 0) {
              value = '—';
            } else {
              switch (summaryType) {
                case 'sum':
                  value = values.reduce((a, b) => a + b, 0).toFixed(2);
                  break;
                case 'average':
                  value = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
                  break;
                case 'median':
                  values.sort((a, b) => a - b);
                  const mid = Math.floor(values.length / 2);
                  value = (values.length % 2 === 0
                    ? (values[mid - 1] + values[mid]) / 2
                    : values[mid]
                  ).toFixed(2);
                  break;
                case 'min':
                  value = Math.min(...values).toFixed(2);
                  break;
                case 'max':
                  value = Math.max(...values).toFixed(2);
                  break;
                case 'range':
                  value = (Math.max(...values) - Math.min(...values)).toFixed(2);
                  break;
                default:
                  value = '—';
              }
            }

            subtitle = `${tableName} → ${fieldName}`;
          } catch {
            value = '(error)';
          }
        }
      } else if (displayType === 'summary' && !fieldName) {
        value = '(select a field)';
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
          {subtitle && (
            <div
              style={{
                fontSize: '11px',
                opacity: 0.4,
                marginTop: '12px',
                fontStyle: 'italic',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      );
    },
  };
}
