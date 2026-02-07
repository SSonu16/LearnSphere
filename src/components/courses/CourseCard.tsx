import { motion } from 'framer-motion';
import { Star, Eye, Clock, BookOpen, Users } from 'lucide-react';
import { Course } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact' | 'horizontal';
  showProgress?: boolean;
  progress?: number;
  actionLabel?: string;
  onAction?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  className?: string;
}

export function CourseCard({
  course,
  variant = 'default',
  showProgress = false,
  progress = 0,
  actionLabel = 'View Course',
  onAction,
  onEdit,
  onShare,
  className,
}: CourseCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  if (variant === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'group flex overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-lg',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-32 w-48 shrink-0 overflow-hidden">
          <img
            src={course.image || '/placeholder.svg'}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {course.status === 'published' && (
            <Badge variant="published" className="absolute left-2 top-2">
              Published
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>
            <h3 className="font-semibold text-card-foreground line-clamp-1">
              {course.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {course.shortDescription || course.description}
            </p>
          </div>
          
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.totalLessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(course.totalDuration)}
            </span>
            {course.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {course.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-2 border-l border-border p-4">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onShare && (
            <Button variant="ghost" size="sm" onClick={onShare}>
              Share
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-lg',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.image || '/placeholder.svg'}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Status badge */}
        {course.status === 'published' ? (
          <Badge variant="published" className="absolute left-3 top-3">
            Published
          </Badge>
        ) : (
          <Badge variant="draft" className="absolute left-3 top-3">
            Draft
          </Badge>
        )}
        
        {/* Price badge */}
        {course.accessRule === 'payment' && course.price && (
          <Badge variant="accent" className="absolute right-3 top-3">
            ${course.price}
          </Badge>
        )}
        
        {/* Stats overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-3 text-xs text-white">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {course.views}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {course.enrolledCount}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {course.shortDescription || course.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatDuration(course.totalDuration)}
          </span>
        </div>

        {/* Rating */}
        {course.rating > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.floor(course.rating)
                      ? 'fill-warning text-warning'
                      : 'text-muted'
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({course.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Progress */}
        {showProgress && (
          <div className="mt-4">
            <ProgressBar value={progress} variant="accent" size="sm" showLabel />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Button */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="accent"
            className="flex-1"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
          {onEdit && (
            <Button variant="outline" size="icon" onClick={onEdit}>
              <span className="sr-only">Edit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
