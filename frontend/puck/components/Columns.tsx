import type { ComponentConfig } from '@measured/puck';
import { DropZone } from '@measured/puck';

export type ColumnsProps = {
  columns: 1 | 2 | 3 | 4 | 5;
  distribution: 'equal' | 'auto' | 'wide-left' | 'wide-right';
  gap: 'none' | 'small' | 'medium' | 'large';
};

const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    columns: {
      type: 'select',
      label: 'Number of Columns',
      options: [
        { label: '1 Column', value: 1 },
        { label: '2 Columns', value: 2 },
        { label: '3 Columns', value: 3 },
        { label: '4 Columns', value: 4 },
        { label: '5 Columns', value: 5 },
      ],
    },
    distribution: {
      type: 'select',
      label: 'Column Distribution',
      options: [
        { label: 'Equal Width', value: 'equal' },
        { label: 'Auto (fit content)', value: 'auto' },
        { label: 'Wide Left (2:1)', value: 'wide-left' },
        { label: 'Wide Right (1:2)', value: 'wide-right' },
      ],
    },
    gap: {
      type: 'select',
      label: 'Gap Between Columns',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
  },
  defaultProps: {
    columns: 2,
    distribution: 'equal',
    gap: 'medium',
  },
  render: ({ columns, distribution, gap }) => {
    // Gap size classes
    const gapClasses = {
      none: 'gap-0',
      small: 'gap-2',
      medium: 'gap-4',
      large: 'gap-8',
    };

    // Column distribution classes (explicit for Tailwind)
    const getGridCols = () => {
      // Special distributions
      if (distribution === 'auto') {
        return 'grid-flow-col auto-cols-fr';
      }
      if (distribution === 'wide-left' && columns === 2) {
        return 'grid-cols-[2fr_1fr]';
      }
      if (distribution === 'wide-right' && columns === 2) {
        return 'grid-cols-[1fr_2fr]';
      }
      
      // Equal distribution with explicit classes
      const colClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
      };
      return colClasses[columns];
    };

    return (
      <div className={`grid ${getGridCols()} ${gapClasses[gap]} w-full`}>
        {Array.from({ length: columns }).map((_, idx) => (
          <div
            key={idx}
            className="min-h-[100px] p-4 rounded-lg border-2 border-dashed border-gray-gray300 dark:border-gray-gray600 bg-white dark:bg-gray-gray700"
          >
            <DropZone zone={`column-${idx}`} />
          </div>
        ))}
      </div>
    );
  },
};

export default Columns;

