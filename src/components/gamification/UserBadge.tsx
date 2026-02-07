import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { BadgeLevel, BADGE_THRESHOLDS } from '@/types';
import { cn } from '@/lib/utils';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';

interface UserBadgeProps {
  level: BadgeLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const badgeConfig: Record<BadgeLevel, { 
  icon: React.ElementType; 
  color: string; 
  bgColor: string;
  gradient: string;
}> = {
  Newbie: { 
    icon: Star, 
    color: 'text-badge-newbie', 
    bgColor: 'bg-badge-newbie/10',
    gradient: 'from-slate-400 to-slate-500',
  },
  Explorer: { 
    icon: Star, 
    color: 'text-badge-explorer', 
    bgColor: 'bg-badge-explorer/10',
    gradient: 'from-sky-400 to-blue-500',
  },
  Achiever: { 
    icon: Trophy, 
    color: 'text-badge-achiever', 
    bgColor: 'bg-badge-achiever/10',
    gradient: 'from-emerald-400 to-green-500',
  },
  Specialist: { 
    icon: Trophy, 
    color: 'text-badge-specialist', 
    bgColor: 'bg-badge-specialist/10',
    gradient: 'from-amber-400 to-orange-500',
  },
  Expert: { 
    icon: Sparkles, 
    color: 'text-badge-expert', 
    bgColor: 'bg-badge-expert/10',
    gradient: 'from-orange-400 to-red-500',
  },
  Master: { 
    icon: Sparkles, 
    color: 'text-badge-master', 
    bgColor: 'bg-badge-master/10',
    gradient: 'from-purple-400 to-violet-600',
  },
};

export function UserBadge({ 
  level, 
  size = 'md', 
  showLabel = true,
  animated = false,
  className,
}: UserBadgeProps) {
  const config = badgeConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <motion.div
        initial={animated ? { scale: 0, rotate: -180 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className={cn(
          'relative flex items-center justify-center rounded-full bg-gradient-to-br shadow-md',
          sizeClasses[size],
          config.gradient
        )}
      >
        <Icon className={cn(iconSizes[size], 'text-white')} />
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1, repeat: 2 }}
            style={{
              background: `radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)`,
            }}
          />
        )}
      </motion.div>
      {showLabel && (
        <span className={cn('font-semibold', config.color)}>{level}</span>
      )}
    </div>
  );
}

interface UserPointsProps {
  points: number;
  currentBadge: BadgeLevel;
  showProgress?: boolean;
  className?: string;
}

export function UserPoints({ 
  points, 
  currentBadge, 
  showProgress = true,
  className,
}: UserPointsProps) {
  // Find next badge level
  const badgeLevels = Object.entries(BADGE_THRESHOLDS) as [BadgeLevel, number][];
  const currentIndex = badgeLevels.findIndex(([level]) => level === currentBadge);
  const nextBadge = badgeLevels[currentIndex + 1];

  const progressToNext = nextBadge
    ? ((points - BADGE_THRESHOLDS[currentBadge]) / 
       (nextBadge[1] - BADGE_THRESHOLDS[currentBadge])) * 100
    : 100;

  return (
    <div className={cn('rounded-2xl border border-border bg-card p-5', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Points</p>
          <p className="text-3xl font-bold gradient-text">{points}</p>
        </div>
        <UserBadge level={currentBadge} size="lg" showLabel={false} />
      </div>

      {showProgress && nextBadge && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{currentBadge}</span>
            <span className="text-muted-foreground">{nextBadge[0]}</span>
          </div>
          <ProgressBar 
            value={progressToNext} 
            variant="accent" 
            size="md" 
            className="mt-2" 
          />
          <p className="mt-2 text-xs text-muted-foreground text-center">
            {nextBadge[1] - points} points to {nextBadge[0]}
          </p>
        </div>
      )}

      {!nextBadge && (
        <div className="mt-4 text-center">
          <BadgeUI variant="master">
            <Sparkles className="mr-1 h-3 w-3" />
            Maximum Level Achieved!
          </BadgeUI>
        </div>
      )}
    </div>
  );
}

interface BadgeListProps {
  currentPoints: number;
  earnedBadges: BadgeLevel[];
  className?: string;
}

export function BadgeList({ currentPoints, earnedBadges, className }: BadgeListProps) {
  const allBadges = Object.entries(BADGE_THRESHOLDS) as [BadgeLevel, number][];

  return (
    <div className={cn('grid grid-cols-3 gap-4 sm:grid-cols-6', className)}>
      {allBadges.map(([level, threshold]) => {
        const isEarned = currentPoints >= threshold;
        const config = badgeConfig[level];

        return (
          <motion.div
            key={level}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl p-3 transition-all',
              isEarned ? 'bg-card shadow-card' : 'opacity-40'
            )}
          >
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                isEarned 
                  ? `bg-gradient-to-br ${config.gradient}` 
                  : 'bg-muted'
              )}
            >
              <config.icon 
                className={cn(
                  'h-6 w-6',
                  isEarned ? 'text-white' : 'text-muted-foreground'
                )} 
              />
            </div>
            <div className="text-center">
              <p className={cn(
                'text-xs font-medium',
                isEarned ? config.color : 'text-muted-foreground'
              )}>
                {level}
              </p>
              <p className="text-[10px] text-muted-foreground">{threshold} pts</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
