import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Eye,
  Clock,
  BookOpen,
  MoreHorizontal,
  Edit,
  Share2,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { Course, CourseStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type ViewMode = 'kanban' | 'list';

interface KanbanColumn {
  id: CourseStatus;
  title: string;
  courses: Course[];
}

export function InstructorDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { courses, createCourse, isLoading } = useCourses();

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const kanbanColumns: KanbanColumn[] = [
    { id: 'draft', title: 'Drafts', courses: filteredCourses.filter(c => c.status === 'draft') },
    { id: 'published', title: 'Published', courses: filteredCourses.filter(c => c.status === 'published') },
    { id: 'archived', title: 'Archived', courses: filteredCourses.filter(c => c.status === 'archived') },
  ];

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    const course = await createCourse(newCourseName);
    if (course) {
      navigate(`/instructor/courses/${course.id}/edit`);
    }
    setNewCourseName('');
    setIsCreateDialogOpen(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Courses</h1>
        <p className="mt-1 text-muted-foreground">Manage and organize your courses</p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-border p-1">
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="px-3"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Create Course Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Enter a name for your new course. You can add details later.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Course name"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCourse()}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="accent" onClick={handleCreateCourse} disabled={isLoading}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="kanban-column">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-foreground">{column.title}</h2>
                <Badge variant="secondary">{column.courses.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {column.courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CourseKanbanCard
                      course={course}
                      onEdit={() => navigate(`/instructor/courses/${course.id}/edit`)}
                      formatDuration={formatDuration}
                    />
                  </motion.div>
                ))}
                
                {column.courses.length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border">
                    <p className="text-sm text-muted-foreground">No courses</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <CourseListCard
                course={course}
                onEdit={() => navigate(`/instructor/courses/${course.id}/edit`)}
                formatDuration={formatDuration}
              />
            </motion.div>
          ))}
          
          {filteredCourses.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border">
              <BookOpen className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No courses found</p>
              <p className="text-sm text-muted-foreground">Create your first course to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  formatDuration: (minutes: number) => string;
}

function CourseKanbanCard({ course, onEdit, formatDuration }: CourseCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-lg">
      {/* Drag handle */}
      <div className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Image */}
      {course.image && (
        <div className="mb-3 aspect-video overflow-hidden rounded-lg">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground line-clamp-2">{course.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {course.views}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.totalLessons}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(course.totalDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}

function CourseListCard({ course, onEdit, formatDuration }: CourseCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-lg">
      {/* Image */}
      <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg">
        <img
          src={course.image || '/placeholder.svg'}
          alt={course.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-card-foreground truncate">{course.title}</h3>
          <Badge variant={course.status === 'published' ? 'published' : 'draft'}>
            {course.status}
          </Badge>
        </div>
        
        <div className="mt-1 flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {course.views} views
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {course.totalLessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(course.totalDuration)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
