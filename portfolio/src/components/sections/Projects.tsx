import { Github, ExternalLink } from 'lucide-react';
import Section from '../ui/Section';
import Card, { CardImage, CardContent, CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import { projects } from '../../data/portfolio';

export default function Projects() {
  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="Some of my recent work"
    >
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardImage src={project.image} alt={project.title} />
            <CardContent>
              <div className="flex items-start justify-between gap-4 mb-3">
                <CardTitle>{project.title}</CardTitle>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 transition-colors"
                    aria-label={`View ${project.title} live demo`}
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              <CardDescription className="mb-4">{project.description}</CardDescription>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="primary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
