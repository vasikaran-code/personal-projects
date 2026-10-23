import { Monitor, Server, Wrench, Sparkles } from 'lucide-react';
import Section from '../ui/Section';
import { skills } from '../../data/portfolio';

const categoryStyles = [
  { icon: Monitor, tile: 'bg-primary-500/15 text-primary-300', dot: 'bg-primary-500', border: 'border-t-primary-500' },
  { icon: Server, tile: 'bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-500', border: 'border-t-emerald-500' },
  { icon: Wrench, tile: 'bg-amber-500/15 text-amber-300', dot: 'bg-amber-500', border: 'border-t-amber-500' },
  { icon: Sparkles, tile: 'bg-sky-500/15 text-sky-300', dot: 'bg-sky-500', border: 'border-t-sky-500' },
];

export default function Skills() {
  return (
    <Section
      id="skills"
      title="Skills & Technologies"
      subtitle="Technologies I work with"
      tone="dark"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {skills.map((category, index) => {
          const style = categoryStyles[index % categoryStyles.length];
          const Icon = style.icon;
          return (
          <div
            key={category.category}
            className={`bg-gray-800 rounded-xl p-6 border border-gray-700 border-t-4 ${style.border}`}
          >
            <h3 className="flex items-center gap-3 text-xl font-semibold text-white mb-6 pb-4 border-b border-gray-700">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${style.tile}`}>
                <Icon size={20} />
              </span>
              {category.category}
            </h3>
            <ul className="space-y-3">
              {category.skills.map((skill) => (
                <li key={skill.name} className="flex items-center gap-3 text-gray-300 font-medium">
                  <span className={`w-2 h-2 rounded-sm flex-shrink-0 ${style.dot}`}></span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
          );
        })}
      </div>
    </Section>
  );
}
