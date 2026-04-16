// This is a seeder that sends fake data to the db so that we can run this tmpe data 

/**
 * StudyNotion — Database Seeder
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates fake instructors, students, categories, and full courses (with
 * sections + subsections) directly in MongoDB — no running server needed.
 *
 * Usage:
 *   cd server
 *   node scripts/seedData.js
 *
 * To wipe everything created by this script and re-seed:
 *   node scripts/seedData.js --reset
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") })

const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const cloudinary = require("cloudinary").v2
const fs = require("fs")
const path = require("path")

// ─── Models ──────────────────────────────────────────────────────────────────
const User = require("../models/User")
const Profile = require("../models/Profile")
const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")

// ═════════════════════════════════════════════════════════════════════════════
//   CONFIGURATION — Edit this section to customise what gets created
// ═════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  // How many fake accounts to create
  // NOTE: instructorCount cannot exceed the number of entries in INSTRUCTORS array (8)
  instructorCount: 5,
  studentCount: 4,

  // How many courses each instructor should own (picks from COURSE_CATALOG)
  coursesPerInstructor: 2,

  // Seed password — all fake accounts will use this password
  defaultPassword: "Test@1234",

  // ── Video files ────────────────────────────────────────────────────────────
  // Paths use forward slashes only (no backslashes on Windows in JS strings)
  videoPaths: [
    "C:/Users/ACER/Downloads/Love & War _ ANNOUNCEMENT _ Ranbir Kapoor _ Vicky Kaushal _ Alia Bhatt _ Sanjay Leela Bhansali.mp4",
    "C:/Users/ACER/Downloads/BORDER 2 (Teaser)_ Sunny Deol, Varun D, Diljit, Ahan _ Anurag S _ JP Dutta, Bhushan K _ 23-Jan-2026.mp4",
  ],

  // Fallback video used when no local video paths are given or files not found.
  fallbackVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",

  // ── Thumbnail images ───────────────────────────────────────────────────────
  // All paths use forward slashes. Missing extensions added where needed.
  // The seeder cycles through these for each course — duplicates are fine.
  thumbnailPaths: [
    "C:/Users/ACER/Downloads/Screenshot_2026-02-25-03-14-48-53_1c337646f29875672b5a61192b9010f9.jpg",
    "C:/Users/ACER/Downloads/Screenshot_2026-02-25-03-13-56-64_1c337646f29875672b5a61192b9010f9.jpg",
    "C:/Users/ACER/Downloads/Screenshot_2026-02-25-03-13-53-96_1c337646f29875672b5a61192b9010f9.jpg",
    "C:/Users/ACER/Downloads/Screenshot_2026-02-25-03-13-52-81_1c337646f29875672b5a61192b9010f9.jpg",
    "C:/Users/ACER/Downloads/Screenshot_2026-02-25-03-13-51-65_1c337646f29875672b5a61192b9010f9.jpg",
    "C:/Users/ACER/Downloads/Screenshot_2026-02-25-03-13-49-83_1c337646f29875672b5a61192b9010f9.jpg",
    "C:/Users/ACER/Downloads/Screenshot_2026-02-25-02-54-50-30_1c337646f29875672b5a61192b9010f9.jpg",
    "C:/Users/ACER/Downloads/ChatGPT Image Feb 28, 2026, 01_59_49 PM.jpg",
    "C:/Users/ACER/Downloads/github image.jpg",
  ],
}

// ═════════════════════════════════════════════════════════════════════════════
//   COURSE CATALOG — Every course the bot can create
//   Feel free to add / remove / rename anything here.
// ═════════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
  { name: "Web Development",    description: "Frontend, backend and full-stack web courses" },
  { name: "Data Science",       description: "Machine learning, AI, analytics and data engineering" },
  { name: "Mobile Development", description: "iOS, Android and cross-platform app development" },
  { name: "UI/UX Design",       description: "User interface and experience design principles" },
  { name: "DevOps & Cloud",     description: "CI/CD, Docker, Kubernetes, AWS and cloud infrastructure" },
  { name: "Cybersecurity",      description: "Ethical hacking, network security and cryptography" },
]

const COURSE_CATALOG = [
  {
    courseName: "The Complete JavaScript Bootcamp",
    courseDescription:
      "Master JavaScript from absolute zero to advanced ES2024 concepts. Covers DOM manipulation, async/await, closures, prototypes, modules and real-world projects.",
    whatYouWillLearn:
      "Write clean, modern JavaScript. Build interactive UIs. Handle async operations. Understand the event loop and closures deeply.",
    price: 1999,
    tag: ["javascript", "web development", "frontend"],
    instructions: [
      "Basic computer skills required",
      "No prior programming experience needed",
      "A modern browser and a text editor are all you need",
    ],
    categoryName: "Web Development",
    sections: [
      {
        sectionName: "Getting Started with JavaScript",
        subSections: [
          { title: "What is JavaScript and How It Works", description: "Introduction to JS, V8 engine, and the browser runtime." },
          { title: "Variables, Data Types and Operators",  description: "var, let, const — when to use which. Primitive vs reference types." },
          { title: "Control Flow: if / else / switch",     description: "Writing decision-making logic in JavaScript." },
        ],
      },
      {
        sectionName: "Functions and Scope",
        subSections: [
          { title: "Function Declarations vs Expressions", description: "Hoisting, anonymous functions, and arrow functions." },
          { title: "Closures Explained",                   description: "Lexical scope, closures, and practical use-cases." },
          { title: "Higher-Order Functions",               description: "map, filter, reduce — writing functional JavaScript." },
        ],
      },
      {
        sectionName: "Asynchronous JavaScript",
        subSections: [
          { title: "The Event Loop Deep Dive",  description: "Call stack, Web APIs, callback queue and microtasks." },
          { title: "Promises from Scratch",     description: "Creating, chaining and handling errors with Promises." },
          { title: "async / await in Practice", description: "Writing readable async code and error handling patterns." },
        ],
      },
      {
        sectionName: "Real-World Project: Todo App",
        subSections: [
          { title: "Project Setup and DOM Structure", description: "Building the HTML skeleton and wiring up CSS." },
          { title: "Adding and Deleting Todos",       description: "Event delegation, dynamic DOM creation." },
          { title: "localStorage Persistence",        description: "Saving and reading todos from localStorage." },
        ],
      },
    ],
  },
  {
    courseName: "React 18 — The Complete Guide",
    courseDescription:
      "Build modern, production-ready React applications. Covers hooks, context, Redux Toolkit, React Router v6, performance optimisation, and testing.",
    whatYouWillLearn:
      "Build SPAs with React 18. Manage state with hooks and Redux. Navigate with React Router. Test components with React Testing Library.",
    price: 2499,
    tag: ["react", "javascript", "frontend", "web development"],
    instructions: [
      "Solid JavaScript knowledge required",
      "HTML and CSS basics needed",
    ],
    categoryName: "Web Development",
    sections: [
      {
        sectionName: "React Fundamentals",
        subSections: [
          { title: "What is React and Why Use It",    description: "Virtual DOM, component model, and React philosophy." },
          { title: "JSX and Rendering Elements",      description: "Writing JSX, expressions, and conditional rendering." },
          { title: "Props and Component Composition", description: "Passing data down, default props, children prop." },
        ],
      },
      {
        sectionName: "Hooks Deep Dive",
        subSections: [
          { title: "useState and Re-renders",     description: "State batching, functional updates, and immutability." },
          { title: "useEffect and Side Effects",  description: "Dependencies array, cleanup, and avoiding infinite loops." },
          { title: "useContext for Global State", description: "Creating and consuming context without prop drilling." },
          { title: "useMemo and useCallback",     description: "Memoisation strategies to prevent unnecessary re-renders." },
        ],
      },
      {
        sectionName: "State Management with Redux Toolkit",
        subSections: [
          { title: "Redux Concepts in 20 Minutes", description: "Store, slices, reducers, and actions." },
          { title: "createSlice and createAsyncThunk", description: "Writing async thunks and handling loading/error states." },
          { title: "Connecting Redux to React",    description: "useSelector, useDispatch, and the Provider pattern." },
        ],
      },
      {
        sectionName: "Capstone: Build a Movie Finder App",
        subSections: [
          { title: "Project Architecture",           description: "Folder structure, routing setup, and API planning." },
          { title: "Fetching Movies from TMDB API",  description: "Using RTK Query for data fetching and caching." },
          { title: "Search, Filter and Pagination",  description: "Building a real search experience with debounce." },
          { title: "Deployment to Vercel",           description: "Building for production and configuring env vars." },
        ],
      },
    ],
  },
  {
    courseName: "Python for Data Science and Machine Learning",
    courseDescription:
      "Go from Python basics to building real ML models. Covers NumPy, Pandas, Matplotlib, Scikit-learn, and an intro to deep learning with TensorFlow.",
    whatYouWillLearn:
      "Analyse data with Pandas. Visualise insights with Matplotlib. Build regression, classification, and clustering models.",
    price: 2999,
    tag: ["python", "data science", "machine learning", "AI"],
    instructions: [
      "No ML experience required",
      "Basic maths (algebra and statistics) is helpful",
    ],
    categoryName: "Data Science",
    sections: [
      {
        sectionName: "Python Refresher for Data Science",
        subSections: [
          { title: "Python Basics in 1 Hour",         description: "Variables, loops, functions, list comprehensions." },
          { title: "NumPy Arrays and Operations",     description: "Creating arrays, broadcasting, and vectorised ops." },
          { title: "Pandas DataFrames",               description: "Reading CSVs, filtering, groupby, and merging." },
        ],
      },
      {
        sectionName: "Data Visualisation",
        subSections: [
          { title: "Matplotlib from Scratch",  description: "Line, bar, scatter and histogram plots." },
          { title: "Seaborn for Statistics",   description: "Heatmaps, pair plots, and distribution plots." },
        ],
      },
      {
        sectionName: "Machine Learning with Scikit-learn",
        subSections: [
          { title: "Supervised Learning Overview",      description: "Regression vs classification, bias-variance tradeoff." },
          { title: "Linear and Logistic Regression",   description: "Training, evaluation metrics, and model serialisation." },
          { title: "Decision Trees and Random Forests", description: "Tree-based models, feature importance." },
          { title: "Model Evaluation and Cross Validation", description: "k-Fold CV, confusion matrix, ROC curve." },
        ],
      },
      {
        sectionName: "Intro to Deep Learning",
        subSections: [
          { title: "Neural Networks from First Principles", description: "Neurons, layers, activation functions, backprop." },
          { title: "Building a Model with TensorFlow/Keras", description: "Sequential API, compiling, training, and saving." },
        ],
      },
    ],
  },
  {
    courseName: "Node.js and Express — Backend Development",
    courseDescription:
      "Build robust REST APIs and real-time apps with Node.js and Express. Covers routing, middleware, MongoDB, authentication, file uploads, and deployment.",
    whatYouWillLearn:
      "Design RESTful APIs. Authenticate users with JWT. Store data in MongoDB. Handle file uploads to Cloudinary. Deploy to Render.",
    price: 2199,
    tag: ["nodejs", "express", "backend", "mongodb"],
    instructions: [
      "JavaScript knowledge required",
      "Basic understanding of HTTP helpful",
    ],
    categoryName: "Web Development",
    sections: [
      {
        sectionName: "Node.js Core Concepts",
        subSections: [
          { title: "How Node.js Works — Event Loop and libuv", description: "Non-blocking I/O, thread pool, and the event loop." },
          { title: "Modules: CommonJS vs ES Modules",          description: "require vs import, module caching." },
          { title: "File System and Streams",                  description: "Reading, writing and streaming files." },
        ],
      },
      {
        sectionName: "Building APIs with Express",
        subSections: [
          { title: "Express Setup and Routing",  description: "app.get, app.post, route params, query strings." },
          { title: "Middleware Deep Dive",        description: "Error middleware, CORS, body parsing, logging." },
          { title: "REST API Design Best Practices", description: "HTTP verbs, status codes, versioning, and pagination." },
        ],
      },
      {
        sectionName: "MongoDB and Mongoose",
        subSections: [
          { title: "Mongoose Models and Schemas",   description: "Defining schemas, validation, and virtuals." },
          { title: "CRUD Operations",               description: "findById, save, updateOne, deleteMany." },
          { title: "Relationships and Population",  description: "Referenced vs embedded docs, populate()." },
          { title: "Indexing for Performance",      description: "Compound indexes, text indexes, explain()." },
        ],
      },
      {
        sectionName: "Authentication and Security",
        subSections: [
          { title: "JWT Authentication from Scratch", description: "Signing, verifying, and refreshing tokens." },
          { title: "Password Hashing with bcrypt",    description: "Salting, hashing, and secure storage." },
          { title: "Rate Limiting and Helmet",        description: "Protecting APIs from abuse and common attacks." },
        ],
      },
    ],
  },
  {
    courseName: "Flutter & Dart — Build iOS and Android Apps",
    courseDescription:
      "Create beautiful, cross-platform mobile apps with Flutter. Covers Dart basics, widgets, state management with Provider/Riverpod, and Firebase.",
    whatYouWillLearn:
      "Build pixel-perfect UIs for iOS and Android from a single codebase. Manage state. Integrate Firebase for auth and data.",
    price: 2799,
    tag: ["flutter", "dart", "mobile development", "android", "ios"],
    instructions: [
      "No mobile experience needed",
      "Basic programming knowledge helpful",
    ],
    categoryName: "Mobile Development",
    sections: [
      {
        sectionName: "Dart Language Foundations",
        subSections: [
          { title: "Dart Variables, Types and Null Safety", description: "Sound null safety, late keyword, nullable types." },
          { title: "OOP in Dart",                          description: "Classes, inheritance, mixins, and interfaces." },
          { title: "Async Programming in Dart",            description: "Futures, async/await, and Streams." },
        ],
      },
      {
        sectionName: "Flutter Widgets",
        subSections: [
          { title: "Stateless vs Stateful Widgets",  description: "Widget tree, build context, and hot reload." },
          { title: "Layouts: Column, Row, Stack",    description: "Building complex layouts with Flex and Stack." },
          { title: "Navigation with Navigator 2.0", description: "Declarative routing, named routes, deep linking." },
        ],
      },
      {
        sectionName: "State Management",
        subSections: [
          { title: "setState and Lifting State Up", description: "Simple state, when to lift, when to extract." },
          { title: "Provider Package",              description: "ChangeNotifier, Consumer, and ProxyProvider." },
          { title: "Riverpod — Modern State",       description: "StateNotifierProvider, FutureProvider, ref.watch." },
        ],
      },
      {
        sectionName: "Firebase Integration",
        subSections: [
          { title: "Firebase Setup and Auth",     description: "Email/password and Google sign-in." },
          { title: "Firestore Real-time Database", description: "Reading, writing, and streaming Firestore docs." },
          { title: "Firebase Storage",             description: "Uploading and displaying user images." },
        ],
      },
    ],
  },
  {
    courseName: "UI/UX Design Masterclass — Figma to Code",
    courseDescription:
      "Learn professional UI/UX design from scratch using Figma. Understand design systems, typography, colour theory, accessibility, and handoff to developers.",
    whatYouWillLearn:
      "Design beautiful interfaces in Figma. Build and maintain a design system. Conduct user research. Create interactive prototypes.",
    price: 1799,
    tag: ["ui design", "ux design", "figma", "design systems"],
    instructions: [
      "No design experience required",
      "A free Figma account is needed",
    ],
    categoryName: "UI/UX Design",
    sections: [
      {
        sectionName: "Design Fundamentals",
        subSections: [
          { title: "Principles of Good Design",     description: "Hierarchy, contrast, alignment, proximity, repetition." },
          { title: "Typography for Interfaces",     description: "Font pairing, line height, readability, and scale." },
          { title: "Colour Theory in Practice",     description: "Hue, saturation, accessible contrast, and palettes." },
        ],
      },
      {
        sectionName: "Figma from Zero to Pro",
        subSections: [
          { title: "Figma Workspace Overview",       description: "Frames, groups, auto-layout, and constraints." },
          { title: "Components and Variants",        description: "Building reusable components with states." },
          { title: "Prototyping and Interactions",   description: "Smart animate, overlays, and micro-interactions." },
        ],
      },
      {
        sectionName: "Design Systems",
        subSections: [
          { title: "What is a Design System",        description: "Tokens, components, documentation, and governance." },
          { title: "Building a Component Library",   description: "Buttons, inputs, cards — consistent and scalable." },
        ],
      },
      {
        sectionName: "UX Research and Process",
        subSections: [
          { title: "User Research Methods",          description: "Interviews, surveys, usability testing basics." },
          { title: "Wireframing and Ideation",       description: "Sketching, low-fidelity wireframes, and feedback loops." },
          { title: "Dev Handoff with Figma",         description: "Inspect panel, redlines, and exporting assets." },
        ],
      },
    ],
  },
  {
    courseName: "AWS Cloud Practitioner + Solutions Architect",
    courseDescription:
      "Prepare for AWS certifications and learn to architect scalable cloud solutions. Covers EC2, S3, RDS, Lambda, VPC, IAM, CloudFormation and cost optimisation.",
    whatYouWillLearn:
      "Deploy applications on AWS. Design fault-tolerant architectures. Understand IAM security. Pass the Cloud Practitioner exam.",
    price: 3499,
    tag: ["aws", "cloud", "devops", "certification"],
    instructions: [
      "Basic networking knowledge helpful",
      "A free AWS account is required for hands-on labs",
    ],
    categoryName: "DevOps & Cloud",
    sections: [
      {
        sectionName: "AWS Fundamentals",
        subSections: [
          { title: "Global Infrastructure — Regions and AZs", description: "How AWS is structured globally." },
          { title: "IAM — Identity and Access Management",    description: "Users, groups, roles, and least-privilege policy." },
          { title: "EC2 — Virtual Servers in the Cloud",      description: "Instance types, AMIs, security groups, and key pairs." },
        ],
      },
      {
        sectionName: "Storage and Databases",
        subSections: [
          { title: "S3 Deep Dive",              description: "Buckets, versioning, lifecycle rules, and presigned URLs." },
          { title: "RDS and Aurora",            description: "Managed relational databases, read replicas, backups." },
          { title: "DynamoDB Fundamentals",     description: "NoSQL on AWS, partition keys, and on-demand capacity." },
        ],
      },
      {
        sectionName: "Serverless and Containers",
        subSections: [
          { title: "AWS Lambda from Scratch",         description: "Functions, triggers, environment variables, and cold starts." },
          { title: "API Gateway + Lambda",            description: "Building fully serverless REST APIs." },
          { title: "ECS and Docker on AWS",           description: "Running containers with Fargate — no EC2 needed." },
        ],
      },
      {
        sectionName: "Architecture and Cost Optimisation",
        subSections: [
          { title: "Well-Architected Framework",      description: "5 pillars: operational excellence, security, reliability, performance, cost." },
          { title: "CloudFormation and IaC",          description: "Writing YAML templates to provision infrastructure." },
          { title: "Cost Explorer and Savings Plans", description: "Monitoring spend and reducing your AWS bill." },
        ],
      },
    ],
  },
  {
    courseName: "Ethical Hacking and Penetration Testing",
    courseDescription:
      "Learn offensive and defensive cybersecurity techniques. Covers reconnaissance, exploitation, privilege escalation, web app attacks, and report writing.",
    whatYouWillLearn:
      "Perform penetration tests legally. Use Kali Linux, Nmap, Metasploit, Burp Suite. Understand OWASP Top 10. Write professional pentest reports.",
    price: 2999,
    tag: ["cybersecurity", "ethical hacking", "penetration testing", "kali linux"],
    instructions: [
      "Basic networking (TCP/IP) knowledge required",
      "Only test systems you own or have written permission for",
    ],
    categoryName: "Cybersecurity",
    sections: [
      {
        sectionName: "Foundations of Ethical Hacking",
        subSections: [
          { title: "Legal and Ethical Framework",       description: "CEH, OSCP, bug bounty scope, and responsible disclosure." },
          { title: "Kali Linux Setup and Essentials",   description: "Installing Kali, essential tools, and terminal basics." },
          { title: "Networking for Hackers",            description: "TCP/IP, DNS, HTTP, and Wireshark packet analysis." },
        ],
      },
      {
        sectionName: "Reconnaissance and Scanning",
        subSections: [
          { title: "Passive Reconnaissance — OSINT",    description: "Google dorks, Shodan, theHarvester, Maltego." },
          { title: "Nmap — Port Scanning Mastery",      description: "Service detection, OS fingerprinting, NSE scripts." },
          { title: "Enumeration Techniques",            description: "SMB, SNMP, LDAP enumeration and banner grabbing." },
        ],
      },
      {
        sectionName: "Exploitation",
        subSections: [
          { title: "Metasploit Framework",              description: "Searching exploits, running payloads, meterpreter." },
          { title: "Password Attacks",                  description: "Hydra, Hashcat, credential stuffing, pass-the-hash." },
          { title: "Privilege Escalation — Linux",      description: "SUID binaries, cron jobs, kernel exploits." },
          { title: "Privilege Escalation — Windows",    description: "Unquoted service paths, registry exploits, mimikatz." },
        ],
      },
      {
        sectionName: "Web Application Testing",
        subSections: [
          { title: "Burp Suite Fundamentals",           description: "Proxy, scanner, intruder, repeater." },
          { title: "OWASP Top 10 in Practice",          description: "SQLi, XSS, IDOR, SSRF — finding and exploiting each." },
          { title: "Writing a Pentest Report",          description: "Executive summary, findings, CVSS scores, remediation." },
        ],
      },
    ],
  },
  {
    courseName: "Git & GitHub — Complete Beginner to Pro (Free)",
    courseDescription:
      "A completely free course that takes you from zero to confident with Git and GitHub. Learn version control, branching, merging, pull requests, and how professional teams collaborate on code.",
    whatYouWillLearn:
      "Track and manage code changes with Git. Work with remote repositories on GitHub. Collaborate via pull requests and code reviews. Recover from mistakes using resets and reverts.",
    price: 0,
    tag: ["git", "github", "version control", "free", "beginner"],
    instructions: [
      "No prior programming experience needed",
      "Install Git (free download at git-scm.com) before starting",
      "Create a free GitHub account",
    ],
    categoryName: "Web Development",
    sections: [
      {
        sectionName: "Getting Started with Git",
        subSections: [
          { title: "What is Version Control and Why It Matters", description: "Understanding the problem Git solves, brief history, and core concepts." },
          { title: "Installing Git and First-Time Setup",         description: "Installing on Windows/Mac/Linux and configuring your name and email." },
          { title: "Your First Repository — git init",            description: "Creating a local repo, staging files, and making your first commit." },
        ],
      },
      {
        sectionName: "Core Git Workflow",
        subSections: [
          { title: "The Three Areas — Working, Staging, Repository", description: "How Git tracks changes across the working directory, index, and commit history." },
          { title: "git add, commit, status, log",                   description: "The everyday commands you will use in every project." },
          { title: "Undoing Changes — reset, revert, restore",       description: "Safely undoing mistakes at every stage without losing work." },
          { title: ".gitignore — Ignoring Files",                    description: "Keeping secrets, build artifacts, and IDE files out of your repo." },
        ],
      },
      {
        sectionName: "Branching and Merging",
        subSections: [
          { title: "What is a Branch and Why Use One",  description: "Mental model of branches, HEAD pointer, and detached HEAD state." },
          { title: "Creating, Switching, and Deleting Branches", description: "git branch, git checkout, git switch — modern syntax." },
          { title: "Merging Branches — Fast-forward vs 3-way", description: "How Git combines work and when merge commits are created." },
          { title: "Resolving Merge Conflicts",         description: "Reading conflict markers, picking changes, and completing the merge." },
          { title: "Rebasing for a Clean History",      description: "When to rebase vs merge, interactive rebase to squash commits." },
        ],
      },
      {
        sectionName: "GitHub — Remote Collaboration",
        subSections: [
          { title: "Connecting Local to Remote — git remote, push, pull", description: "Linking your local repo to GitHub and syncing changes." },
          { title: "Forking and Cloning Open-Source Repos",               description: "How to contribute to projects you don't own." },
          { title: "Pull Requests and Code Reviews",                       description: "Opening a PR, requesting reviewers, addressing feedback, merging." },
          { title: "GitHub Issues and Project Boards",                     description: "Tracking bugs and features using GitHub's built-in project tools." },
          { title: "GitHub Actions — Intro to CI/CD",                      description: "Automating tests and deploys with a simple workflow file." },
        ],
      },
    ],
  },
]

// ─── Fake instructor/student identity pools ───────────────────────────────────

const INSTRUCTORS = [
  { firstName: "Aryan",   lastName: "Mehta",    gender: "Male",   about: "Full-stack developer with 8 years of industry experience. Passionate about teaching." },
  { firstName: "Priya",   lastName: "Sharma",   gender: "Female", about: "Data scientist at a Fortune 500 company. I love making complex topics simple." },
  { firstName: "Rohan",   lastName: "Verma",    gender: "Male",   about: "Cloud architect and AWS certified solutions architect. 10+ years in DevOps." },
  { firstName: "Sneha",   lastName: "Iyer",     gender: "Female", about: "Mobile developer specialising in Flutter and React Native. 50+ apps shipped." },
  { firstName: "Karan",   lastName: "Gupta",    gender: "Male",   about: "Cybersecurity researcher and certified ethical hacker (CEH, OSCP)." },
  { firstName: "Divya",   lastName: "Pillai",   gender: "Female", about: "UI/UX designer with a decade of experience at top product companies." },
  { firstName: "Nikhil",  lastName: "Bajaj",    gender: "Male",   about: "Backend engineer and open-source contributor. Loves databases and distributed systems." },
  { firstName: "Ishita",  lastName: "Agarwal",  gender: "Female", about: "ML engineer working on NLP and computer vision. PhD from IIT Delhi." },
]

const STUDENTS = [
  { firstName: "Aditya",  lastName: "Singh",    gender: "Male" },
  { firstName: "Neha",    lastName: "Patel",    gender: "Female" },
  { firstName: "Rahul",   lastName: "Kumar",    gender: "Male" },
  { firstName: "Pooja",   lastName: "Nair",     gender: "Female" },
  { firstName: "Vikram",  lastName: "Joshi",    gender: "Male" },
  { firstName: "Ananya",  lastName: "Reddy",    gender: "Female" },
  { firstName: "Suraj",   lastName: "Mishra",   gender: "Male" },
  { firstName: "Kavya",   lastName: "Bose",     gender: "Female" },
  { firstName: "Manish",  lastName: "Dubey",    gender: "Male" },
  { firstName: "Ritika",  lastName: "Chopra",   gender: "Female" },
]

// Thumbnail placeholder service — gives a different colourful image per seed tag
const THUMBNAIL_COLORS = ["1a1a2e", "16213e", "0f3460", "533483", "2c3e50", "1e3a5f", "2d4059", "1b262c"]
function generateThumbnailUrl(index) {
  const color = THUMBNAIL_COLORS[index % THUMBNAIL_COLORS.length]
  // Uses a reliable placeholder image service
  return `https://via.placeholder.com/800x450/${color}/ffffff?text=Course+${index + 1}`
}

// ═════════════════════════════════════════════════════════════════════════════
//   HELPERS
// ═════════════════════════════════════════════════════════════════════════════

function log(msg)  { console.log(`  ✓  ${msg}`) }
function warn(msg) { console.log(`  ⚠  ${msg}`) }
function head(msg) { console.log(`\n──── ${msg} ────`) }

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URL)
  log("Connected to MongoDB")
}

function connectCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:    process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  })
  log("Cloudinary configured")
}

/** Upload a local file or a remote URL to Cloudinary */
async function uploadToCloudinary(source, resourceType = "auto") {
  try {
    const result = await cloudinary.uploader.upload(source, {
      folder:        process.env.FOLDER_NAME || "studynotion_seed",
      resource_type: resourceType,
    })
    return result.secure_url
  } catch (err) {
    warn(`Cloudinary upload failed for ${source}: ${err.message}`)
    return CONFIG.fallbackVideoUrl
  }
}

/** Pick a video URL — cycles through local files, falls back to online sample */
function makeVideoPool() {
  const valid = (CONFIG.videoPaths || []).filter((p) => {
    if (!fs.existsSync(p)) { warn(`Video file not found, skipping: ${p}`); return false }
    return true
  })

  if (valid.length === 0) {
    warn("No local video files configured — using fallback sample video for all lectures.")
    return null // signal to use fallback URL directly
  }
  return valid
}

/** Hash a password */
async function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

// ═════════════════════════════════════════════════════════════════════════════
//   SEED FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

async function seedCategories() {
  head("Categories")
  const created = []
  for (const cat of CATEGORIES) {
    let existing = await Category.findOne({ name: cat.name })
    if (existing) {
      log(`Category already exists: ${cat.name}`)
      created.push(existing)
    } else {
      const newCat = await Category.create(cat)
      log(`Created category: ${cat.name}`)
      created.push(newCat)
    }
  }
  return created
}

async function seedUser(data, accountType) {
  const email = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@studynotion.fake`
  const existing = await User.findOne({ email })
  if (existing) {
    log(`User already exists: ${email}`)
    return existing
  }

  const profile = await Profile.create({
    gender:      data.gender,
    dateOfBirth: "1995-01-01",
    about:       data.about || `${accountType} on StudyNotion`,
    contactNumber: 9000000000 + Math.floor(Math.random() * 999999),
  })

  const user = await User.create({
    firstName:        data.firstName,
    lastName:         data.lastName,
    email,
    password:         await hashPassword(CONFIG.defaultPassword),
    accountType,
    active:           true,
    approved:         true,
    additionalDetails: profile._id,
    image: `https://api.dicebear.com/7.x/initials/svg?seed=${data.firstName}${data.lastName}`,
  })

  log(`Created ${accountType}: ${user.firstName} ${user.lastName} (${email})`)
  return user
}

async function seedInstructors() {
  head("Instructors")
  const pool = INSTRUCTORS.slice(0, CONFIG.instructorCount)
  return Promise.all(pool.map((d) => seedUser(d, "Instructor")))
}

async function seedStudents() {
  head("Students")
  const pool = STUDENTS.slice(0, CONFIG.studentCount)
  return Promise.all(pool.map((d) => seedUser(d, "Student")))
}

async function seedCourse(instructor, courseDef, category, videoPool, courseIndex) {
  // Check if course already exists for this instructor
  const existing = await Course.findOne({ courseName: courseDef.courseName, instructor: instructor._id })
  if (existing) {
    log(`Course already exists: "${courseDef.courseName}"`)
    return existing
  }

  // ── Thumbnail ─────────────────────────────────────────────────────────────
  let thumbnailUrl
  if (CONFIG.thumbnailPaths && CONFIG.thumbnailPaths[courseIndex]) {
    thumbnailUrl = await uploadToCloudinary(CONFIG.thumbnailPaths[courseIndex], "image")
  } else {
    // Upload a placeholder colour image from the web
    thumbnailUrl = await uploadToCloudinary(generateThumbnailUrl(courseIndex), "image")
  }

  // ── Create the course shell ───────────────────────────────────────────────
  const course = await Course.create({
    courseName:       courseDef.courseName,
    courseDescription: courseDef.courseDescription,
    instructor:        instructor._id,
    whatYouWillLearn: courseDef.whatYouWillLearn,
    price:            courseDef.price,
    tag:              courseDef.tag,
    category:         category._id,
    thumbnail:        thumbnailUrl,
    status:           "Published",
    instructions:     courseDef.instructions,
  })

  // ── Add course to instructor's profile ────────────────────────────────────
  await User.findByIdAndUpdate(instructor._id, { $push: { courses: course._id } })
  await Category.findByIdAndUpdate(category._id, { $push: { courses: course._id } })

  // ── Sections and SubSections ─────────────────────────────────────────────
  let lectureCounter = 0
  for (const secDef of courseDef.sections) {
    const section = await Section.create({ sectionName: secDef.sectionName })

    for (const subDef of secDef.subSections) {
      // Decide which video to use
      let videoUrl
      if (videoPool === null) {
        videoUrl = CONFIG.fallbackVideoUrl
      } else {
        const localPath = videoPool[lectureCounter % videoPool.length]
        videoUrl = await uploadToCloudinary(localPath, "video")
      }
      lectureCounter++

      const subSection = await SubSection.create({
        title:        subDef.title,
        description:  subDef.description,
        timeDuration: "10:00",
        videoUrl,
      })

      section.subSection.push(subSection._id)
    }

    await section.save()
    course.courseContent.push(section._id)
  }

  await course.save()

  const totalLectures = courseDef.sections.reduce((n, s) => n + s.subSections.length, 0)
  log(`Created course: "${course.courseName}" — ${courseDef.sections.length} sections, ${totalLectures} lectures`)
  return course
}

async function seedCourses(instructors, categories) {
  head("Courses")

  const videoPool = makeVideoPool()

  // Shuffle the catalog so different instructors get varied courses
  const shuffled = [...COURSE_CATALOG].sort(() => Math.random() - 0.5)
  let catalogIndex = 0

  for (const instructor of instructors) {
    for (let i = 0; i < CONFIG.coursesPerInstructor; i++) {
      const courseDef = shuffled[catalogIndex % shuffled.length]
      catalogIndex++

      // Find matching category, fall back to first available
      const category =
        categories.find((c) => c.name === courseDef.categoryName) ?? categories[0]

      await seedCourse(instructor, courseDef, category, videoPool, catalogIndex - 1)
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//   RESET (--reset flag)
// ═════════════════════════════════════════════════════════════════════════════

async function resetSeedData() {
  head("Resetting seed data")

  // Only delete users whose email ends with @studynotion.fake
  const fakeUsers = await User.find({ email: /@studynotion\.fake$/ })
  const fakeUserIds = fakeUsers.map((u) => u._id)
  const fakeProfileIds = fakeUsers.map((u) => u.additionalDetails).filter(Boolean)

  // Delete their courses
  const fakeCourses = await Course.find({ instructor: { $in: fakeUserIds } })
  const fakeCourseIds = fakeCourses.map((c) => c._id)

  // Delete subsections and sections belonging to fake courses
  for (const course of fakeCourses) {
    const sections = await Section.find({ _id: { $in: course.courseContent } })
    for (const sec of sections) {
      await SubSection.deleteMany({ _id: { $in: sec.subSection } })
    }
    await Section.deleteMany({ _id: { $in: course.courseContent } })
  }

  await Course.deleteMany({ _id: { $in: fakeCourseIds } })
  log(`Deleted ${fakeCourseIds.length} courses`)

  // Remove course references from categories
  await Category.updateMany({}, { $pull: { courses: { $in: fakeCourseIds } } })

  await Profile.deleteMany({ _id: { $in: fakeProfileIds } })
  await User.deleteMany({ _id: { $in: fakeUserIds } })
  log(`Deleted ${fakeUserIds.length} users`)

  log("Reset complete")
}

// ═════════════════════════════════════════════════════════════════════════════
//   MAIN
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log("\n╔══════════════════════════════════════╗")
  console.log("║   StudyNotion — Database Seeder      ║")
  console.log("╚══════════════════════════════════════╝")

  await connectDB()
  connectCloudinary()

  const isReset = process.argv.includes("--reset")

  if (isReset) {
    await resetSeedData()
  } else {
    const categories  = await seedCategories()
    const instructors = await seedInstructors()
    /* const students = */ await seedStudents()
    await seedCourses(instructors, categories)

    head("Summary")
    console.log(`
  Instructors : ${CONFIG.instructorCount}
  Students    : ${CONFIG.studentCount}
  Courses     : ${CONFIG.instructorCount * CONFIG.coursesPerInstructor}
  Password    : ${CONFIG.defaultPassword}

  All fake emails end with @studynotion.fake
  Run with --reset to wipe these accounts and courses.
    `)
  }

  await mongoose.disconnect()
  console.log("\n  Done. Mongoose disconnected.\n")
}

main().catch((err) => {
  console.error("\n  SEEDER ERROR:", err)
  mongoose.disconnect()
  process.exit(1)
})
