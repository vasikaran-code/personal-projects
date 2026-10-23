import type { ReactNode } from 'react';

type Tone = 'white' | 'slate' | 'indigo' | 'amber' | 'dark';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  wide?: boolean;
  compact?: boolean;
}

const backgrounds: Record<Tone, string> = {
  white: 'bg-white',
  slate: 'bg-slate-50',
  indigo: 'bg-primary-50/60',
  amber: 'bg-amber-50/70',
  dark: 'bg-gray-900 text-white',
};

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
  tone = 'white',
  wide = false,
  compact = false,
}: SectionProps) {
  const dark = tone === 'dark';

  return (
    <section
      id={id}
      className={`${compact ? 'py-12 md:py-16' : 'py-16 md:py-24'} ${backgrounds[tone]} ${className}`}
    >
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${wide ? 'max-w-screen-2xl' : 'max-w-6xl'}`}>
        <div className={`text-center ${compact ? 'mb-8' : 'mb-12'}`}>
          <h2
            className={`font-heading text-3xl md:text-4xl font-bold mb-4 ${
              dark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h2>
          <div className="flex justify-center gap-1 mb-4">
            <span className="h-1 w-10 bg-primary-600 rounded"></span>
            <span className="h-1 w-3 bg-amber-400 rounded"></span>
          </div>
          {subtitle && (
            <p className={`text-lg max-w-2xl mx-auto ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
