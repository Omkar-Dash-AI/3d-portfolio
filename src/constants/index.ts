// Contains constant data for using in website
// ! Don't remove anything from here if not sure

import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  threejs,
  project1,
  project2,
  project3,
  project4,
  project5,
  project6,
  user1,
  user2,
  user3,
  youtube,
  linkedin,
  instagram, // Added back the Instagram import
  github,
} from "../assets";

// Navbar Links
export const NAV_LINKS = [
  {
    id: "about",
    title: "About",
    link: null,
  },
  {
    id: "work",
    title: "Work",
    link: null,
  },
  {
    id: "contact",
    title: "Contact",
    link: null,
  },
  {
    id: "source-code",
    title: "Source Code",
    link: "https://github.com/Omkar-Dash/",
  },
] as const;

// Services
export const SERVICES = [
  {
    title: "Data Scientist",
    icon: web,
  },
  {
    title: "Machine Learning Engineer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Gen AI Developer",
    icon: creator,
  },
  {
    title: "Junior Developer",
    icon: creator,
  },
] as const;

// Technologies
export const TECHNOLOGIES = [
  {
    name: "Python",
    icon: html,
  },
  {
    name: "Java",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "SQL",
    icon: typescript,
  },
  {
    name: "HTML/CSS",
    icon: reactjs,
  },
  {
    name: "TensorFlow",
    icon: redux,
  },
  {
    name: "Keras",
    icon: tailwind,
  },
  {
    name: "Pandas",
    icon: nodejs,
  },
  {
    name: "NumPy",
    icon: mongodb,
  },
  {
    name: "OpenCV",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "Flask",
    icon: figma,
  },
  {
    name: "Linux",
    icon: docker,
  },
] as const;

// Experiences
export const EXPERIENCES = [
  {
    title: "Team Lead",
    company_name: "CodePath AI/ML Hackathon",
    icon: starbucks,
    iconBg: "#383E56",
    date: "Mar 2023",
    points: [
      "Led a team of 4 in developing an AI-powered mental health chatbot that provided mindful counseling, emotion-based feedback, and veteran-based engagement tracking using messaging and NLP.",
    ],
  },
  {
    title: "Participant",
    company_name: "HackMerge AI Innovation Hackathon",
    icon: tesla,
    iconBg: "#E6DEDD",
    date: "Jan 2023",
    points: [
      "Developed a web application with a sleek user interface built with HTML, CSS, Bootstrap, and Python.",
      "Created a chatbot portal and job matcher using OpenAI embeddings with a web interface.",
    ],
  },
  {
    title: "Used Car Price Prediction System",
    company_name: "Personal Project",
    icon: shopify,
    iconBg: "#383E56",
    date: "Nov 2022 - Mar 2023",
    points: [
      "Developed a predictive model using Python and scikit-learn to estimate used car prices.",
      "Built a web application using HTML, CSS, Bootstrap, and JavaScript.",
      "Implemented Flask API for backend integration and used SQL database to store listings and history.",
    ],
  },
  {
    title: "AI-Powered Resume Scanner",
    company_name: "Personal Project",
    icon: meta,
    iconBg: "#E6DEDD",
    date: "Jan 2023 - Present",
    points: [
      "Developed a resume analysis tool using Python and OpenAI embeddings.",
      "Extracted and matched resume contents with job descriptions for automated candidate shortlisting.",
      "Built a Flask-based web UI and email candidate data and match scores to an SQL database.",
    ],
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: user1,
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: user2,
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: user3,
  },
] as const;

// Projects
export const PROJECTS = [
  {
    name: "Used Car Price Prediction System",
    description:
      "Developed a predictive model using Python and scikit-learn to estimate used car prices with a web application interface built with HTML, CSS, Bootstrap, and JavaScript.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "flask",
        color: "green-text-gradient",
      },
      {
        name: "scikit-learn",
        color: "pink-text-gradient",
      },
    ],
    image: project1,
    source_code_link: "https://github.com/Omkar-Dash/",
    live_site_link: "/projects/car-price-prediction",
  },
  {
    name: "AI-Powered Resume Scanner",
    description:
      "Developed a resume analysis tool using Python and OpenAI embeddings that extracts and matches resume contents with job descriptions for automated candidate shortlisting.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "openai",
        color: "green-text-gradient",
      },
      {
        name: "flask",
        color: "pink-text-gradient",
      },
    ],
    image: project2,
    source_code_link: "https://github.com/Omkar-Dash/",
    live_site_link: "/projects/resume-scanner",
  },
  {
    name: "AI Mental Health Chatbot",
    description:
      "Led a team in developing an AI-powered mental health chatbot that provided mindful counseling, emotion-based feedback, and veteran-based engagement tracking using messaging and NLP.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "nlp",
        color: "green-text-gradient",
      },
      {
        name: "ai",
        color: "pink-text-gradient",
      },
    ],
    image: project3,
    source_code_link: "https://github.com/Omkar-Dash/",
    live_site_link: "/projects/mental-health-chatbot",
  },
  {
    name: "Traffic Surveillance System",
    description:
      "Built an automated traffic surveillance system using YOLO3 and OpenCV to detect rule violations, with license plate recognition integrated with OpenALPR for data logging.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "opencv",
        color: "green-text-gradient",
      },
      {
        name: "yolo",
        color: "pink-text-gradient",
      },
    ],
    image: project4,
    source_code_link: "https://github.com/Omkar-Dash/",
    live_site_link: "/projects/traffic-surveillance",
  },
  {
    name: "Chatbot Portal and Job Matcher",
    description:
      "Created a chatbot portal and job matcher using OpenAI embeddings with a web interface built with HTML, CSS, Bootstrap, and Python during the HackMerge AI Innovation Hackathon.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "openai",
        color: "green-text-gradient",
      },
      {
        name: "web",
        color: "pink-text-gradient",
      },
    ],
    image: project5,
    source_code_link: "https://github.com/Omkar-Dash/",
    live_site_link: "/projects/job-matcher",
  },
  {
    name: "Data Science Portfolio",
    description:
      "A showcase of my data science and machine learning projects, demonstrating skills in Python, data analysis, visualization, and model building for various real-world applications.",
    tags: [
      {
        name: "python",
        color: "blue-text-gradient",
      },
      {
        name: "data-science",
        color: "green-text-gradient",
      },
      {
        name: "machine-learning",
        color: "pink-text-gradient",
      },
    ],
    image: project6,
    source_code_link: "https://github.com/Omkar-Dash/",
    live_site_link: "/projects/data-science-portfolio",
  },
] as const;

export const SOCIALS = [
  {
    name: "YouTube",
    icon: youtube,
    link: "https://www.youtube.com/@omkardash9613",
  },
  {
    name: "Linkedin",
    icon: linkedin,
    link: "https://www.linkedin.com/in/omkar-dash-a4266b326/",
  },
  {
    name: "Instagram",
    icon: instagram,
    link: "https://www.instagram.com/omkar__dash?igsh=MW9rYzh2OWdmZXR2dA==",
  },
  {
    name: "GitHub",
    icon: github,
    link: "https://github.com/Omkar-Dash/",
  },
] as const;
