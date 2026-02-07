import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CourseCatalog } from "./pages/learner/CourseCatalog";
import { MyCourses } from "./pages/learner/MyCourses";
import { CourseDetail } from "./pages/learner/CourseDetail";
import { LessonPlayer } from "./pages/learner/LessonPlayer";
import { LoginPage } from "./pages/auth/LoginPage";

// Instructor Pages
import { InstructorLayout } from "./components/layout/InstructorLayout";
import { InstructorDashboard } from "./pages/instructor/InstructorDashboard";
import { CourseEditor } from "./pages/instructor/CourseEditor";
import { ReportsDashboard } from "./pages/instructor/ReportsDashboard";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/my-courses" replace />;
  }
  
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<CourseCatalog />} />
    <Route path="/courses" element={<CourseCatalog />} />
    <Route path="/courses/:courseId" element={<CourseDetail />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<LoginPage />} />
    
    {/* Protected Learner Routes */}
    <Route path="/my-courses" element={
      <ProtectedRoute>
        <MyCourses />
      </ProtectedRoute>
    } />
    <Route path="/learn/:courseId" element={
      <ProtectedRoute>
        <LessonPlayer />
      </ProtectedRoute>
    } />
    
    {/* Instructor/Admin Routes */}
    <Route path="/instructor" element={
      <ProtectedRoute allowedRoles={['admin', 'instructor']}>
        <InstructorLayout />
      </ProtectedRoute>
    }>
      <Route path="dashboard" element={<InstructorDashboard />} />
      <Route path="courses" element={<InstructorDashboard />} />
      <Route path="courses/:courseId/edit" element={<CourseEditor />} />
      <Route path="reports" element={<ReportsDashboard />} />
      <Route path="learners" element={<ReportsDashboard />} />
      <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
    </Route>
    
    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
