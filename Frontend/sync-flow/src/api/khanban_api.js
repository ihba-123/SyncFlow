import api from "./axios_inteceptor";

export const khanbanService = {
    
    getTasks : async (project_id) => {
        try {
            const res = await api.get(`/projects/${project_id}/tasks/`)
            return res;
        } catch (error) {
            console.error("Error fetching tasks:", error);
            throw error;
        }
    },

    createTask : async (project_id, taskData) => {
        try {
            const res = await api.post(`/projects/${project_id}/tasks/`, taskData);
            return res;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }   
        },

    updateTask : async (project_id, task_id, taskData) => {
        try {
            const res = await api.put(`/projects/${project_id}/tasks/${task_id}/`, taskData);
            return res;
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
        },

    
    deleteTask : async (project_id, task_id) => {
        try {
            const res = await api.delete(`/projects/${project_id}/tasks/${task_id}/`);
            return res;
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
        },

}