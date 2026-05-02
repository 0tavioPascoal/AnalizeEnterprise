"use client";

import { useMemo, useState } from "react";

type SortDirection = "asc" | "desc";

interface UseTableProps<T> {
  data: T[];
  itemsPerPage?: number;
  searchKey?: keyof T; // campo usado na busca (ex: "name")
}

export function useTable<T>({
  data,
  itemsPerPage = 10,
  searchKey,
}: UseTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filters, setFilters] = useState<Record<string, any>>({});

  // =========================
  // FILTER
  // =========================
  const filteredData = useMemo(() => {
    let result = [...data];

    // search
    if (search && searchKey) {
      result = result.filter((item) =>
        String(item[searchKey])
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      result = result.filter(
        (item) => String(item[key as keyof T]) === String(value)
      );
    });

    return result;
  }, [data, search, filters, searchKey]);

  // =========================
  // SORT
  // =========================
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(
    sortedData.length / itemsPerPage
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, page, itemsPerPage]);

  // =========================
  // ACTIONS
  // =========================
  function handleSort(key: keyof T) {
    if (sortKey === key) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setFilter(key: string, value: any) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // reset page
  }

  function clearFilters() {
    setFilters({});
    setSearch("");
    setPage(1);
  }

  // reset page on search
  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return {
    // data
    data: paginatedData,
    total: sortedData.length,

    // pagination
    page,
    setPage,
    totalPages,

    // search
    search,
    setSearch: handleSearch,

    // sort
    sortKey,
    sortDirection,
    handleSort,

    // filters
    filters,
    setFilter,
    clearFilters,
  };
}
