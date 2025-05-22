import type { Category } from './types';

// Shuffle an array using the Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Alphabetically sort an array of Category objects
export const sortCategoryArrayAlphabetically = (array?: Category[]): Category[] => {
  if (!array || array.length === 0) return [];
  return array.slice().sort((a, b) => a.name.localeCompare(b.name));
};
