import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Trophy, Sparkles } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import { UserPoints, BadgeList } from '@/components/gamification/UserBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeLevel, BADGE_THRESHOLDS } from '@/types';

export function MyCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const navigate = useNavigate();
  const { getCourseById } = useCourses();
  const { getUserEnrollments, getEnrollment, startCourse } = useEnrollments();
  const { user } = useAuth();

  const enrollments = getUserEnrollments();

  const getCoursesWithProgress = () => {
    return enrollments
      .map((enrollment) => {
        const course = getCourseById(enrollment.courseId);
        if (!course) return null;
        return {
          course,
          progress: enrollment.completionPercentage,
          enrollmentStatus: enrollment.status,
        };
      })
      .filter(Boolean) as { course: ReturnType<typeof getCourseById>; progress: number; enrollmentStatus: string }[];
  };

  const coursesWithProgress = getCoursesWithProgress();

  const filteredCourses = coursesWithProgress
    .filter((item) => {
      if (!item) return false;
      const matchesSearch = item.course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'in_progress' && item.enrollmentStatus === 'in_progress') ||
        (activeTab === 'completed' && item.enrollmentStatus === 'completed') ||
        (activeTab === 'not_started' && item.enrollmentStatus === 'enrolled');
      return matchesSearch && matchesTab;
    });

  const getActionLabel = (courseId: string) => {
    const enrollment = getEnrollment(courseId);
    if (!enrollment) return 'Join';
    if (enrollment.completionPercentage === 0) return 'Start';
    if (enrollment.completionPercentage === 100) return 'Review';
    return 'Continue';
  };

  const handleCourseAction = async (courseId: string) => {
    const enrollment = getEnrollment(courseId);
    if (enrollment?.status === 'enrolled') {
      await startCourse(courseId);
    }
    navigate(`/learn/${courseId}`);
  };

  const getCurrentBadge = (): BadgeLevel => {
    const points = user?.points || 0;
    const levels = Object.entries(BADGE_THRESHOLDS) as [BadgeLevel, number][];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i][1]) {
        return levels[i][0];
      }
    }
    return 'Newbie';
  };

  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">My Learning</h1>
              <p className="mt-1 text-muted-foreground">
                Track your progress and continue learning
              </p>
            </div>

            {/* Search & Tabs */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search your courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="not_started">Not Started</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredCourses.map((item, index) => (
                  <motion.div
                    key={item.course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CourseCard
                      course={item.course}
                      showProgress
                      progress={item.progress}
                      actionLabel={getActionLabel(item.course.id)}
                      onAction={() => handleCourseAction(item.course.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border">
                <Trophy className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">
                  {enrollments.length === 0 ? "You haven't enrolled in any courses yet" : 'No courses match your filter'}
                </p>
                <Button
                  variant="accent"
                  className="mt-4"
                  onClick={() => navigate('/courses')}
                >
                  Browse Courses
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Profile & Gamification */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-primary">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary-foreground">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Points & Badge Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <UserPoints
                points={user?.points || 0}
                currentBadge={getCurrentBadge()}
              />
            </motion.div>

            {/* All Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-card-foreground">Badge Collection</h3>
              </div>
              <BadgeList
                currentPoints={user?.points || 0}
                earnedBadges={user?.badges?.map((b) => b.name) || []}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
