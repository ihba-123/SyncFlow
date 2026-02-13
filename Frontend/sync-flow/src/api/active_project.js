import api from "./axios_inteceptor";

export const fetchActiveProject = async () => {
    const res = await api.get("users/me/context/");
    return res.data;
}


export const setActiveProjects = async (projectId) => {
    const response = await api.post(
        `projects/${projectId}/set-active/`
    );

    return response.data;
};