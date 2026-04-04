import api from "./axios_inteceptor";

const getBackendBaseUrl = () => {
    return (
        import.meta.env.VITE_WS_BASE_URL ||
        import.meta.env.VITE_BACKEND_WS_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:8000"
    ).replace(/\/$/, "");
};

export const createGroupChatRoom = async ({ participantIds = [], name = "Group Chat" }) => {
    const payload = {
        is_group: true,
        participant_ids: participantIds,
        name,
    };

    const response = await api.post("chatrooms/create/", payload);
    return response.data;
};


export const getMessageList = async (roomId, page = 1) => {
    const response = await api.get(`message-list/${roomId}/`, {
        params: { page },
    });

    return response.data;
};

export const sendAttachmentOrMessage = async ({ roomId, content = "", attachment = null, images = null }) => {
    const formData = new FormData();

    if (content) {
        formData.append("content", content);
    }
    if (attachment) {
        formData.append("attachment", attachment);
    }
    if (images) {
        formData.append("images", images);
    }

    const response = await api.post(`chat/${roomId}/messages/`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getProjectChatRoom = async (projectId) => {
    const response = await api.get(`projects/${projectId}/`);
    return response.data?.chat_room || null;
};

export const buildChatSocketUrl = (roomId) => {
    const baseUrl = getBackendBaseUrl();
    const wsBase = baseUrl.replace(/^http/i, "ws");
    return `${wsBase}/ws/chat/${roomId}/`;
};