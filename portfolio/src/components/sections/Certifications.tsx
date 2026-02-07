import { Award, Calendar, MapPin } from 'lucide-react';
import Section from '../ui/Section';
import { certifications } from '../../data/portfolio';

export default function Certifications() {
  return (
    <Section
      id="certifications"
      title="Certifications"
      subtitle="Professional certifications and training"
    >
      <div className="max-w-3xl mx-auto">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Award size={32} className="text-primary-600" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{cert.institution}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {cert.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {cert.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
