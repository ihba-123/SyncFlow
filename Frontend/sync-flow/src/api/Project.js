
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
export const softDeleteProject = async (project_id) => {
  const res = await api.delete(`projects/${project_id}/soft-delete/`);
  return res.data;
}