import type { CollectionEntry } from 'astro:content';

type DatedEntry =
  | CollectionEntry<'projects'>
  | CollectionEntry<'blog'>
  | CollectionEntry<'notes'>;

export function visible<T extends { data: { draft?: boolean } }>(items: T[]) {
  return items.filter((item) => !item.data.draft);
}

export function byNewest(a: DatedEntry, b: DatedEntry) {
  return getEntryDate(b).getTime() - getEntryDate(a).getTime();
}

export function getEntryDate(entry: DatedEntry) {
  if ('publishedAt' in entry.data) return entry.data.publishedAt;
  if ('updatedAt' in entry.data) return entry.data.updatedAt;
  return entry.data.date;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getAllTags(
  blog: CollectionEntry<'blog'>[],
  notes: CollectionEntry<'notes'>[],
) {
  return Array.from(new Set([...blog, ...notes].flatMap((entry) => entry.data.tags))).sort();
}
