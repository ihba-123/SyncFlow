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
      setUser(data);
      console.log(data);
    },
    onError: (err) => {
      if (err.response?.status !== 401) {
        console.error(err);
      }
      clearUser();
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  
  return {
    ...query,
    isLoading: query.isPending,           // initial load
    isFetching: query.isFetching,         // any background fetch
    // In useAuth.js return object
    hasCheckedAuth: query.isSuccess || query.isError,
    is_Authenticated: query.isSuccess,
  };
};  