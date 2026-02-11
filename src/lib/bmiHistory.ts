export interface BMIHistoryEntry {
  id: string;
  date: string; // ISO string
  weight: number; // kg
  heightFeet: number;
  heightInches: number;
  bmi: number;
  category: string;
}

const STORAGE_KEY = 'bmi-history';

export function loadHistory(): BMIHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveHistory(entries: BMIHistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage full or unavailable
  }
}

export function addEntry(entry: Omit<BMIHistoryEntry, 'id' | 'date'>): BMIHistoryEntry[] {
  const history = loadHistory();
  const newEntry: BMIHistoryEntry = {
    ...entry,
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    date: new Date().toISOString(),
  };
  const updated = [newEntry, ...history];
  saveHistory(updated);
  return updated;
}

export function removeEntry(id: string): BMIHistoryEntry[] {
  const history = loadHistory();
  const updated = history.filter((e) => e.id !== id);
  saveHistory(updated);
  return updated;
}

export function clearAllHistory(): BMIHistoryEntry[] {
  saveHistory([]);
  return [];
}

export function getCategoryColor(category: string): string {
  if (category === 'Underweight') return '#3b82f6';
  if (category === 'Normal') return '#10b981';
  if (category === 'Overweight') return '#f59e0b';
  return '#ef4444';
}

export function getSimpleCategory(category: string): string {
  if (category.startsWith('Obese')) return 'Obese';
  return category;
}
