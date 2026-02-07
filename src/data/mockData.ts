import { 
  User, 
  Course, 
  Lesson, 
  Quiz, 
  Review, 
  Enrollment,
  Badge,
  QuizAttempt,
  ParticipantReport 
} from '@/types';

// ========================
// MOCK USERS
// ========================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@learnsphere.com',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'admin',
    points: 150,
    badges: [
      { id: 'badge-1', name: 'Master', earnedAt: new Date('2024-01-15'), points: 120 },
    ],
    enrolledCourses: [],
    createdAt: new Date('2023-06-01'),
  },
  {
    id: 'user-2',
    email: 'instructor@learnsphere.com',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: 'instructor',
    points: 85,
    badges: [
      { id: 'badge-2', name: 'Specialist', earnedAt: new Date('2024-02-10'), points: 80 },
    ],
    enrolledCourses: [],
    createdAt: new Date('2023-07-15'),
  },
  {
    id: 'user-3',
    email: 'learner@learnsphere.com',
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: 'learner',
    points: 45,
    badges: [
      { id: 'badge-3', name: 'Achiever', earnedAt: new Date('2024-03-05'), points: 60 },
    ],
    enrolledCourses: ['course-1', 'course-2', 'course-3'],
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'user-4',
    email: 'alex@example.com',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    role: 'learner',
    points: 25,
    badges: [
      { id: 'badge-4', name: 'Newbie', earnedAt: new Date('2024-03-20'), points: 20 },
    ],
    enrolledCourses: ['course-1'],
    createdAt: new Date('2024-02-20'),
  },
];

// ========================
// MOCK COURSES
// ========================

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Complete React Masterclass',
    description: 'Master React from the ground up with this comprehensive course. Learn hooks, state management, routing, and build real-world applications.',
    shortDescription: 'Master React with hooks, state management, and real projects',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    status: 'published',
    visibility: 'everyone',
    accessRule: 'open',
    adminId: 'user-2',
    adminName: 'Michael Chen',
    views: 1250,
    totalLessons: 12,
    totalDuration: 480,
    rating: 4.8,
    reviewCount: 156,
    enrolledCount: 892,
    lessons: [],
    quizzes: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
    website: 'https://learnsphere.com/react-masterclass',
  },
  {
    id: 'course-2',
    title: 'Advanced TypeScript Patterns',
    description: 'Take your TypeScript skills to the next level. Learn advanced types, generics, decorators, and enterprise-level patterns.',
    shortDescription: 'Advanced TypeScript patterns for enterprise development',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop',
    tags: ['TypeScript', 'JavaScript', 'Advanced', 'Patterns'],
    status: 'published',
    visibility: 'signed_in',
    accessRule: 'invitation',
    adminId: 'user-2',
    adminName: 'Michael Chen',
    views: 856,
    totalLessons: 8,
    totalDuration: 320,
    rating: 4.9,
    reviewCount: 89,
    enrolledCount: 445,
    lessons: [],
    quizzes: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-15'),
    website: 'https://learnsphere.com/typescript-patterns',
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of great design. From wireframing to prototyping, master the tools and techniques used by professional designers.',
    shortDescription: 'Master design principles, wireframing, and prototyping',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
    tags: ['Design', 'UI/UX', 'Figma', 'Creative'],
    status: 'published',
    visibility: 'everyone',
    accessRule: 'payment',
    price: 49.99,
    adminId: 'user-1',
    adminName: 'Sarah Johnson',
    views: 2100,
    totalLessons: 15,
    totalDuration: 600,
    rating: 4.7,
    reviewCount: 234,
    enrolledCount: 1256,
    lessons: [],
    quizzes: [],
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-03-01'),
    website: 'https://learnsphere.com/uiux-fundamentals',
  },
  {
    id: 'course-4',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js. Learn Express, databases, authentication, and deployment strategies.',
    shortDescription: 'Build scalable backends with Node.js and Express',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop',
    tags: ['Node.js', 'Backend', 'Express', 'API'],
    status: 'draft',
    visibility: 'everyone',
    accessRule: 'open',
    adminId: 'user-2',
    adminName: 'Michael Chen',
    views: 0,
    totalLessons: 10,
    totalDuration: 400,
    rating: 0,
    reviewCount: 0,
    enrolledCount: 0,
    lessons: [],
    quizzes: [],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: 'course-5',
    title: 'Data Science with Python',
    description: 'Explore the world of data science using Python. Learn pandas, numpy, matplotlib, and machine learning basics.',
    shortDescription: 'Data science fundamentals with Python',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
    tags: ['Python', 'Data Science', 'Machine Learning', 'Analytics'],
    status: 'published',
    visibility: 'everyone',
    accessRule: 'open',
    adminId: 'user-1',
    adminName: 'Sarah Johnson',
    views: 3400,
    totalLessons: 20,
    totalDuration: 800,
    rating: 4.6,
    reviewCount: 312,
    enrolledCount: 2034,
    lessons: [],
    quizzes: [],
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2024-02-28'),
    website: 'https://learnsphere.com/data-science-python',
  },
];

// ========================
// MOCK LESSONS
// ========================

export const mockLessons: Lesson[] = [
  // React Masterclass Lessons
  {
    id: 'lesson-1-1',
    courseId: 'course-1',
    title: 'Introduction to React',
    description: 'Learn what React is, its core concepts, and why it has become one of the most popular frontend libraries.',
    type: 'video',
    order: 1,
    duration: 25,
    videoUrl: 'https://example.com/videos/intro-to-react.mp4',
    allowDownload: false,
    responsibleId: 'user-2',
    responsibleName: 'Michael Chen',
    attachments: [
      { id: 'att-1', name: 'Course Slides.pdf', url: '/files/slides.pdf', type: 'file', size: 2500000 },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'lesson-1-2',
    courseId: 'course-1',
    title: 'Setting Up Your Development Environment',
    description: 'Configure your development environment with Node.js, npm, and create your first React application.',
    type: 'video',
    order: 2,
    duration: 30,
    videoUrl: 'https://example.com/videos/setup-dev.mp4',
    allowDownload: false,
    responsibleId: 'user-2',
    responsibleName: 'Michael Chen',
    attachments: [
      { id: 'att-2', name: 'Setup Guide', url: 'https://reactjs.org/docs/getting-started.html', type: 'link' },
    ],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 'lesson-1-3',
    courseId: 'course-1',
    title: 'Understanding JSX',
    description: 'Deep dive into JSX syntax, expressions, and how React renders components.',
    type: 'video',
    order: 3,
    duration: 35,
    videoUrl: 'https://example.com/videos/jsx.mp4',
    allowDownload: true,
    responsibleId: 'user-2',
    responsibleName: 'Michael Chen',
    attachments: [],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'lesson-1-4',
    courseId: 'course-1',
    title: 'React Component Architecture',
    description: 'Learn about functional and class components, props, and component composition patterns.',
    type: 'document',
    order: 4,
    duration: 40,
    documentUrl: '/docs/component-architecture.pdf',
    allowDownload: true,
    responsibleId: 'user-2',
    responsibleName: 'Michael Chen',
    attachments: [],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'lesson-1-5',
    courseId: 'course-1',
    title: 'State and Lifecycle',
    description: 'Master useState and useEffect hooks for managing component state and side effects.',
    type: 'video',
    order: 5,
    duration: 45,
    videoUrl: 'https://example.com/videos/state-lifecycle.mp4',
    allowDownload: false,
    responsibleId: 'user-2',
    responsibleName: 'Michael Chen',
    attachments: [],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: 'lesson-1-6',
    courseId: 'course-1',
    title: 'Module 1 Quiz',
    description: 'Test your understanding of React fundamentals.',
    type: 'quiz',
    order: 6,
    duration: 15,
    quizId: 'quiz-1',
    allowDownload: false,
    responsibleId: 'user-2',
    responsibleName: 'Michael Chen',
    attachments: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

// ========================
// MOCK QUIZZES
// ========================

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    courseId: 'course-1',
    lessonId: 'lesson-1-6',
    title: 'React Fundamentals Quiz',
    questions: [
      {
        id: 'q-1',
        text: 'What is React?',
        options: [
          { id: 'opt-1-1', text: 'A backend framework', isCorrect: false },
          { id: 'opt-1-2', text: 'A JavaScript library for building user interfaces', isCorrect: true },
          { id: 'opt-1-3', text: 'A database management system', isCorrect: false },
          { id: 'opt-1-4', text: 'A CSS framework', isCorrect: false },
        ],
        order: 1,
      },
      {
        id: 'q-2',
        text: 'What is JSX?',
        options: [
          { id: 'opt-2-1', text: 'A JavaScript extension that allows writing HTML in JavaScript', isCorrect: true },
          { id: 'opt-2-2', text: 'A new programming language', isCorrect: false },
          { id: 'opt-2-3', text: 'A build tool', isCorrect: false },
          { id: 'opt-2-4', text: 'A testing framework', isCorrect: false },
        ],
        order: 2,
      },
      {
        id: 'q-3',
        text: 'Which hook is used for managing state in functional components?',
        options: [
          { id: 'opt-3-1', text: 'useEffect', isCorrect: false },
          { id: 'opt-3-2', text: 'useContext', isCorrect: false },
          { id: 'opt-3-3', text: 'useState', isCorrect: true },
          { id: 'opt-3-4', text: 'useReducer', isCorrect: false },
        ],
        order: 3,
      },
      {
        id: 'q-4',
        text: 'What is the virtual DOM?',
        options: [
          { id: 'opt-4-1', text: 'A copy of the real DOM that React uses for efficient updates', isCorrect: true },
          { id: 'opt-4-2', text: 'A new web standard', isCorrect: false },
          { id: 'opt-4-3', text: 'A browser extension', isCorrect: false },
          { id: 'opt-4-4', text: 'A debugging tool', isCorrect: false },
        ],
        order: 4,
      },
      {
        id: 'q-5',
        text: 'What is the correct way to pass data from parent to child components?',
        options: [
          { id: 'opt-5-1', text: 'Using global variables', isCorrect: false },
          { id: 'opt-5-2', text: 'Using props', isCorrect: true },
          { id: 'opt-5-3', text: 'Using localStorage', isCorrect: false },
          { id: 'opt-5-4', text: 'Using cookies', isCorrect: false },
        ],
        order: 5,
      },
    ],
    rewards: {
      firstAttempt: 50,
      secondAttempt: 30,
      thirdAttempt: 20,
      fourthPlusAttempt: 10,
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

// ========================
// MOCK REVIEWS
// ========================

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    courseId: 'course-1',
    userId: 'user-3',
    userName: 'Emily Davis',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Excellent course! The explanations are clear and the projects are practical. Highly recommend for anyone wanting to learn React.',
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'review-2',
    courseId: 'course-1',
    userId: 'user-4',
    userName: 'Alex Thompson',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 4,
    comment: 'Great content overall. Would love to see more advanced topics covered in future updates.',
    createdAt: new Date('2024-03-10'),
  },
];

// ========================
// MOCK ENROLLMENTS
// ========================

export const mockEnrollments: Enrollment[] = [
  {
    id: 'enroll-1',
    courseId: 'course-1',
    userId: 'user-3',
    status: 'in_progress',
    enrolledAt: new Date('2024-02-01'),
    startedAt: new Date('2024-02-05'),
    timeSpent: 120,
    completionPercentage: 65,
    lessonProgress: {
      'lesson-1-1': { lessonId: 'lesson-1-1', status: 'completed', startedAt: new Date('2024-02-05'), completedAt: new Date('2024-02-05'), timeSpent: 25 },
      'lesson-1-2': { lessonId: 'lesson-1-2', status: 'completed', startedAt: new Date('2024-02-06'), completedAt: new Date('2024-02-06'), timeSpent: 30 },
      'lesson-1-3': { lessonId: 'lesson-1-3', status: 'completed', startedAt: new Date('2024-02-07'), completedAt: new Date('2024-02-07'), timeSpent: 35 },
      'lesson-1-4': { lessonId: 'lesson-1-4', status: 'in_progress', startedAt: new Date('2024-02-08'), timeSpent: 20 },
    },
  },
  {
    id: 'enroll-2',
    courseId: 'course-2',
    userId: 'user-3',
    status: 'enrolled',
    enrolledAt: new Date('2024-03-01'),
    timeSpent: 0,
    completionPercentage: 0,
    lessonProgress: {},
  },
  {
    id: 'enroll-3',
    courseId: 'course-3',
    userId: 'user-3',
    status: 'completed',
    enrolledAt: new Date('2024-01-15'),
    startedAt: new Date('2024-01-16'),
    completedAt: new Date('2024-02-28'),
    timeSpent: 580,
    completionPercentage: 100,
    lessonProgress: {},
  },
  {
    id: 'enroll-4',
    courseId: 'course-1',
    userId: 'user-4',
    status: 'enrolled',
    enrolledAt: new Date('2024-03-15'),
    timeSpent: 0,
    completionPercentage: 0,
    lessonProgress: {},
  },
];

// ========================
// MOCK PARTICIPANT REPORTS
// ========================

export const mockParticipantReports: ParticipantReport[] = [
  {
    id: 'report-1',
    courseName: 'Complete React Masterclass',
    learnerName: 'Emily Davis',
    learnerEmail: 'emily@example.com',
    enrolledDate: new Date('2024-02-01'),
    startDate: new Date('2024-02-05'),
    timeSpent: 120,
    completionPercentage: 65,
    status: 'in_progress',
  },
  {
    id: 'report-2',
    courseName: 'Complete React Masterclass',
    learnerName: 'Alex Thompson',
    learnerEmail: 'alex@example.com',
    enrolledDate: new Date('2024-03-15'),
    timeSpent: 0,
    completionPercentage: 0,
    status: 'enrolled',
  },
  {
    id: 'report-3',
    courseName: 'UI/UX Design Fundamentals',
    learnerName: 'Emily Davis',
    learnerEmail: 'emily@example.com',
    enrolledDate: new Date('2024-01-15'),
    startDate: new Date('2024-01-16'),
    completedDate: new Date('2024-02-28'),
    timeSpent: 580,
    completionPercentage: 100,
    status: 'completed',
  },
];

// Attach lessons to courses
mockCourses[0].lessons = mockLessons.filter(l => l.courseId === 'course-1');
mockCourses[0].quizzes = mockQuizzes.filter(q => q.courseId === 'course-1');
