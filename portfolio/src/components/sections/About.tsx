import { MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Section from '../ui/Section';
import { personalInfo } from '../../data/portfolio';
import profile from '../../assets/profile.webp'

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

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary-50 border border-primary-100">
              <MapPin size={20} className="text-primary-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
              <Briefcase size={20} className="text-emerald-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">Open to Work</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-100">
              <GraduationCap size={20} className="text-amber-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">BE Graduate</span>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative">
            <div className="w-64 sm:w-80 aspect-[2/3] rounded-2xl shadow-xl overflow-hidden">
              <img
                src={profile}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-200 rounded-xl -z-10"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-amber-200 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </Section>
  );
}
