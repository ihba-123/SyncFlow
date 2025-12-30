import api from "./axios_inteceptor";

//For login

export const login = async (data) => {
  return api.post("login/", data);
};

// Registration
export const Registration = async (data) => {
  return api.post("register/", data);
};

export const Logout = async () =>{
    const logout = await api.post("logout/");
    return logout
}



// Profile
export const getProfile = async() => {
    const {data} = await api.get("profile/");
    return data
};




export const userProfile = async() => {
  const res = await api.get("chat-profile/")
  return res.data
}

export const onBoard = async() => {
  const res = await api.post("onboard/")
  return res.data
}