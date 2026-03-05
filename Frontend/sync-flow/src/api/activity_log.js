import api from "./axios_inteceptor";

export const activityLog = async (project_id) => {
    const res = await api.get(`projects/${project_id}/activity/`)
     return res.data;
}