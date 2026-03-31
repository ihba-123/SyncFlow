import api from "./axios_inteceptor";

export const khanbanService = {

  // -------------------- GET TASKS --------------------
  // Supports optional filters: search, status, priority, assigned_to
  getTasks: async (project_id, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`/projects/${project_id}/tasks/`, { params });
      return res.data; // only return the task list
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  // -------------------- CREATE TASK --------------------
  createTask: async (project_id, taskData) => {
    try {
      const res = await api.post(`/projects/${project_id}/tasks/`, taskData);
      return res.data; 
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  // -------------------- UPDATE TASK --------------------
  // This is used for editing task fields (title, description, priority, etc.)
  updateTask: async (project_id, task_id, taskData) => {
    try {
      const res = await api.put(`/projects/${project_id}/tasks/${task_id}/`, taskData);
      return res.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },


  // -------------------- REORDER TASK --------------------
  // Special method for drag-drop updates
  reorderTask: async (project_id, task_id, { status, prev_task_id = null, next_task_id = null }) => {
    try {
      const payload = { status, prev_task_id, next_task_id };
      const res = await api.put(`/projects/${project_id}/tasks/${task_id}/`, payload);
      return res.data;
    } catch (error) {
      console.error("Error reordering task:", error);
      throw error;
    }
  },

  
  // -------------------- DELETE TASK --------------------
  deleteTask: async (project_id, task_id) => {
    try {
      const res = await api.delete(`/projects/${project_id}/tasks/${task_id}/`);
      return res.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },
};