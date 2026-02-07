import { ArrowDown, Github, Linkedin, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { personalInfo } from '../../data/portfolio';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center animate-fade-in">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              Available for opportunities
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              {personalInfo.name}
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-4">{personalInfo.role}</p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">{personalInfo.tagline}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button href="#contact" size="lg">
              Get in Touch
            </Button>
            <Button href="#projects" variant="outline" size="lg">
              View Projects
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Resume"
            >
              <FileText size={24} />
            </a>
          </div>

          <div className="mt-16 animate-bounce">
            <a
              href="#about"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
              aria-label="Scroll to about section"
            >
              <ArrowDown size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
