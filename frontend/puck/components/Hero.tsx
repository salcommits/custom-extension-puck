import type { ComponentConfig } from '@measured/puck';

export type HeroProps = {
  headline: string;
  subhead: string;
  backgroundUrl?: string;
  backgroundColor: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'cyan' | 'teal' | 'orange' | 'pink';
  alignment: 'left' | 'center' | 'right';
};

const Hero: ComponentConfig<HeroProps> = {
  fields: {
    headline: {
      type: 'text',
      label: 'Headline',
    },
    subhead: {
      type: 'textarea',
      label: 'Subheadline',
    },
    backgroundUrl: {
      type: 'text',
      label: 'Background Image URL (optional)',
    },
    backgroundColor: {
      type: 'select',
      label: 'Background Color',
      options: [
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Red', value: 'red' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Purple', value: 'purple' },
        { label: 'Gray', value: 'gray' },
        { label: 'Cyan', value: 'cyan' },
        { label: 'Teal', value: 'teal' },
        { label: 'Orange', value: 'orange' },
        { label: 'Pink', value: 'pink' },
      ],
    },
    alignment: {
      type: 'select',
      label: 'Text Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  },
  defaultProps: {
    headline: 'Welcome to Your Page',
    subhead: 'Build amazing interfaces with Puck and Airtable',
    backgroundColor: 'blue',
    alignment: 'center',
  },
  render: ({ headline, subhead, backgroundUrl, backgroundColor, alignment }) => {
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    // Map color names to Airtable's color values
    const colorMap = {
      blue: 'rgb(22, 110, 225)',
      green: 'rgb(4, 138, 14)',
      red: 'rgb(220, 4, 59)',
      yellow: 'rgb(255, 186, 5)',
      purple: 'rgb(124, 55, 239)',
      gray: 'rgb(97, 102, 112)',
      cyan: 'rgb(57, 202, 255)',
      teal: 'rgb(1, 221, 213)',
      orange: 'rgb(213, 68, 1)',
      pink: 'rgb(221, 4, 168)',
    };

    return (
      <section
        className={`relative rounded-lg p-12 min-h-[400px] flex items-center ${alignmentClasses[alignment]}`}
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: backgroundUrl ? undefined : colorMap[backgroundColor],
        }}
      >
        <div className="relative z-10 w-full">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">{headline}</h1>
          {subhead && <p className="text-xl text-white opacity-90 drop-shadow-md">{subhead}</p>}
        </div>
        {backgroundUrl && <div className="absolute inset-0 bg-black opacity-30 rounded-lg" />}
      </section>
    );
  },
};

export default Hero;

