import { useQuery } from "@tanstack/react-query";
import { userProfile } from "../api/auth";
import { useUserProfileStore } from "../stores/UserProfileStore";
import { useAuth } from "../hooks/Auth";
export const useUserProfile = () => {
  const setUser = useUserProfileStore((s) => s.setUser)
  const clearProfile = useUserProfileStore((s) => s.clearProfile);
  const {is_Authenticated} = useAuth()
  
  const query = useQuery({
    queryKey: ["chat-profile"],
    queryFn: userProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: is_Authenticated,
    
    onSuccess: (value) => {
      setUser(value)  
      console.log(value)  
    },
    onError: (err) => {
      if (err.response?.status !== 401) {
        clearProfile();
        console.error(err);
      }
    },
  });

  return {
    ...query,
    name: query.data?.name,
    photo: query.data?.photo,
    bio: query.data?.bio,
    is_online: query.data?.is_online
  };
};
