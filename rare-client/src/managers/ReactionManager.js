import { API, authHeader } from "./api"

export const getReactions = () => {
  return fetch(`${API}/reactions`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const createReaction = (reaction) => {
  return fetch(`${API}/reactions`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(reaction)
  }).then(res => res.json())
}

export const getPostReactions = (postId) => {
  return fetch(`${API}/posts/${postId}/reactions`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const addPostReaction = (postId, reactionId) => {
  return fetch(`${API}/posts/${postId}/reactions`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ reaction_id: reactionId })
  })
}

export const removePostReaction = (postId, reactionId) => {
  return fetch(`${API}/posts/${postId}/reactions/${reactionId}`, {
    method: "DELETE",
    headers: authHeader()
  })
}
