"use client";

import { useMemo, useState } from "react";

type SortDirection = "asc" | "desc";
type FilterFn<T> = (item: T) => boolean;

interface UseTableProps<T> {
  data: T[];
  itemsPerPage?: number;
  searchKey?: keyof T;
}

export function useTable<T>({
  data,
  itemsPerPage = 10,
  searchKey,
}: UseTableProps<T>) {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [filters, setFilters] = useState<Record<string, FilterFn<T>>>({});

  const filteredData = useMemo(() => {
    let result = [...data];

    if (search && searchKey) {
      const normalizedSearch = search.toLowerCase().trim();

      result = result.filter((item) =>
        String(item[searchKey] ?? "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    }

    Object.values(filters).forEach((fn) => {
      result = result.filter(fn);
    });

    return result;
  }, [data, search, filters, searchKey]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? 1 : -1;
      if (bValue == null) return sortDirection === "asc" ? -1 : 1;

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * itemsPerPage;

    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, page, totalPages, itemsPerPage]);

  function handleSort(key: keyof T): void {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  function setFilter(key: string, fn: FilterFn<T>): void {
    setFilters((prev) => ({
      ...prev,
      [key]: fn,
    }));

    setPage(1);
  }

  function removeFilter(key: string): void {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    setPage(1);
  }

  function clearFilters(): void {
    setFilters({});
    setSearch("");
    setPage(1);
  }

  function handleSearch(value: string): void {
    setSearch(value);
    setPage(1);
  }

  return {
    data: paginatedData,
    total: sortedData.length,

    page,
    setPage,
    totalPages,

    search,
    setSearch: handleSearch,

    sortKey,
    sortDirection,
    handleSort,

    filters,
    setFilter,
    removeFilter,
    clearFilters,
  };
}