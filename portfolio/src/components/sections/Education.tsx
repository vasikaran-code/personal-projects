import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import Section from '../ui/Section';
import { education } from '../../data/portfolio';

export default function Education() {
  return (
    <Section
      id="education"
      title="Education"
      subtitle="My academic background"
    >
      <div className="max-w-3xl mx-auto">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  <GraduationCap size={32} className="text-primary-600" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{edu.institution}</h3>
                <p className="text-primary-600 font-medium mb-3">
                  {edu.degree} in {edu.field}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {edu.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {edu.location}
                  </span>
                </div>

                {edu.achievements && edu.achievements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Award size={16} className="text-primary-500" />
                      Achievements
                    </h4>
                    <ul className="space-y-2">
                      {edu.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-600 flex items-start gap-2">
                          <span className="text-primary-500 mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
