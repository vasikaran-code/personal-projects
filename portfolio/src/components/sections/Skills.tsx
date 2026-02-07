import Section from '../ui/Section';
import { skills } from '../../data/portfolio';

export default function Skills() {
  return (
    <Section
      id="skills"
      title="Skills & Technologies"
      subtitle="Technologies I work with"
      dark
    >
      <div className="grid md:grid-cols-3 gap-8">
        {skills.map((category) => (
          <div
            key={category.category}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6 pb-4 border-b border-gray-700">
              {category.category}
            </h3>
            <div className="space-y-4">
              {category.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-gray-400 text-sm">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
