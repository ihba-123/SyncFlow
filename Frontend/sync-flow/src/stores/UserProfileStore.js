import { create } from "zustand";

export const useUserProfileStore = create((set) => {
    return {
        name:null ,
        photo: null,
        bio: null,
        is_online:false,
        setUser: (profile) =>set({
            name:profile.name,
            photo:profile.photo,
            bio:profile.bio,
            is_online:profile.is_online

        }),

        clearProfile: () => set({
            name: null,
            photo: null,
            bio: null,
            is_online:false
        })
    }
})  