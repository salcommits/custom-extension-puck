import type { ComponentConfig } from '@measured/puck';

export type TextProps = {
  content: string;
  size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight: 'normal' | 'medium' | 'semibold' | 'bold';
  align: 'left' | 'center' | 'right';
  color: 'default' | 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';
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
        { label: 'Default', value: 'default' },
        { label: 'Gray', value: 'gray' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Purple', value: 'purple' },
      ],
    },
  },
  defaultProps: {
    content: 'Add your text here...',
    size: 'base',
    weight: 'normal',
    align: 'left',
    color: 'default',
  },
  render: ({ content, size, weight, align, color }) => {
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

    const colorClasses = {
      default: 'text-gray-gray900 dark:text-gray-gray100',
      gray: 'text-gray-gray600 dark:text-gray-gray400',
      blue: 'text-blue-blue dark:text-blue-blueLight1',
      green: 'text-green-green dark:text-green-greenLight1',
      red: 'text-red-red dark:text-red-redLight1',
      yellow: 'text-yellow-yellowDark1 dark:text-yellow-yellowLight1',
      purple: 'text-purple-purple dark:text-purple-purpleLight1',
    };

    return (
      <div className="p-4 bg-white dark:bg-gray-gray700 rounded-lg">
        <p
          className={`${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} ${colorClasses[color]} whitespace-pre-wrap`}
        >
          {content}
        </p>
      </div>
    );
  },
};

export default Text;

