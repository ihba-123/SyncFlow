import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  Settings2} from "lucide-react";
import { toast } from "react-toastify";
import { getProjectById, updateProjectSettings } from "../../api/Project";
import { useActiveProjectStore } from "../../stores/ActiveProject";
import { useTeamList } from "../team/TeamListLogic";
import { useProjectRoleStore } from "../../stores/ProjectRoleStore";
import { DangerZone } from "../../components/Project/DangerZone";
import Loader from "../../components/Spinner";
import ProjectForm from "../../components/ProjectSetting/ProjectForm";
import ProjectMemberSetting from "../../components/ProjectSetting/ProjectMemberSetting";
import ProjectInfo from "../../components/ProjectSetting/ProjectInfo";

const emptyForm = {
  name: "",
  description: "",
};

export default function ProjectSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeProject = useActiveProjectStore((s) => s.activeProject);
  const setActiveProject = useActiveProjectStore((s) => s.setActiveProject);
  const setRole = useProjectRoleStore((s) => s.setRole);

  const projectId = id || activeProject?.id;

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [initialValues, setInitialValues] = useState(null);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project-settings", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: Boolean(projectId),
  });

  const { data: teamData } = useTeamList(projectId);
  const role = teamData?.user_role;

  useEffect(() => {
    if (!role || !projectId) return;
    const normalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
    setRole(normalizedRole, String(projectId));
  }, [role, projectId, setRole]);

  const canEdit = useMemo(() => {
    if (!project) return false;
    if (project.is_solo) return true;
    return role === "admin";
  }, [project, role]);

  useEffect(() => {
    if (!project) return;
    const defaults = {
      name: project.name || "",
      description: project.description || "",
      image: project.image || "",
    };

    setForm({
      name: defaults.name,
      description: defaults.description,
    });
    setPreviewUrl(project.image || "");
    setImageFile(null);
    setRemoveImage(false);
    setInitialValues(defaults);
  }, [project]);

  const isDirty = useMemo(() => {
    if (!initialValues) return false;

    return (
      form.name !== initialValues.name ||
      form.description !== initialValues.description ||
      Boolean(imageFile) ||
      removeImage
    );
  }, [form, imageFile, removeImage, initialValues]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateProjectSettings(projectId, {
        name: form.name.trim(),
        description: form.description.trim(),
        is_solo: project?.is_solo,
        remove_image: removeImage,
        image: imageFile,
      }),
    onSuccess: (response) => {
      const updatedProject = response?.project;
      if (updatedProject) {
        setActiveProject({
          ...activeProject,
          id: updatedProject.id,
          name: updatedProject.name,
          description: updatedProject.description,
          image: updatedProject.image,
          is_solo: updatedProject.is_solo,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["activeProject"] });
      queryClient.invalidateQueries({ queryKey: ["project-settings", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projectMembers", projectId] });

      toast.success("Project settings saved successfully.");

      const latestImage = updatedProject?.image || "";
      setForm({
        name: updatedProject?.name || "",
        description: updatedProject?.description || "",
      });
      setPreviewUrl(latestImage);
      setImageFile(null);
      setRemoveImage(false);
      setInitialValues({
        name: updatedProject?.name || "",
        description: updatedProject?.description || "",
        image: latestImage,
      });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to save project settings.";
      toast.error(message);
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setRemoveImage(false);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setRemoveImage(true);
    setPreviewUrl("");
  };

  const handleResetChanges = () => {
    if (!initialValues) return;

    setForm({
      name: initialValues.name,
      description: initialValues.description,
    });
    setPreviewUrl(initialValues.image || "");
    setImageFile(null);
    setRemoveImage(false);
  };

  const handleBackToProject = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Leave without saving?")) {
      return;
    }
    navigate(`/projects/${projectId}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!projectId) {
      toast.error("Select a project first.");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Project name is required.");
      return;
    }

    if (!canEdit) {
      toast.error("You do not have permission to edit this project.");
      return;
    }

    saveMutation.mutate();
  };

  if (!projectId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">No active project selected</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose a project from dashboard and open settings again.</p>
          <Link to="/dashboard/project" className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
            Go to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 flex justify-center items-center h-[700px] text-sm text-slate-500 dark:text-slate-300"><Loader /></div>;
  }

  if (isError || !project) {
    return <div className="p-8 text-sm text-red-500">Unable to load project settings.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-2 py-6 sm:px-4 md:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
              <Settings2 className="h-6 w-6 text-sky-500" />
              Project Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage details for {project.name}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBackToProject}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back to Project
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === "general" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"}`}
          >
            General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === "members" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"}`}
          >
            Members
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("danger")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === "danger" ? "bg-red-600 text-white dark:bg-red-500" : "border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-950/30"}`}
          >
            Danger Zone
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {activeTab === "general" && (
          <ProjectForm 
          handleSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          canEdit={canEdit}
          saveMutation={saveMutation}
          previewUrl={previewUrl}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          imageFile={imageFile}
          isDirty={isDirty}
          handleResetChanges={handleResetChanges}
          />
        )}

{/* // Only show members tab if it's a team project */}
        {activeTab === "members" && (
          <ProjectMemberSetting  projectId={projectId} teamData={teamData} role={role} navigate={navigate} project={project} />
        )}

        {activeTab === "general" && <div className="space-y-6">
          <ProjectInfo project={project} />

          {canEdit && <DangerZone projectId={projectId} />}
        </div>}

        {activeTab === "danger" && (
          <div className="lg:col-span-2">
            {canEdit ? (
              <DangerZone projectId={projectId} />
            ) : (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/20 dark:text-amber-300">
                Only project admin can use danger zone actions.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
