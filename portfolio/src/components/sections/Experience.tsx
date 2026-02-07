import { Building2, Calendar, MapPin } from 'lucide-react';
import Section from '../ui/Section';
import Badge from '../ui/Badge';
import { experiences } from '../../data/portfolio';

export default function Experience() {
  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="My professional journey"
    >
      <div className="relative">
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 transform md:-translate-x-1/2"></div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`relative flex flex-col md:flex-row gap-8 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow transform -translate-x-1/2 md:-translate-x-1/2"></div>

              <div className="flex-1 md:w-1/2"></div>

              <div
                className={`flex-1 md:w-1/2 ml-8 md:ml-0 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 text-primary-600 mb-3">
                    <Building2 size={20} />
                    <span className="font-semibold">{exp.company}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.role}</h3>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {exp.location}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-gray-600 flex items-start gap-2">
                        <span className="text-primary-500 mt-1.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.techUsed.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
