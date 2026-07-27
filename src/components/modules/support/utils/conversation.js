export function buildSupportConversation(conversationId) {
  return {
    id: conversationId,
    name: "واحد پشتیبانی",
    isSupport: true,
    department: 2,
    msg: "",
  };
}

export function buildSellerConversation(conversationId, sellerInfo = {}) {
  const fullName = sellerInfo.name || sellerInfo.full_name || "فروشنده";
  const nameParts = fullName.trim().split(/\s+/);

  return {
    id: conversationId,
    name: fullName,
    isSupport: false,
    department: 1,
    other_user: {
      id: sellerInfo.id,
      name: nameParts[0] || fullName,
      family: nameParts.slice(1).join(" ") || sellerInfo.family || "",
    },
  };
}

export const CONVERSATION_SHELL_HISTORY_KEY = "conversationShell";

/** Sync chat URL without Next.js navigation (avoids remounting the support page). */
export function pushConversationHistory(conversationId, { tab } = {}) {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  params.set("conversationId", String(conversationId));
  if (tab) params.set("tab", tab);

  const path = window.location.pathname.startsWith("/support")
    ? window.location.pathname
    : "/support";
  const url = `${path}?${params.toString()}`;

  window.history.pushState(
    {
      ...(window.history.state || {}),
      [CONVERSATION_SHELL_HISTORY_KEY]: true,
    },
    "",
    url,
  );
}

/**
 * Clear chat URL. Uses history.back when we pushed a shell entry,
 * otherwise replaceState so the underlying page stays mounted.
 */
export function dismissConversationHistory() {
  if (typeof window === "undefined") return "none";

  if (window.history.state?.[CONVERSATION_SHELL_HISTORY_KEY]) {
    window.history.back();
    return "back";
  }

  const params = new URLSearchParams(window.location.search);
  if (!params.has("conversationId")) return "none";

  params.delete("conversationId");
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;

  window.history.replaceState(window.history.state || {}, "", url);
  return "replace";
}
