
import api from "./axios_inteceptor";
export const createProject = async (formData) => {
  const { data } = await api.post("projects/create/", formData,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
    

  
    
export const projectList = async (page=1) => {
  const data = await api.get(`projects/list/?page=${page}`)
  return data;
}



export const getProjectMembers = async (project_id) => {
  const res = await api.get(`projects/${project_id}/invites/list/`);
  return res.data;
}


// Delete projects 

export const deleteProject = async (project_id) => {
  const res = await api.delete(`projects/${project_id}/permanent-delete/`);
  return res.data;
}


//Soft delete project
export const softDeleteProject = async (id) => {
  const res = await api.delete(`projects/${id}/delete/`);
  return res.data;
}

//Archived projects
export const archivedProjects = async () => {
  const res = await api.get(`projects/archived/`);
  return res.data;
}

//Restore project
export const restoreProject = async (project_id) => {
  const res = await api.post(`projects/${project_id}/restore/`);
  return res.data;
}

//Update projects 
export const updateProject = async (project_id) => {
  const res = await api.post(`projects/${project_id}/update/`)
  return res.data;
}

//Remove memeber from project
export const removeMember = async (project_id, user_id) => {
  const res = await api.post(`projects/${project_id}/remove/${user_id}/`, {
    data: { user_id },
  });
  return res.data;
}
