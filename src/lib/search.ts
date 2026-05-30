export function searchByKeyword<T>(
  items: T[],
  keyword: string,
  getText: (item: T) => string
): T[] {
  if (!keyword.trim()) return items;
  const lower = keyword.toLowerCase();
  return items.filter((item) => getText(item).toLowerCase().includes(lower));
}

export function filterByTags<T>(
  items: T[],
  selectedTags: string[],
  getTags: (item: T) => string[]
): T[] {
  if (selectedTags.length === 0) return items;
  return items.filter((item) => {
    const itemTags = getTags(item);
    return selectedTags.some((tag) => itemTags.includes(tag));
  });
}
