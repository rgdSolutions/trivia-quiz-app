import { describe, it, expect } from 'vitest';
import type { Category } from './types';
import { shuffleArray, sortCategoryArrayAlphabetically } from './utils';

describe('shuffleArray', () => {
  it('returns a new array with the same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled).toHaveLength(arr.length);
    expect(shuffled.sort()).toEqual(arr.sort());
    // Should not be the same reference
    expect(shuffled).not.toBe(arr);
  });

  it('shuffles the array (not always in the same order)', () => {
    const arr = [1, 2, 3, 4, 5];
    // Run multiple times to increase chance of shuffle
    const results = new Set();
    for (let i = 0; i < 10; i++) {
      results.add(shuffleArray(arr).join(','));
    }
    // There should be more than one unique result
    expect(results.size).toBeGreaterThan(1);
  });

  it('returns an empty array when input is empty', () => {
    expect(shuffleArray([])).toEqual([]);
  });
});

describe('sortCategoryArrayAlphabetically', () => {
  const categories: Category[] = [
    { id: 2, name: 'Banana' },
    { id: 1, name: 'Apple' },
    { id: 3, name: 'Cherry' },
  ];

  it('sorts categories alphabetically by name', () => {
    const sorted = sortCategoryArrayAlphabetically(categories);
    expect(sorted.map((c) => c.name)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('returns a new array and does not mutate the original', () => {
    const original = [...categories];
    sortCategoryArrayAlphabetically(categories);
    expect(categories).toEqual(original);
  });

  it('returns an empty array if input is undefined', () => {
    expect(sortCategoryArrayAlphabetically(undefined)).toEqual([]);
  });

  it('returns an empty array if input is empty', () => {
    expect(sortCategoryArrayAlphabetically([])).toEqual([]);
  });
});
