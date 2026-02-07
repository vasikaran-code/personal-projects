import image from '../assets/std_registration.webp'
import image2 from '../assets/online-application-form-modish-registration_31965-46229.avif'

export const personalInfo = {
  name: "Vasikaran K",
  role: "Junior Software Developer",
  tagline: "Building scalable web applications with modern technologies",
  email: "vasikarankalaiyarasan@gmail.com",
  linkedin: "https://www.linkedin.com/in/vasikaran-k/",
  github: "https://github.com/vasikaran-code",
  location: "Thanjavur, TamilNadu",
  resumeUrl: "/resume.pdf",
  about: `Junior Software Developer with 2 years of hands-on experience in React.js, TypeScript, and Python (FastAPI), specializing in building scalable web applications and APIs. Proficient in developing modern user interfaces, RESTful and GraphQL services, and working with cloud technologies such as AWS Lambda and DynamoDB.

A fast learner and proactive team player, committed to delivering clean, reliable, and high-quality software solutions.`,
};

export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React.js", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Redux-Saga", level: 75 },
      { name: "HTML/CSS", level: 85 },
      { name: "Material UI", level: 80 },
      { name: "Bootstrap", level: 80 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Python (FastAPI)", level: 85 },
      { name: "Java (Spring Core)", level: 70 },
      { name: "Hibernate", level: 70 },
      { name: "GraphQL (Strawberry)", level: 75 },
      { name: "PostgreSQL", level: 85 },
      { name: "DynamoDB", level: 80 },
      // { name: "Nest.js", level: 75 },
    ],
  },
  // {
  //   category: "Databases",
  //   skills: [
  //     { name: "PostgreSQL", level: 85 },
  //     { name: "MySQL", level: 80 },
  //     { name: "DynamoDB", level: 80 },
  //   ],
  // },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "Git / GitHub", level: 85 },
      { name: "AWS Lambda", level: 80 },
      { name: "AWS Amplify", level: 75 },
      { name: "S3 / CloudWatch", level: 75 },
      { name: "CI/CD", level: 75 },
      { name: "Linux", level: 85 },
    ],
  },
  // {
  //   category: "Tools",
  //   skills: [
  //     { name: "Git / GitHub", level: 85 },
  //     { name: "VS Code", level: 90 },
  //     { name: "Postman", level: 85 },
  //     { name: "Eclipse J2EE", level: 70 },
  //   ],
  // },
];

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Customer Support & Product Management Platform",
    description:
      "Architected and built a multi-business customer support system from concept to production, utilizing an event-driven, serverless backend with FastAPI, AWS Lambda, API Gateway, and DynamoDB. Engineered a responsive React/TypeScript UI with seamless workflow and real-time updates, significantly enhancing agent efficiency.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
    techStack: ["React", "TypeScript", "FastAPI", "AWS Lambda", "DynamoDB", "API Gateway"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
  },
  {
    id: 2,
    title: "Pharmaceutical (CLM) Application",
    description:
      "Spearheaded the development of a Closed Loop Marketing (CLM) platform, designing responsive React/TypeScript interfaces that improved user engagement by approximately 30%. Implemented robust FastAPI backend services for secure content delivery and analytics tracking. Optimized PostgreSQL database queries, improving data retrieval speed by 40%, handling over 1 million records daily.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    techStack: ["React", "TypeScript", "FastAPI", "PostgreSQL"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
  },
  {
    id: 3,
    title: "Student Registration Application (Natyakala)",
    description:
      "Built a complete student registration system using Nest.js and React.js, integrating secure validation workflows for efficient student onboarding. Integrated MongoDB for seamless data storage, reducing initial application load times by 20% and ensuring fast query performance. Collaborated with cross-functional teams to implement robust booking and management features.",
    image: image2,
    techStack: ["Nest.js", "React.js", "REST API", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
  },
];

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
  techUsed: string[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: "Inforios Software Technologies",
    role: "Junior Software Developer",
    duration: "Sept 2024 - Present",
    location: "On-site",
    description: [
      "Developed and maintained APIs for the organization, ensuring optimal performance and security",
      "Collaborated with cross-functional teams to improve software efficiency and user experience",
      "Participated in code reviews, debugging, and optimizing application performance",
      "Completed intensive training in React.js and Python, gaining proficiency in web development and database management",
    ],
    techUsed: ["React.js", "Python", "FastAPI", "AWS", "DynamoDB"],
  },
  {
    id: 2,
    company: "Inforios Software Technologies",
    role: "Trainee",
    duration: "March - Sept 2024",
    location: "On-site",
    description: [
      "Gained practical experience in SQL, HTML, CSS, and JavaScript through comprehensive training",
      "Built an Event Booking Application using Nest.js, React.js, REST API, and PostgreSQL",
      "Implemented user event booking, organization details, and robust booking/management features with high performance and data integrity",
    ],
    techUsed: ["Nest.js", "React.js", "REST API", "PostgreSQL", "JavaScript"],
  },
  {
    id: 3,
    company: "Shiash Info Solutions Private Limited",
    role: "Intern",
    duration: "Feb - April 2023",
    location: "On-site",
    description: [
      "Learned and applied core Java programming principles, focusing on object-oriented design, data structures, and algorithms",
      "Contributed to multiple hands-on Java projects, directly improving problem-solving and software development lifecycle skills",
    ],
    techUsed: ["Java", "OOP", "Data Structures", "Algorithms"],
  },
];

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  location: string;
  achievements?: string[];
}

export const education: Education[] = [
  {
    id: 1,
    institution: "Mahendra Engineering College",
    degree: "Bachelor of Engineering",
    field: "Electronics and Communication Engineering",
    duration: "Aug 2019 - May 2023",
    location: "Namakkal, TamilNadu",
  },
];

export interface Certification {
  id: number;
  name: string;
  institution: string;
  duration: string;
  location: string;
}

export const certifications: Certification[] = [
  {
    id: 1,
    name: "Java Full-Stack Developer",
    institution: "Jspiders",
    duration: "Jun 2023 - Jan 2024",
    location: "Bangalore",
  },
];

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
];
