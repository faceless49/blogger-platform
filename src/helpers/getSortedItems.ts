type SortByType<T> = {
  sortBy: keyof T;
  sortDirection: 'asc' | 'desc';
};

export const getSortedItems = <T>(items: T[], ...sortBy: SortByType<T>[]) => {
  return [...items].sort((item1, item2) => {
    for (let sortConfig of sortBy) {
      if (item1[sortConfig.sortBy] < item2[sortConfig.sortBy]) {
        return sortConfig.sortDirection === 'asc' ? -1 : 1;
      }
      if (item1[sortConfig.sortBy] > item2[sortConfig.sortBy]) {
        return sortConfig.sortDirection === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });
};

export const getSortDirection = (sortDirection: string) => {
  if (sortDirection === 'asc') return 1;
  if (sortDirection === 'desc') return -1;
  return 0;
};
