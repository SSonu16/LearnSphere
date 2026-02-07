import { useState, useCallback } from 'react';
import { Enrollment, LessonProgress, EnrollmentStatus } from '@/types';
import { mockEnrollments } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export function useEnrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [isLoading, setIsLoading] = useState(false);

  const getUserEnrollments = useCallback(() => {
    if (!user) return [];
    return enrollments.filter(e => e.userId === user.id);
  }, [enrollments, user]);

  const getEnrollment = useCallback((courseId: string) => {
    if (!user) return null;
    return enrollments.find(e => e.courseId === courseId && e.userId === user.id);
  }, [enrollments, user]);

  const isEnrolled = useCallback((courseId: string) => {
    return !!getEnrollment(courseId);
  }, [getEnrollment]);

  const enrollInCourse = useCallback(async (courseId: string) => {
    if (!user) return null;
    
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEnrollment: Enrollment = {
        id: `enroll-${Date.now()}`,
        courseId,
        userId: user.id,
        status: 'enrolled',
        enrolledAt: new Date(),
        timeSpent: 0,
        completionPercentage: 0,
        lessonProgress: {},
      };
      
      setEnrollments(prev => [...prev, newEnrollment]);
      return newEnrollment;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const startCourse = useCallback(async (courseId: string) => {
    const enrollment = getEnrollment(courseId);
    if (!enrollment) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setEnrollments(prev => 
        prev.map(e => 
          e.id === enrollment.id 
            ? { ...e, status: 'in_progress' as EnrollmentStatus, startedAt: new Date() } 
            : e
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [getEnrollment]);

  const updateLessonProgress = useCallback(async (
    courseId: string, 
    lessonId: string, 
    progress: Partial<LessonProgress>
  ) => {
    const enrollment = getEnrollment(courseId);
    if (!enrollment) return;
    
    setEnrollments(prev => 
      prev.map(e => {
        if (e.id !== enrollment.id) return e;
        
        const currentProgress = e.lessonProgress[lessonId] || {
          lessonId,
          status: 'not_started',
          timeSpent: 0,
        };
        
        return {
          ...e,
          lessonProgress: {
            ...e.lessonProgress,
            [lessonId]: { ...currentProgress, ...progress },
          },
        };
      })
    );
  }, [getEnrollment]);

  const completeLesson = useCallback(async (courseId: string, lessonId: string) => {
    await updateLessonProgress(courseId, lessonId, {
      status: 'completed',
      completedAt: new Date(),
    });
  }, [updateLessonProgress]);

  const completeCourse = useCallback(async (courseId: string) => {
    const enrollment = getEnrollment(courseId);
    if (!enrollment) return;
    
    setEnrollments(prev => 
      prev.map(e => 
        e.id === enrollment.id 
          ? { 
              ...e, 
              status: 'completed' as EnrollmentStatus, 
              completedAt: new Date(),
              completionPercentage: 100,
            } 
          : e
      )
    );
  }, [getEnrollment]);

  return {
    enrollments,
    isLoading,
    getUserEnrollments,
    getEnrollment,
    isEnrolled,
    enrollInCourse,
    startCourse,
    updateLessonProgress,
    completeLesson,
    completeCourse,
  };
}
