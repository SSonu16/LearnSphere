import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  Play,
  FileText,
  Image as ImageIcon,
  HelpCircle,
  Download,
  Paperclip,
  ExternalLink,
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import { Button } from '@/components/ui/button';
import { ProgressBar, CircularProgress } from '@/components/ui/progress-bar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockLessons, mockQuizzes } from '@/data/mockData';
import { Lesson, Quiz, LessonType } from '@/types';
import { cn } from '@/lib/utils';

const lessonTypeIcons: Record<LessonType, React.ElementType> = {
  video: Play,
  document: FileText,
  image: ImageIcon,
  quiz: HelpCircle,
};

export function LessonPlayer() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { getCourseById } = useCourses();
  const { getEnrollment, completeLesson, completeCourse } = useEnrollments();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  const course = getCourseById(courseId!);
  const enrollment = getEnrollment(courseId!);
  const lessons = mockLessons.filter((l) => l.courseId === courseId);
  const currentLesson = lessons.find((l) => l.id === currentLessonId);
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  const currentQuiz = currentLesson?.quizId 
    ? mockQuizzes.find((q) => q.id === currentLesson.quizId) 
    : null;

  useEffect(() => {
    const lessonParam = searchParams.get('lesson');
    if (lessonParam && lessons.find((l) => l.id === lessonParam)) {
      setCurrentLessonId(lessonParam);
    } else if (lessons.length > 0) {
      // Find first incomplete lesson or start from beginning
      const firstIncomplete = lessons.find(
        (l) => enrollment?.lessonProgress[l.id]?.status !== 'completed'
      );
      setCurrentLessonId(firstIncomplete?.id || lessons[0].id);
    }
  }, [courseId, searchParams, lessons, enrollment]);

  if (!course || !enrollment) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Course not found or not enrolled</p>
      </div>
    );
  }

  const isLessonCompleted = (lessonId: string) => {
    return enrollment.lessonProgress[lessonId]?.status === 'completed';
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentLessonId(lessons[currentIndex - 1].id);
    }
  };

  const handleNext = async () => {
    if (currentLesson) {
      await completeLesson(courseId!, currentLesson.id);
    }
    
    if (currentIndex < lessons.length - 1) {
      setCurrentLessonId(lessons[currentIndex + 1].id);
    }
  };

  const handleCompleteCourse = async () => {
    if (currentLesson) {
      await completeLesson(courseId!, currentLesson.id);
    }
    await completeCourse(courseId!);
    navigate(`/courses/${courseId}`);
  };

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercentage = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lesson-sidebar fixed left-0 top-0 z-40 w-80 border-r border-sidebar-border lg:relative"
          >
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Course Info */}
            <div className="border-b border-sidebar-border p-4">
              <h2 className="font-semibold text-sidebar-foreground line-clamp-2">
                {course.title}
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <CircularProgress
                  value={progressPercentage}
                  size={48}
                  strokeWidth={4}
                  variant="accent"
                />
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {progressPercentage}% Complete
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">
                    {completedCount} of {lessons.length} lessons
                  </p>
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="p-2">
                {lessons.map((lesson, index) => {
                  const Icon = lessonTypeIcons[lesson.type];
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isCurrent = lesson.id === currentLessonId;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonId(lesson.id)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all',
                        isCurrent
                          ? 'bg-sidebar-accent text-sidebar-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          isCompleted
                            ? 'bg-success text-success-foreground'
                            : isCurrent
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'bg-sidebar-accent text-sidebar-foreground/60'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm font-medium truncate',
                            isCurrent && 'text-sidebar-foreground'
                          )}
                        >
                          {lesson.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-sidebar-foreground/60">
                          <Icon className="h-3 w-3" />
                          <span className="capitalize">{lesson.type}</span>
                          <span>•</span>
                          <span>{lesson.duration} min</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">
                Lesson {currentIndex + 1} of {lessons.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            {currentIndex === lessons.length - 1 ? (
              <Button variant="accent" size="sm" onClick={handleCompleteCourse}>
                Complete Course
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button variant="accent" size="sm" onClick={handleNext}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </header>

        {/* Lesson Content */}
        <main className="flex-1 overflow-auto">
          {currentLesson && (
            <div className="mx-auto max-w-4xl p-6 lg:p-8">
              {/* Lesson Title */}
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                  {currentLesson.title}
                </h1>
                <p className="mt-2 text-muted-foreground">{currentLesson.description}</p>

                {/* Content Area */}
                <div className="mt-6">
                  {currentLesson.type === 'video' && (
                    <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="mx-auto h-16 w-16 opacity-50" />
                          <p className="mt-4 text-lg">Video Player</p>
                          <p className="text-sm text-white/60">
                            {currentLesson.videoUrl || 'No video URL provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentLesson.type === 'document' && (
                    <div className="rounded-2xl border border-border bg-card p-8 text-center">
                      <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                      <p className="mt-4 text-lg font-medium">Document Viewer</p>
                      <p className="text-muted-foreground">
                        {currentLesson.documentUrl || 'No document provided'}
                      </p>
                      {currentLesson.allowDownload && (
                        <Button variant="outline" className="mt-4">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  )}

                  {currentLesson.type === 'image' && (
                    <div className="overflow-hidden rounded-2xl border border-border">
                      <div className="flex h-96 items-center justify-center bg-muted">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {currentLesson.type === 'quiz' && currentQuiz && (
                    <QuizPlayer quiz={currentQuiz} />
                  )}
                </div>

                {/* Attachments */}
                {currentLesson.attachments.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-3 font-semibold text-foreground">Attachments</h3>
                    <div className="space-y-2">
                      {currentLesson.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                        >
                          {attachment.type === 'file' ? (
                            <Paperclip className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ExternalLink className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className="flex-1 text-sm">{attachment.name}</span>
                          <Button variant="ghost" size="sm">
                            {attachment.type === 'file' ? 'Download' : 'Open'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Quiz Player Component
interface QuizPlayerProps {
  quiz: Quiz;
}

function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(1);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleComplete = () => {
    // Calculate score
    let correct = 0;
    quiz.questions.forEach((q) => {
      const selectedOptionId = selectedAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selectedOptionId === correctOption?.id) {
        correct++;
      }
    });

    setScore(correct);
    setIsCompleted(true);
  };

  const getPointsEarned = () => {
    switch (attemptNumber) {
      case 1:
        return quiz.rewards.firstAttempt;
      case 2:
        return quiz.rewards.secondAttempt;
      case 3:
        return quiz.rewards.thirdAttempt;
      default:
        return quiz.rewards.fourthPlusAttempt;
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-8 text-center"
      >
        <div className="mx-auto h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-success" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-card-foreground">Quiz Completed!</h2>
        <p className="mt-2 text-muted-foreground">
          You scored {score} out of {totalQuestions}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
          <span className="text-2xl font-bold text-accent">+{getPointsEarned()}</span>
          <span className="text-accent">points earned</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Attempt #{attemptNumber}</p>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <ProgressBar
          value={((currentQuestionIndex + 1) / totalQuestions) * 100}
          size="sm"
          className="w-32"
        />
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h3 className="text-lg font-semibold text-card-foreground">
          {currentQuestion.text}
        </h3>

        {/* Options */}
        <div className="mt-4 space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswers[currentQuestion.id] === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={cn(
                  'quiz-option w-full text-left',
                  isSelected && 'selected'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border'
                    )}
                  >
                    {isSelected && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span>{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="mt-6 flex justify-end">
        {currentQuestionIndex < totalQuestions - 1 ? (
          <Button
            variant="accent"
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Next Question
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="accent"
            onClick={handleComplete}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Complete Quiz
            <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
