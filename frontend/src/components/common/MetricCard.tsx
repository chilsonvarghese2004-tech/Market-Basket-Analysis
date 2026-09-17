import React, { useEffect, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: number | string;
  isPercentage?: boolean;
  prefix?: string;
  suffix?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  comparisonText?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  isPercentage = false,
  prefix = '',
  suffix = '',
  trend,
  trendDirection = 'up',
  comparisonText = 'vs previous analysis',
  icon: Icon,
  color = 'cyan',
  delay = 0,
}) => {
  // Count-up animation for numeric values
  const [displayValue, setDisplayValue] = useState<number | string>(
    typeof value === 'number' ? 0 : value
  );

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    const duration = 1200; // ms
    const startTime = performance.now();
    const startVal = 0;
    const endVal = value;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * ease;

      if (isPercentage) {
        setDisplayValue(parseFloat(current.toFixed(1)));
      } else if (endVal > 100) {
        setDisplayValue(Math.round(current));
      } else {
        setDisplayValue(parseFloat(current.toFixed(2)));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isPercentage]);

  const colorStyles = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-glow-cyan',
    },
    violet: {
      border: 'hover:border-violet-500/40',
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      glow: 'group-hover:shadow-glow-violet',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-glow-emerald',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: '',
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: '',
    },
  };

  const style = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`group relative p-5 rounded-2xl bg-dark-900/90 backdrop-blur-xl border border-slate-800/90 shadow-card transition-all duration-300 ${style.border} ${style.glow}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${style.iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        {prefix && <span className="text-lg font-semibold text-slate-400">{prefix}</span>}
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          {typeof displayValue === 'number'
            ? isPercentage
              ? `${displayValue}%`
              : displayValue.toLocaleString()
            : displayValue}
        </span>
        {suffix && <span className="text-sm font-semibold text-slate-400">{suffix}</span>}
      </div>

      {trend && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs">
          <div
            className={`flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md ${
              trendDirection === 'up'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-rose-400 bg-rose-500/10'
            }`}
          >
            {trendDirection === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend}</span>
          </div>
          <span className="text-[11px] text-slate-500 truncate">{comparisonText}</span>
        </div>
      )}
    </motion.div>
  );
};

