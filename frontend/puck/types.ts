export type FilterOp = 'eq' | 'neq' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte';

export type DataFilter = {
  field: string;
  op: FilterOp;
  value: string | number;
};

export type PickStrategy = {
  type: 'first' | 'last' | 'maxBy' | 'minBy';
  field?: string;
};

export type DataRef = {
  tableName: string;
  viewName?: string; // default "Grid view"
  filters?: DataFilter[];
  sort?: { field: string; direction: 'asc' | 'desc' }[];
  pick?: PickStrategy; // default first
  fieldName: string; // the field whose value we will display
};

