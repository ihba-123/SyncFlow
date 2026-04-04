export const toLower = (value) => (value ? String(value).toLowerCase() : "");

export const buildMemberIndex = (members = [], currentUser = null) => {
  const index = new Map();
  const add = (key, value) => {
    if (!key || index.has(key)) return;
    index.set(key, value);
  };
  [...members, currentUser].filter(Boolean).forEach((member) => {
    add(toLower(member.id), member);
    add(toLower(member.email), member);
    add(toLower(member.name), member);
    add(toLower(member.username), member);
    add(toLower(member?.user?.email), member);
    add(toLower(member?.user?.name), member);
  });
  return index;
};

export const resolveSender = (sender, memberIndex = new Map()) => {
  if (!sender) return null;
  if (typeof sender === "object") return sender;
  return memberIndex.get(toLower(sender)) || null;
};

export const isMyMessage = (sender, currentUser, memberIndex = new Map()) => {
  if (!sender || !currentUser) return false;
  if (typeof sender === "object" && currentUser.id) {
    const senderUserId = sender.user_id || sender.user?.id || sender.id;
    if (senderUserId) return Number(senderUserId) === Number(currentUser.id);
  }
  const senderText = toLower(sender);
  const currentCandidates = [currentUser.id, currentUser.email, currentUser.name, currentUser.username].filter(Boolean).map(toLower);
  if (currentCandidates.includes(senderText)) return true;
  const matchedMember = memberIndex.get(senderText);
  return Boolean(matchedMember && (toLower(matchedMember.id) === toLower(currentUser.id) || toLower(matchedMember.email) === toLower(currentUser.email) || toLower(matchedMember.name) === toLower(currentUser.name)));
};

export const formatTime = (timestamp) => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
};

export const getUserDisplayName = (user) => {
  if (!user) return "Unknown";
  if (user.name?.trim()) return user.name.trim();
  if (user.username?.trim()) return user.username.trim();
  if (user.email?.trim()) return user.email.split("@")[0].replace(/[._-]/g, " ").trim();
  return "Unknown";
};

export const getUserAvatar = (user) => user?.photo || user?.avatar || user?.image || user?.profile?.photo || null;

export const getInitials = (value) => String(value || "").split(" ").filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "U";

export const getBackendOrigin = () => (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "").replace(/\/api$/, "");

export const toAbsoluteAssetUrl = (assetUrl) => {
  if (!assetUrl || /^https?:\/\//i.test(assetUrl)) return assetUrl || "";
  const origin = getBackendOrigin();
  return `${origin}${assetUrl.startsWith("/") ? "" : "/"}${assetUrl}`;
};

export const getFileNameFromUrl = (url) => decodeURIComponent(String(url || "").split("/").pop()?.split("?")[0] || "attachment");

export const isImageFile = (file) => Boolean(file && file.type?.startsWith("image/"));

export const normalizeMessage = (message, currentUser, memberIndex = new Map()) => {
  const sender = resolveSender(message?.sender, memberIndex);
  return {
    id: String(message?.id || `m-${Date.now()}`),
    user: getUserDisplayName(sender || message?.sender),
    text: message?.content ?? message?.text ?? "",
    time: formatTime(message?.timestamp),
    isOwn: isMyMessage(message?.sender, currentUser, memberIndex),
    avatar: getUserAvatar(sender),
    senderId: sender?.user_id || sender?.id || message?.sender?.user_id || message?.sender?.id || message?.sender_id || message?.senderId || null,
    seen: Boolean(message?.is_read || message?.seen),
    attachment: message?.attachment || message?.file || null,
    image: message?.images || message?.image || null,
    pending: Boolean(message?.pending),
  };
};

export const parseNextPage = (nextUrl) => {
  if (!nextUrl) return null;
  const match = String(nextUrl).match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : null;
};

export const mergeMessages = (existing = [], incoming = []) => {
  if (!incoming.length) return existing;
  const merged = new Map(existing.map((msg) => [msg.id, msg]));
  incoming.forEach((msg) => {
    const prev = merged.get(msg.id);
    merged.set(msg.id, prev ? { ...prev, ...msg, pending: false } : msg);
  });
  return Array.from(merged.values());
};