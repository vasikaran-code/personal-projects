import { ArrowDown, Github, Linkedin, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { personalInfo } from '../../data/portfolio';

const stack = ['React', 'TypeScript', 'FastAPI', 'AWS'];

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-primary-50 bg-grid pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-sm font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Available for opportunities
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hi, I'm{' '}
              <span className="text-primary-600 underline decoration-amber-400 decoration-4 underline-offset-8">
                {personalInfo.name}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4">{personalInfo.role}</p>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-10">{personalInfo.tagline}</p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 mb-10">
              <Button href="#contact" size="lg">
                Get in Touch
              </Button>
              <Button href="#projects" variant="outline" size="lg">
                View Projects
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6">
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
          </div>

          <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-full h-full bg-primary-200 rounded-xl"></div>
            <div className="relative bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="ml-3 text-xs text-gray-400 font-mono">developer.ts</span>
              </div>
              <pre className="p-4 sm:p-6 text-xs sm:text-sm leading-6 sm:leading-7 font-mono overflow-x-auto">
                <code>
                  <span className="text-primary-300">const</span>{' '}
                  <span className="text-sky-300">developer</span>
                  <span className="text-gray-400"> = {'{'}</span>
                  {'\n'}
                  {'  '}<span className="text-gray-300">name</span>
                  <span className="text-gray-400">: </span>
                  <span className="text-amber-300">"{personalInfo.name}"</span>
                  <span className="text-gray-400">,</span>
                  {'\n'}
                  {'  '}<span className="text-gray-300">role</span>
                  <span className="text-gray-400">: </span>
                  <span className="text-amber-300">"{personalInfo.role}"</span>
                  <span className="text-gray-400">,</span>
                  {'\n'}
                  {'  '}<span className="text-gray-300">location</span>
                  <span className="text-gray-400">: </span>
                  <span className="text-amber-300">"{personalInfo.location}"</span>
                  <span className="text-gray-400">,</span>
                  {'\n'}
                  {'  '}<span className="text-gray-300">stack</span>
                  <span className="text-gray-400">: [</span>
                  {stack.map((tech, i) => (
                    <span key={tech}>
                      <span className="text-emerald-300">"{tech}"</span>
                      {i < stack.length - 1 && <span className="text-gray-400">, </span>}
                    </span>
                  ))}
                  <span className="text-gray-400">],</span>
                  {'\n'}
                  {'  '}<span className="text-gray-300">openToWork</span>
                  <span className="text-gray-400">: </span>
                  <span className="text-primary-300">true</span>
                  <span className="text-gray-400">,</span>
                  {'\n'}
                  <span className="text-gray-400">{'};'}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 text-center">
          <a
            href="#about"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
            aria-label="Scroll to about section"
          >
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
