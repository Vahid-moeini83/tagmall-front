"use server";

import http from "@/app/api/axiosInstance";

// Get user chats list
export async function getConversations(token) {
  try {
    const response = await http({
      url: "/support/conversations",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { conversationsRes: response.data };
  } catch (err) {
    console.log("Error fetching conversations: ", err);
    return { conversationsErr: err };
  }
}

// Start a new chat or recover it
export async function createConversation(token, bodyData) {
  try {
    const response = await http({
      url: "/support/conversations",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    return { createConversationRes: response.data };
  } catch (err) {
    console.log("Error creating conversation: ", err);
    return { createConversationErr: err };
  }
}

// Get chat's messages
export async function getConversationMessages(token, conversationId) {
  try {
    const response = await http({
      url: `/support/conversations/${conversationId}/messages`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { messagesRes: response.data };
  } catch (err) {
    console.log("Error fetching messages: ", err);
    return { messagesErr: err };
  }
}

// Send a message in the chat
export async function sendMessage(token, conversationId, bodyData) {
  try {
    const response = await http({
      url: `/support/conversations/${conversationId}/messages`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: bodyData,
    });
    return { sendMessageRes: response.data };
  } catch (err) {
    console.log("Error sending message: ", err);
    return { sendMessageErr: err };
  }
}

// Delete a message from the chat
export async function deleteMessage(token, messageId) {
  try {
    const response = await http({
      url: `/support/messages/${messageId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteMessageRes: response.data };
  } catch (err) {
    console.log("Error deleting message: ", err);
    return { deleteMessageErr: err };
  }
}

// Delete a chat
export async function deleteConversations(token, bodyData) {
  try {
    const response = await http({
      url: `/support/conversations/delete-many`,
      method: "POST",
      data: bodyData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { deleteConversationRes: response.data };
  } catch (err) {
    console.log("Error deleting conversation: ", err);
    return { deleteConversationErr: err };
  }
}

// Get preset messages for a user
export async function getPresetMessages(token, userId) {
  try {
    const response = await http({
      url: `/support/users/preset-messages`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        user_id: userId,
      },
    });
    return { presetMessagesRes: response.data };
  } catch (err) {
    console.log("Error fetching preset messages: ", err);
    return { presetMessagesErr: err };
  }
}
