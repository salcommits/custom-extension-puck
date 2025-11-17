import type { ComponentConfig } from '@measured/puck';

export type TextProps = {
  content: string;
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight: 'normal' | 'medium' | 'semibold' | 'bold';
  align: 'left' | 'center' | 'right';
  color: 'black' | 'white' | 'color1' | 'color2' | 'color3' | 'color4' | 'color5' | 'color6' | 'color7' | 'color8';
};

const Text: ComponentConfig<TextProps> = {
  fields: {
    content: {
      type: 'textarea',
      label: 'Text Content',
    },
    size: {
      type: 'select',
      label: 'Text Size',
      options: [
        { label: 'Extra Small', value: 'xs' },
        { label: 'Small', value: 'sm' },
        { label: 'Base', value: 'base' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
        { label: '2XL', value: '2xl' },
        { label: '3XL', value: '3xl' },
        { label: '4XL', value: '4xl' },
        { label: '5XL', value: '5xl' },
        { label: '6XL', value: '6xl' },
      ],
    },
    weight: {
      type: 'select',
      label: 'Font Weight',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Medium', value: 'medium' },
        { label: 'Semibold', value: 'semibold' },
        { label: 'Bold', value: 'bold' },
      ],
    },
    align: {
      type: 'radio',
      label: 'Text Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    color: {
      type: 'select',
      label: 'Text Color',
      options: [
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Color 1', value: 'color1' },
        { label: 'Color 2', value: 'color2' },
        { label: 'Color 3', value: 'color3' },
        { label: 'Color 4', value: 'color4' },
        { label: 'Color 5', value: 'color5' },
        { label: 'Color 6', value: 'color6' },
        { label: 'Color 7', value: 'color7' },
        { label: 'Color 8', value: 'color8' },
      ],
    },
  },
  defaultProps: {
    content: 'Add your text here...',
    size: 'base',
    weight: 'normal',
    align: 'left',
    color: 'black',
  },
  render: ({ content, size, weight, align, color, puck }) => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    };

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    // Get colors from root props
    const rootProps = (puck as any)?.appState?.data?.root?.props || {};
    const paletteColors = rootProps.colors || {};

    // Map color references to hex values
    const colorMap: Record<string, string> = {
      white: '#ffffff',
      black: '#000000',
      color1: paletteColors.color1 || '#1d4ed8',
      color2: paletteColors.color2 || '#059669',
      color3: paletteColors.color3 || '#dc2626',
      color4: paletteColors.color4 || '#d97706',
      color5: paletteColors.color5 || '#7c3aed',
      color6: paletteColors.color6 || '#0891b2',
      color7: paletteColors.color7 || '#db2777',
      color8: paletteColors.color8 || '#65a30d',
    };

    const textColor = colorMap[color] || '#000000';

    return (
      <div className="p-4 bg-white dark:bg-gray-gray700 rounded-lg">
        <p
          className={`${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} whitespace-pre-wrap`}
          style={{ color: textColor }}
        >
          {content}
        </p>
      </div>
    );
  },
};

export default Text;

