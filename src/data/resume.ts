export const profile = {
  name: "Anil Sahu",
  firstName: "Anil",
  role: "Full Stack Developer",
  tagline: "I build fast, secure, production-ready web applications end to end.",
  summary:
    "MERN stack developer with 2+ years of experience designing, developing and deploying 10+ production web applications — including e-commerce, CMS, school and healthcare platforms. I own everything from database design and REST APIs through to deployment, SEO and client delivery.",
  email: "asahu896214@gmail.com",
  phone: "+91 6266306462",
  phoneHref: "tel:+916266306462",
  location: "Gwalior, M.P., India",
  resumeUrl: "#contact",
  socials: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/anil-sahu-8540302aa/",
    },
    {
      label: "GitHub",
      href: "https://github.com/Anil250332",
    },
    {
      label: "LeetCode",
      href: "https://leetcode.com/u/mr_anil___00/",
    },
  ],
};

export type SkillCategory = {
  title: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "SQL", "HTML5", "CSS3"],
  },
  {
    title: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "GSAP"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "Socket.IO", "REST API Design"],
  },
  {
    title: "Database",
    items: ["MongoDB", "MySQL"],
  },
  {
    title: "Tools & Deployment",
    items: ["Git", "GitHub", "Postman", "Firebase", "Vercel", "Netlify", "Render", "Hostinger cPanel"],
  },
  {
    title: "Concepts",
    items: ["JWT Authentication", "Bcrypt", "RBAC", "Real-Time Systems", "SEO (SSR)", "Agile"],
  },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    company: "ADRYTER",
    role: "Full Stack Developer",
    period: "Jan 2025 — Present",
    location: "Gwalior, M.P.",
    highlights: [
      "Designed, developed and deployed 10+ production web applications (business, e-commerce, CMS, school and healthcare) using React.js, Next.js, Node.js, Express.js, MySQL and MongoDB — owning requirements, database design, REST APIs and release.",
      "Integrated third-party services including the NimbusPost shipping API and Google Gemini AI for voice-based product search and recommendations.",
      "Built role-based admin dashboards (JWT, RBAC) to manage users, products, orders, inventory and content from a single interface.",
      "Implemented real-time lead capture and instant notifications using Socket.IO, plus a dynamic Blog CMS so non-technical staff can publish independently.",
      "Applied Next.js SSR, dynamic metadata and structured data for SEO; handled cPanel hosting, domain/DNS, SSL and post-deployment maintenance.",
      "Worked directly with clients on requirement gathering, delivery and ongoing support.",
    ],
  },
  {
    company: "MOBZWAY TECHNOLOGIES",
    role: "Software Engineer Intern",
    period: "May 2024 — Aug 2024",
    location: "Remote",
    highlights: [
      "Developed and optimized RESTful APIs using Node.js, Express.js, MongoDB and Firebase with secure authentication, real-time database operations and scalable backend services.",
      "Collaborated with senior engineers in an Agile team on backend architecture, API integration, debugging, code reviews, technical documentation and Git-based version control.",
    ],
  },
];

export type Project = {
  name: string;
  description: string;
  tech: string[];
  url: string;
  features: string[];
};

export const projects: Project[] = [
  {
    name: "Karot Kingdom",
    description: "E-commerce store for lab-grown diamond jewelry with an interactive custom-design form for bespoke pieces.",
    tech: ["React.js", "Node.js", "Express.js", "SQL"],
    url: "https://karotkingdom.com/",
    features: [
      "Responsive, SEO-friendly storefront with REST APIs.",
      "Deployed to production with domain and SSL.",
    ],
  },
  {
    name: "Shri Radhe Collection",
    description: "Full-stack e-commerce platform with product catalog, cart, order management and secure REST APIs.",
    tech: ["React.js", "Node.js", "Express.js", "SQL", "NimbusPost"],
    url: "https://shriradhecollection.com/",
    features: [
      "Integrated NimbusPost shipping API for automated shipment creation, order tracking and logistics.",
      "Production deployment on cPanel with SSL and DNS configuration.",
    ],
  },
  {
    name: "PedNeuro",
    description: "Healthcare platform for a pediatric neurology practice with JWT authentication and role-based access control.",
    tech: ["Next.js", "Node.js", "MongoDB", "JWT Auth"],
    url: "https://pedneuro.in/",
    features: [
      "Privacy-first architecture for sensitive patient data.",
      "Fast, SEO-optimized medical content pages via Next.js SSR.",
    ],
  },
  {
    name: "Kiddy's Corner Public School",
    description: "Responsive school website with dynamic content management, admission information and contact enquiry features.",
    tech: ["React.js", "Node.js", "Express.js", "SQL", "JWT Auth"],
    url: "https://www.kiddyscornerpublicschool.com/",
    features: [
      "Secure backend APIs with SQL and JWT auth.",
      "cPanel deployment with domain and SSL.",
    ],
  },
];

export const needOptions = [
  "Full-stack website",
  "Web application",
  "E-commerce store",
  "Admin dashboard",
  "API / Backend",
  "Something else",
];

export const budgetOptions = [
  "Under $1k",
  "$1k — $5k",
  "$5k — $10k",
  "$10k+",
  "Not sure yet",
];

export type Education = {
  school: string;
  degree: string;
  period: string;
  note?: string;
};

export const education: Education[] = [
  {
    school: "MPCT College, Gwalior",
    degree: "Master of Computer Applications (MCA)",
    period: "Pursuing",
  },
  {
    school: "ITM University, Gwalior",
    degree: "Bachelor of Computer Applications (BCA)",
    period: "2023 — 2026",
  },
];
