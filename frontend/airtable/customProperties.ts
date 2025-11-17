import { Base, FieldType } from '@airtable/blocks/interface/models';

export function getCustomProperties(base: Base) {
  // Try to find "Layouts" table first, then fallback to other options
  const defaultTable = base.tables.find(
    (t) => t.name === 'Layouts' ||
           t.name.toLowerCase().includes('layouts') ||
           t.name.toLowerCase().includes('layout')
  );

  const layoutsTable = defaultTable || base.tables[0];

  return [
    {
      key: 'layoutsTable',
      label: 'Layouts Table',
      type: 'table' as const,
      defaultValue: layoutsTable,
    },
    {
      key: 'nameField',
      label: 'Name Field',
      type: 'field' as const,
      table: layoutsTable,
      shouldFieldBeAllowed: (field: { id: string; config: any }) =>
        field.config.type === FieldType.SINGLE_LINE_TEXT,
      defaultValue: layoutsTable.fields.find((f) =>
        f.name.toLowerCase().includes('name')
      ),
    },
    {
      key: 'docField',
      label: 'Document Field (Long Text)',
      type: 'field' as const,
      table: layoutsTable,
      shouldFieldBeAllowed: (field: { id: string; config: any }) =>
        field.config.type === FieldType.MULTILINE_TEXT ||
        field.config.type === FieldType.RICH_TEXT,
      defaultValue: layoutsTable.fields.find(
        (f) => f.name.toLowerCase().includes('doc') || f.name.toLowerCase().includes('content')
      ),
    },
    {
      key: 'assetsField',
      label: 'Assets Field (Attachments)',
      type: 'field' as const,
      table: layoutsTable,
      shouldFieldBeAllowed: (field: { id: string; config: any }) =>
        field.config.type === FieldType.MULTIPLE_ATTACHMENTS,
      defaultValue: layoutsTable.fields.find(
        (f) => f.name.toLowerCase().includes('asset') || f.name.toLowerCase().includes('attachment')
      ),
    },
  ];
}

