import api from "./axios_inteceptor";

const toAbsoluteUrl = (value) => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const base =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    window.location.origin;
  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
};


const normalizeAttachment = (attachment) => {
  if (!attachment) return null;
  const name = attachment.name || attachment.file_name || attachment.filename || "file";
  const url = toAbsoluteUrl(attachment.url || attachment.file || attachment.path);
  const type = attachment.file_type || attachment.type || (name.includes(".") ? name.split(".").pop().toLowerCase() : null);
  return {
    ...attachment,
    name,
    file_name: attachment.file_name || name,
    file_type: type,
    url,
  };
};

// Normalize task data to ensure consistent attachment structure
const normalizeTask = (task) => {
  const rawAttachments = task?.attachments ?? task?.files ?? [];
  const attachments = Array.isArray(rawAttachments)
    ? rawAttachments.map(normalizeAttachment).filter(Boolean)
    : [];

  return {
    ...task,
    attachments,
  };
};


// KHANBAN API
export const khanbanService = {
  // GET TASKS
  getTasks: async (project_id, filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const res = await api.get(`projects/${project_id}/tasks/`, { params });
      return Array.isArray(res.data) ? res.data.map(normalizeTask) : [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  // CREATE TASK
  createTask: async (project_id, taskData) => {
    try {
      const res = await api.post(`projects/${project_id}/tasks/`, taskData);
      return normalizeTask(res.data);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  // UPDATE TASK
  updateTask: async (project_id, task_id, taskData) => {
    try {
      const res = await api.put(`projects/${project_id}/tasks/${task_id}/`, taskData);
      return normalizeTask(res.data);
    } catch (error) { 
      console.error("Error updating task:", error);
      throw error;
    }
  },

  // REORDER TASK (drag & drop)
  reorderTask: async (project_id, task_id, { status, prev_task_id = null, next_task_id = null }) => {
    try {
      const payload = { status, prev_task_id, next_task_id };
      const res = await api.put(`projects/${project_id}/tasks/${task_id}/`, payload);
      return normalizeTask(res.data);
    } catch (error) {
      console.error("Error reordering task:", error);
      throw error;
    }
  },

  // DELETE TASK
  deleteTask: async (project_id, task_id) => {
    try {
      const res = await api.delete(`projects/${project_id}/tasks/${task_id}/`);
      return res.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { message: "Task already deleted" };
      }
      console.error("Error deleting task:", error);
      throw error;
    }
  },
};


// DASHBOARD
export const dashboardService = async (project_id) => {
  const res = await api.get(`projects/${project_id}/dashboard/`);
  return res.data;
};



// TASK COMMENT
// export const commentService = async (task_id, project_id, content) => {
//   const res = await api.post(`projects/${project_id}/tasks/${task_id}/comments/`, { content });
//   return res.data;
// };



// TASK ATTACHMENT
export const attachmentService = async (task_id, project_id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(
    `projects/${project_id}/tasks/${task_id}/attachments/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return normalizeAttachment(res.data);
};