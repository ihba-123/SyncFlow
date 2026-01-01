import api from "./axios_inteceptor";


export const getProject = async() => {
    const {data} = await api.get("projects/create/");
    return data
};