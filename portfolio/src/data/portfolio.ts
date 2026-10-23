export const personalInfo = {
  name: "Vasikaran K",
  role: "Full Stack Developer & AI Engineer",
  tagline: "Building scalable web applications with modern technologies",
  email: "vasikarankalaiyarasan@gmail.com",
  linkedin: "https://www.linkedin.com/in/vasikaran-k/",
  github: "https://github.com/vasikaran-code",
  location: "Thanjavur, TamilNadu",
  resumeUrl: "/Vasikaran_K.pdf",
  about: `Full Stack Developer and AI Engineer with 2 years of hands-on experience in React.js, TypeScript, and Python (FastAPI), specializing in building scalable web applications and APIs. Proficient in developing modern user interfaces, RESTful and GraphQL services, and working with cloud technologies such as AWS Lambda and DynamoDB.

A fast learner and proactive team player, committed to delivering clean, reliable, and high-quality software solutions.`,
};

export interface Skill {
  name: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export const skills: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React.js" },
      { name: "TypeScript" },
      { name: "Redux-Saga" },
      { name: "HTML/CSS" },
      { name: "Material UI" },
      { name: "Bootstrap" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Python (FastAPI)" },
      { name: "Java (Spring Core)" },
      { name: "Hibernate" },
      { name: "GraphQL (Strawberry)" },
      { name: "PostgreSQL" },
      { name: "DynamoDB" },
      // { name: "Nest.js" },
    ],
  },
  // {
  //   category: "Databases",
  //   skills: [
  //     { name: "PostgreSQL" },
  //     { name: "MySQL" },
  //     { name: "DynamoDB" },
  //   ],
  // },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "Git / GitHub" },
      { name: "AWS Lambda" },
      { name: "AWS Amplify" },
      { name: "S3 / CloudWatch" },
      { name: "CI/CD" },
      { name: "Linux" },
    ],
  },
  {
    category: "AI Tools",
    skills: [{ name: "Claude" }, { name: "Cursor" }],
  },
  // {
  //   category: "Tools",
  //   skills: [
  //     { name: "Git / GitHub" },
  //     { name: "VS Code" },
  //     { name: "Postman" },
  //     { name: "Eclipse J2EE" },
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
    image: "https://images.unsplash.com/photo-1626863905121-3b0c0ed7b94c?w=600&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1758691463203-cce9d415b2b5?w=600&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1781038507661-06501ddcdc90?w=600&h=400&fit=crop",
    techStack: ["Nest.js", "React.js", "REST API", "MongoDB"],
    githubUrl: "#",
    liveUrl: "#",
    featured: true,
  },
  {
    id: 4,
    title: "GI Marketplace (ArtisanLane)",
    description:
      "Built a multi-vendor marketplace for Geographical Indication (GI) tagged products, connecting customers directly with regional artisans. Implemented role-based access for three user types: Admin (platform oversight, merchant and product management), Merchant (store setup, product listings and order handling), and Customer (browsing, product discovery and purchasing). Developed a responsive React storefront showcasing authentic handcrafted goods from across India.",
    image: "https://images.unsplash.com/photo-1762173886363-de541417e48e?w=600&h=400&fit=crop",
    techStack: ["React", "React Native", "FastAPI", "GraphQL", "AWS Lambda", "DynamoDB", "Stripe"],
    githubUrl: "#",
    liveUrl: "https://artisanlane.in/products",
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
    role: "Full Stack Developer & AI Engineer",
    duration: "Sept 2025 - Present",
    location: "On-site",
    description: [
      "Develop full stack features end to end, from React and TypeScript interfaces to FastAPI services and AWS deployments",
      "Design and build AI-powered features by integrating large language model APIs such as Claude into web applications",
      "Use AI-assisted development tools including Claude and Cursor for faster coding, refactoring, debugging and code review",
      "Work with product and engineering teams to turn requirements into production-ready features",
    ],
    techUsed: ["React.js", "TypeScript", "Python", "FastAPI", "AWS", "Claude", "Cursor"],
  },
  {
    id: 2,
    company: "Inforios Software Technologies",
    role: "Junior Software Developer",
    duration: "Sept 2024 - Aug 2025",
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
    id: 3,
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
    id: 4,
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
