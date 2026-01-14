import React, { useState, useEffect, useMemo } from "react";
import { useProject } from "../../hooks/useProject";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "../../api/search";


const RECENT_SEARCHES_KEY = "recent_global_searches";
const MAX_RECENT_SEARCHES = 6;

const getRecentSearches = () => {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (query) => {
  if (!query?.trim()) return;

  const recent = getRecentSearches();
  const trimmed = query.trim();

  // Remove duplicate if exists + add to front
  const filtered = recent.filter((item) => item !== trimmed);
  const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);

  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};
export const SearchLogic = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(getRecentSearches());
  const { setProjectMeta } = useProject();
  const navigate = useNavigate();
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value) => {
        const trimmed = value.trim();
        setDebouncedQuery(trimmed);
      }, 250),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSetQuery(value);
  };

 
  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["globalSearch", debouncedQuery],
    queryFn: () => globalSearch({ q: debouncedQuery }),
    enabled: debouncedQuery.length >= 1,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Combine results with type
  const searchResults = [
    ...(rawData?.projects?.map((item) => ({ ...item, type: "project" })) || []),
    ...(rawData?.tasks?.map((item) => ({ ...item, type: "task" })) || []),
    ...(rawData?.members?.map((item) => ({ ...item, type: "member" })) || []),
  ];

  // Save to recent searches when we have successful results
  useEffect(() => {
    if (debouncedQuery && !isLoading && !isError && searchResults.length > 0) {
      saveRecentSearch(debouncedQuery);
      setRecentSearches(getRecentSearches());
    }
  }, [debouncedQuery, isLoading, isError, searchResults.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClick = (item) => {
    setOpen(false);

    if (item.type === "project") {
      setProjectMeta(item);
      navigate(`/projects/${item.id}`);
      return;
    }

    if (item.type === "task") {
      navigate(`/tasks/${item.id}`);
      return;
    }

    if (item.type === "member") {
      navigate(`/users/${item.id}`);
      return;
    }
  };
  const clearRecentSearches = (e) => {
    e.stopPropagation();
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  return {
    open,
    setOpen,
    setQuery,
    query,
    handleInputChange,
    setDebouncedQuery,
    isLoading,
    isError,
    error,
    searchResults,
    recentSearches,
    handleClick,
    debouncedQuery,
    clearRecentSearches,
  };
};
