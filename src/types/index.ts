// ========================
// USER & AUTH TYPES
// ========================

export type UserRole = 'admin' | 'instructor' | 'learner' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  points: number;
  badges: Badge[];
  enrolledCourses: string[];
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: BadgeLevel;
  earnedAt: Date;
  points: number;
}

export type BadgeLevel = 'Newbie' | 'Explorer' | 'Achiever' | 'Specialist' | 'Expert' | 'Master';

export const BADGE_THRESHOLDS: Record<BadgeLevel, number> = {
  Newbie: 20,
  Explorer: 40,
  Achiever: 60,
  Specialist: 80,
  Expert: 100,
  Master: 120,
};

// ========================
// COURSE TYPES
// ========================

export type CourseStatus = 'draft' | 'published' | 'archived';
export type CourseVisibility = 'everyone' | 'signed_in';
export type CourseAccessRule = 'open' | 'invitation' | 'payment';

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  image?: string;
  tags: string[];
  status: CourseStatus;
  visibility: CourseVisibility;
  accessRule: CourseAccessRule;
  price?: number;
  adminId: string;
  adminName: string;
  views: number;
  totalLessons: number;
  totalDuration: number; // in minutes
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  lessons: Lesson[];
  quizzes: Quiz[];
  createdAt: Date;
  updatedAt: Date;
  website?: string;
}

export interface CourseProgress {
  courseId: string;
  lessonId: string;
  lessonProgress: Record<string, LessonProgress>;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
  completionPercentage: number;
}

// ========================
// LESSON TYPES
// ========================

export type LessonType = 'video' | 'document' | 'image' | 'quiz';
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: LessonType;
  order: number;
  duration: number; // in minutes
  videoUrl?: string;
  documentUrl?: string;
  imageUrl?: string;
  quizId?: string;
  allowDownload: boolean;
  responsibleId?: string;
  responsibleName?: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'file' | 'link';
  size?: number;
}

// ========================
// QUIZ TYPES
// ========================

export interface Quiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  questions: QuizQuestion[];
  rewards: QuizRewards;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizRewards {
  firstAttempt: number;
  secondAttempt: number;
  thirdAttempt: number;
  fourthPlusAttempt: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  attemptNumber: number;
  answers: Record<string, string>; // questionId -> selectedOptionId
  score: number;
  pointsEarned: number;
  completedAt: Date;
}

// ========================
// REVIEW TYPES
// ========================

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// ========================
// ENROLLMENT TYPES
// ========================

export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed';

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number;
  completionPercentage: number;
  lessonProgress: Record<string, LessonProgress>;
}

// ========================
// REPORTING TYPES
// ========================

export interface ReportingStats {
  totalParticipants: number;
  yetToStart: number;
  inProgress: number;
  completed: number;
}

export interface ParticipantReport {
  id: string;
  courseName: string;
  learnerName: string;
  learnerEmail: string;
  enrolledDate: Date;
  startDate?: Date;
  timeSpent: number;
  completionPercentage: number;
  completedDate?: Date;
  status: EnrollmentStatus;
}

// ========================
// INVITATION TYPES
// ========================

export interface CourseInvitation {
  id: string;
  courseId: string;
  email: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}
