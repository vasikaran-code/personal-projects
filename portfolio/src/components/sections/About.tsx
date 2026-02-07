import { MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Section from '../ui/Section';
import { personalInfo } from '../../data/portfolio';
import profile from '../../assets/shared image.jpeg'

export default function About() {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Get to know me better"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="prose prose-lg text-gray-600 space-y-4">
            {personalInfo.about.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} className="text-primary-600" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase size={18} className="text-primary-600" />
              <span>Open to Work</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap size={18} className="text-primary-600" />
              <span>BE Graduate</span>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl shadow-xl overflow-hidden">
              <img
                src={profile}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-200 rounded-xl -z-10"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary-100 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </Section>
  );
}
