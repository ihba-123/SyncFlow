import { useEffect } from "react";
import { useActiveProjectStore } from "../stores/ActiveProject";
import { fetchActiveProject } from "../api/active_project";

export const useValidateActiveProject = () => {
  const setFromProjectStatus = useActiveProjectStore(
    (state) => state.setFromProjectStatus
  );
  const reset = useActiveProjectStore((state) => state.reset);

  useEffect(() => {
    const validate = async () => {
      try {
        const data = await fetchActiveProject();
        if (!data.active_project) {
          reset(); 
        } else {
          setFromProjectStatus(data);
        }
      } catch (err) {
        reset();
      }
    };

    validate();
  }, [reset, setFromProjectStatus]);
};