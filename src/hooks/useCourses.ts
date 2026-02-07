import { useState, useCallback } from 'react';
import { Course, CourseStatus } from '@/types';
import { mockCourses } from '@/data/mockData';

// API placeholder: Replace with actual API calls
// const API_BASE = '/api/courses';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(API_BASE);
      // const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 500));
      setCourses(mockCourses);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCourseById = useCallback((id: string) => {
    return courses.find(c => c.id === id);
  }, [courses]);

  const getPublishedCourses = useCallback(() => {
    return courses.filter(c => c.status === 'published');
  }, [courses]);

  const getCoursesByStatus = useCallback((status: CourseStatus) => {
    return courses.filter(c => c.status === status);
  }, [courses]);

  const createCourse = useCallback(async (title: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title,
        description: '',
        tags: [],
        status: 'draft',
        visibility: 'everyone',
        accessRule: 'open',
        adminId: 'user-1', // Current user
        adminName: 'Current User',
        views: 0,
        totalLessons: 0,
        totalDuration: 0,
        rating: 0,
        reviewCount: 0,
        enrolledCount: 0,
        lessons: [],
        quizzes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (id: string, updates: Partial<Course>) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCourses(prev => 
        prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c)
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setCourses(prev => prev.filter(c => c.id !== id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePublish = useCallback(async (id: string) => {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    
    const newStatus: CourseStatus = course.status === 'published' ? 'draft' : 'published';
    await updateCourse(id, { status: newStatus });
  }, [courses, updateCourse]);

  const searchCourses = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return courses.filter(c => 
      c.title.toLowerCase().includes(lowercaseQuery) ||
      c.tags.some(t => t.toLowerCase().includes(lowercaseQuery))
    );
  }, [courses]);

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    getCourseById,
    getPublishedCourses,
    getCoursesByStatus,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    searchCourses,
  };
}
