    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { setActiveProjects } from "../api/active_project";
    import { useActiveProjectStore } from "../stores/SetActiveProject";

    export const useSetActiveProject = () => {
    const queryClient = useQueryClient();
    const setActiveProject = useActiveProjectStore((state) => state.setActiveProject);

    return useMutation({
        mutationFn: setActiveProjects,
        onSuccess: (data) => {
            setActiveProject(data.active_project);
            
            queryClient.invalidateQueries({ queryKey: ["activeProject"] });
        },
    });
};