// invite_join.js
import api from "./axios_inteceptor";

export const inviteLink = async ({ project_id, role }) => {
  const res = await api.post(
    `projects/${Number(project_id)}/invite/`,
    { role }
  );
  return res.data;
};
