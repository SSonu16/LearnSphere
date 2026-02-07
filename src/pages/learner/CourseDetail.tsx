import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Clock,
  BookOpen,
  Star,
  Users,
  CheckCircle,
  Lock,
  Search,
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockLessons, mockReviews } from '@/data/mockData';
import { Lesson, LessonStatus } from '@/types';
import { cn } from '@/lib/utils';

export function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useCourses();
  const { isEnrolled, enrollInCourse, getEnrollment, startCourse } = useEnrollments();
  const { isAuthenticated, user } = useAuth();

  const [lessonSearch, setLessonSearch] = useState('');

  const course = getCourseById(courseId!);
  const enrollment = getEnrollment(courseId!);
  const lessons = mockLessons.filter((l) => l.courseId === courseId);
  const reviews = mockReviews.filter((r) => r.courseId === courseId);

  if (!course) {
    return (
      <MainLayout>
        <div className="container flex h-96 items-center justify-center">
          <p className="text-muted-foreground">Course not found</p>
        </div>
      </MainLayout>
    );
  }

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(lessonSearch.toLowerCase())
  );

  const getLessonStatus = (lessonId: string): LessonStatus => {
    if (!enrollment) return 'not_started';
    return enrollment.lessonProgress[lessonId]?.status || 'not_started';
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await enrollInCourse(course.id);
  };

  const handleStartCourse = async () => {
    if (enrollment?.status === 'enrolled') {
      await startCourse(course.id);
    }
    navigate(`/learn/${course.id}`);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-12 md:py-16">
        <div className="container">
          <Button
            variant="glass"
            size="sm"
            className="mb-6"
            onClick={() => navigate('/courses')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/10 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              <p className="mt-4 text-lg text-white/80">
                {course.shortDescription || course.description}
              </p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="font-medium text-white">{course.rating.toFixed(1)}</span>
                  <span>({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.enrolledCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="mt-6 flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-white/60">Created by</p>
                  <p className="font-medium text-white">{course.adminName}</p>
                </div>
              </div>
            </motion.div>

            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-card p-6 shadow-xl"
            >
              {course.image && (
                <div className="mb-4 aspect-video overflow-hidden rounded-xl">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Progress (if enrolled) */}
              {enrollment && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Your Progress</span>
                    <span className="font-medium">{enrollment.completionPercentage}%</span>
                  </div>
                  <ProgressBar
                    value={enrollment.completionPercentage}
                    variant="accent"
                    className="mt-2"
                  />
                </div>
              )}

              {/* Price */}
              {course.accessRule === 'payment' && course.price && !enrollment && (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-card-foreground">
                    ${course.price}
                  </span>
                </div>
              )}

              {/* Action Button */}
              {!isAuthenticated ? (
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Log in to Enroll
                </Button>
              ) : !enrollment ? (
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={handleEnroll}
                >
                  {course.accessRule === 'payment' ? 'Buy Now' : 'Enroll for Free'}
                </Button>
              ) : enrollment.completionPercentage === 0 ? (
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={handleStartCourse}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Course
                </Button>
              ) : enrollment.completionPercentage === 100 ? (
                <Button
                  variant="success"
                  size="lg"
                  className="w-full"
                  onClick={handleStartCourse}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Review Course
                </Button>
              ) : (
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  onClick={handleStartCourse}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Continue Learning
                </Button>
              )}

              {/* Course includes */}
              <div className="mt-6 space-y-3 text-sm">
                <p className="font-medium text-card-foreground">This course includes:</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {course.totalLessons} lessons
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatDuration(course.totalDuration)} of content
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Certificate of completion
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="lessons">
            <TabsList className="mb-6">
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            {/* Lessons Tab */}
            <TabsContent value="lessons">
              <div className="mb-4">
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search lessons..."
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {filteredLessons.map((lesson, index) => {
                  const status = getLessonStatus(lesson.id);
                  const isLocked = !enrollment && course.accessRule !== 'open' && index > 0;

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={cn(
                        'flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all',
                        !isLocked && 'cursor-pointer hover:shadow-md',
                        isLocked && 'opacity-60'
                      )}
                      onClick={() => !isLocked && enrollment && navigate(`/learn/${course.id}?lesson=${lesson.id}`)}
                    >
                      {/* Status Icon */}
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                          status === 'completed' && 'bg-success/10 text-success',
                          status === 'in_progress' && 'bg-warning/10 text-warning',
                          status === 'not_started' && !isLocked && 'bg-muted text-muted-foreground',
                          isLocked && 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isLocked ? (
                          <Lock className="h-4 w-4" />
                        ) : status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">
                          {lesson.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {lesson.type}
                          </Badge>
                          <span>{formatDuration(lesson.duration)}</span>
                        </div>
                      </div>

                      {/* Play button */}
                      {!isLocked && (
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Description Tab */}
            <TabsContent value="description">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground">{course.description}</p>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              {/* Rating Summary */}
              <div className="mb-8 flex items-center gap-8 rounded-2xl border border-border bg-card p-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-card-foreground">
                    {averageRating.toFixed(1)}
                  </p>
                  <div className="mt-2 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-5 w-5',
                          i < Math.floor(averageRating)
                            ? 'fill-warning text-warning'
                            : 'text-muted'
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {reviews.length} reviews
                  </p>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.userAvatar} />
                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-card-foreground">
                            {review.userName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-1 flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-4 w-4',
                                i < review.rating
                                  ? 'fill-warning text-warning'
                                  : 'text-muted'
                              )}
                            />
                          ))}
                        </div>
                        <p className="mt-3 text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Review */}
                {enrollment && enrollment.completionPercentage > 0 && (
                  <div className="rounded-xl border-2 border-dashed border-border p-6 text-center">
                    <p className="text-muted-foreground">Share your experience</p>
                    <Button variant="outline" className="mt-3">
                      Write a Review
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
}
