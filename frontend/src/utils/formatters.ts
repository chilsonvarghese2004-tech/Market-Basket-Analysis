import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0.0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

export function formatDecimal(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0.00';
  return value.toFixed(decimals);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function formatDate(dateString: string | Date): string {
  try {
    const d = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(dateString);
  }
}

export function getLiftBadge(lift: number): { label: string; bg: string; text: string; border: string } {
  if (lift >= 3.0) {
    return {
      label: 'Exceptional Lift',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
    };
  }
  if (lift >= 2.0) {
    return {
      label: 'Strong Lift',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
    };
  }
  if (lift >= 1.5) {
    return {
      label: 'Moderate Lift',
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
    };
  }
  return {
    label: 'Baseline Association',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
  };
}

export function getConfidenceBadge(confidence: number): { label: string; color: string } {
  if (confidence >= 0.75) return { label: 'High Confidence', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
  if (confidence >= 0.50) return { label: 'Good Confidence', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' };
  return { label: 'Moderate Confidence', color: 'text-slate-400 border-slate-500/30 bg-slate-500/10' };
}

