import api from "./axios_inteceptor"

//For login

export const login = async(data) => {
    return api.post("login/",data)
}

// Registration
export const Registration = async(data) => {
    return api.post("register/",data)
}


// Profile
export const getProfile = async() => {
    const {data} = await api.get("profile/")
    return data
}