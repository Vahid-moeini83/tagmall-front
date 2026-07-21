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
