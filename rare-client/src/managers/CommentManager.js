import { API, authHeader } from "./api"

export const getPostComments = (postId) => {
  return fetch(`${API}/posts/${postId}/comments`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getComment = (commentId) => {
  return fetch(`${API}/comments/${commentId}`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const createComment = (postId, comment) => {
  return fetch(`${API}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(comment)
  }).then(res => res.json())
}

export const updateComment = (commentId, comment) => {
  return fetch(`${API}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(comment)
  }).then(res => res.json())
}

export const deleteComment = (commentId) => {
  return fetch(`${API}/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeader()
  })
}
