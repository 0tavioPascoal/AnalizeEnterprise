"use client";

import { useMemo, useState } from "react";

type SortDirection = "asc" | "desc";

// 🔥 filtro tipado
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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  // 🔥 sem any
  const [filters, setFilters] = useState<Record<string, FilterFn<T>>>({});

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

    // filtros
    Object.values(filters).forEach((fn) => {
      result = result.filter(fn);
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

  function setFilter(key: string, fn: FilterFn<T>) {
    setFilters((prev) => ({
      ...prev,
      [key]: fn,
    }));
    setPage(1);
  }

  // 🔥 CORREÇÃO PRINCIPAL
  function removeFilter(key: string) {
    setFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  function clearFilters() {
    setFilters({});
    setSearch("");
    setPage(1);
  }

  function handleSearch(value: string) {
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
    removeFilter, // 👈 AGORA EXISTE
    clearFilters,
  };
}