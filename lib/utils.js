import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatPoints(points) {
  return new Intl.NumberFormat('id-ID').format(points);
}

export function formatWeight(weight) {
  return `${parseFloat(weight).toFixed(2)} kg`;
}

export function getMonthName(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

export function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function getMonthsArray(count = 6) {
  const months = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7));
  }
  
  return months;
}