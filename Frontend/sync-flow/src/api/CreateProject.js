import api from '../api/axios_inteceptor'

export const createProject = async(data) => {
    const res = await api.post("projects/create/", data)
    return res.data
}