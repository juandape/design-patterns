import { useState, useMemo } from 'react';

type FilteredListProps<T> = {
  items: T[];
  query: string;
  key?: keyof T;
};

export const useFilteredList = <T,>({
  items,
  query = '',
  key,
}: FilteredListProps<T>) => {
  const [searchQuery, setSearchQuery] = useState(query);

  const filteredItems = useMemo(() => {
    if (searchQuery.length < 2) return items;

    const query = searchQuery.toLowerCase();

    return items.filter((item) => {
      if (key) {
        const value = String(item[key] ?? '').toLowerCase();
        return value.includes(query);
      }
      return JSON.stringify(item).toLowerCase().includes(query);
    });
  }, [items, searchQuery, key]);

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    count: filteredItems.length,
    hasQuery: searchQuery.length >= 2,
    clear: () => setSearchQuery(''),
  };
};
