// src/hooks/useAuth.js
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/auth";
import { useAuthStore } from "../stores/AuthStore";

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  const query = useQuery({
    queryKey: ["auth"],
    queryFn: getProfile,
    onSuccess: (data) => {
      console.log("Auth success:", data);
      console.log(data);
      setUser(data);
    },
    onError: (err) => {
      console.log("Auth failed:", err);
      clearUser();
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  // Expose the loading state directly
  return {
    ...query,
    isLoading: query.isPending,           // initial load
    isFetching: query.isFetching,         // any background fetch
    hasCheckedAuth: !query.isPending,     // true after first success OR error
  };
};