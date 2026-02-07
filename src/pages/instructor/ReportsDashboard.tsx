import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  Search,
  Filter,
  Download,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProgressBar } from '@/components/ui/progress-bar';
import { mockParticipantReports } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const defaultColumns = [
  { id: 'courseName', label: 'Course Name', visible: true },
  { id: 'learnerName', label: 'Learner Name', visible: true },
  { id: 'enrolledDate', label: 'Enrolled Date', visible: true },
  { id: 'startDate', label: 'Start Date', visible: true },
  { id: 'timeSpent', label: 'Time Spent', visible: true },
  { id: 'completion', label: 'Completion %', visible: true },
  { id: 'completedDate', label: 'Completed Date', visible: true },
  { id: 'status', label: 'Status', visible: true },
];

export function ReportsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState(defaultColumns);

  const reports = mockParticipantReports;

  // Calculate stats
  const stats: StatCard[] = [
    {
      title: 'Total Participants',
      value: reports.length,
      icon: Users,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Yet to Start',
      value: reports.filter((r) => r.status === 'enrolled').length,
      icon: Clock,
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'In Progress',
      value: reports.filter((r) => r.status === 'in_progress').length,
      icon: TrendingUp,
      color: 'bg-info/10 text-info',
    },
    {
      title: 'Completed',
      value: reports.filter((r) => r.status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-success/10 text-success',
    },
  ];

  const filteredReports = reports.filter(
    (r) =>
      r.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (minutes: number) => {
    if (minutes === 0) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <Badge variant="warning">Yet to Start</Badge>;
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Track learner progress and engagement
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold text-card-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={cn('rounded-xl p-3', stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.visible}
                  onCheckedChange={() => toggleColumn(column.id)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((c) => c.visible)
                .map((column) => (
                  <TableHead key={column.id}>{column.label}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                {columns.find((c) => c.id === 'courseName')?.visible && (
                  <TableCell className="font-medium">{report.courseName}</TableCell>
                )}
                {columns.find((c) => c.id === 'learnerName')?.visible && (
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.learnerName}</p>
                      <p className="text-xs text-muted-foreground">{report.learnerEmail}</p>
                    </div>
                  </TableCell>
                )}
                {columns.find((c) => c.id === 'enrolledDate')?.visible && (
                  <TableCell>{formatDate(report.enrolledDate)}</TableCell>
                )}
                {columns.find((c) => c.id === 'startDate')?.visible && (
                  <TableCell>{formatDate(report.startDate)}</TableCell>
                )}
                {columns.find((c) => c.id === 'timeSpent')?.visible && (
                  <TableCell>{formatTime(report.timeSpent)}</TableCell>
                )}
                {columns.find((c) => c.id === 'completion')?.visible && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProgressBar
                        value={report.completionPercentage}
                        size="sm"
                        variant={report.completionPercentage === 100 ? 'success' : 'default'}
                        className="w-20"
                      />
                      <span className="text-sm">{report.completionPercentage}%</span>
                    </div>
                  </TableCell>
                )}
                {columns.find((c) => c.id === 'completedDate')?.visible && (
                  <TableCell>{formatDate(report.completedDate)}</TableCell>
                )}
                {columns.find((c) => c.id === 'status')?.visible && (
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                )}
              </TableRow>
            ))}

            {filteredReports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.filter((c) => c.visible).length}
                  className="h-32 text-center"
                >
                  <p className="text-muted-foreground">No reports found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
