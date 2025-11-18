import type { ComponentConfig } from '@measured/puck';

export type HeroProps = {
  headline: string;
  subhead: string;
  backgroundUrl?: string;
  backgroundColor: 'color1' | 'color2' | 'color3' | 'color4' | 'color5' | 'color6' | 'color7' | 'color8' | 'transparent';
  textColor: 'color1' | 'color2' | 'color3' | 'color4' | 'color5' | 'color6' | 'color7' | 'color8' | 'white' | 'black';
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
        { label: 'Transparent', value: 'transparent' },
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
    textColor: {
      type: 'select',
      label: 'Text Color',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Black', value: 'black' },
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
    backgroundColor: 'color1',
    textColor: 'white',
    alignment: 'center',
  },
  render: ({ headline, subhead, backgroundUrl, backgroundColor, textColor, alignment }) => {
    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    // Map color references to CSS custom properties or fixed colors
    const getColor = (colorRef: string): string => {
      const colorVarMap: Record<string, string> = {
        color1: 'var(--color-1, #1d4ed8)',
        color2: 'var(--color-2, #059669)',
        color3: 'var(--color-3, #dc2626)',
        color4: 'var(--color-4, #d97706)',
        color5: 'var(--color-5, #7c3aed)',
        color6: 'var(--color-6, #0891b2)',
        color7: 'var(--color-7, #db2777)',
        color8: 'var(--color-8, #65a30d)',
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
      };
      return colorVarMap[colorRef] || '#1d4ed8';
    };

    const bgColor = getColor(backgroundColor);
    const txtColor = getColor(textColor);

    return (
      <section
        className={`relative rounded-lg p-12 min-h-[400px] flex items-center ${alignmentClasses[alignment]}`}
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: backgroundUrl ? undefined : bgColor,
        }}
      >
        <div className="relative z-10 w-full">
          <h1 
            className="text-5xl font-bold mb-4 drop-shadow-lg" 
            style={{ color: txtColor }}
          >
            {headline}
          </h1>
          {subhead && (
            <p 
              className="text-xl opacity-90 drop-shadow-md" 
              style={{ color: txtColor }}
            >
              {subhead}
            </p>
          )}
        </div>
        {backgroundUrl && <div className="absolute inset-0 bg-black opacity-30 rounded-lg" />}
      </section>
    );
  },
};

export default Hero;

