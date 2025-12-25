import api from "./axios_inteceptor";

export const updateProfile = async(data) => {
    const res =  await api.patch("chat-profile/update/", data,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data ;
}