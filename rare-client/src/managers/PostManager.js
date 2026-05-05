import { API, authHeader } from "./api"

export const getAllPosts = () => {
  return fetch(`${API}/posts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getPost = (postId) => {
  return fetch(`${API}/posts/${postId}`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const createPost = (post) => {
  return fetch(`${API}/posts`, {
    method: "POST",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  }).then(res => res.json())
}

export const getSubscribedPosts = () => {
  return fetch(`${API}/subscribedposts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getMyPosts = () => {
  return fetch(`${API}/myposts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const updatePost = (postId, post) => {
  return fetch(`${API}/posts/${postId}`, {
    method: "PUT",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post)
  }).then(res => res.json())
}

export const deletePost = (postId) => {
  return fetch(`${API}/posts/${postId}`, {
    method: "DELETE",
    headers: authHeader()
  })
}

export const getPostsByCategory = (categoryId) => {
  return fetch(`${API}/categories/${categoryId}/posts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getPostsByTag = (tagId) => {
  return fetch(`${API}/tags/${tagId}/posts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getPostsByUser = (userId) => {
  return fetch(`${API}/profiles/${userId}/posts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getUnapprovedPosts = () => {
  return fetch(`${API}/unapprovedposts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const approvePost = (postId) => {
  return fetch(`${API}/posts/${postId}/approve`, {
    method: "PUT",
    headers: authHeader()
  }).then(res => res.json())
}

export const unapprovePost = (postId) => {
  return fetch(`${API}/posts/${postId}/unapprove`, {
    method: "PUT",
    headers: authHeader()
  }).then(res => res.json())
}

export const getApprovedPosts = () => {
  return fetch(`${API}/approvedposts`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const searchPosts = (q, author) => {
  const params = new URLSearchParams()
  if (q) params.set("q", q)
  if (author) params.set("author", author)
  return fetch(`${API}/posts/search?${params}`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const uploadPostImage = (postId, formData) => {
  return fetch(`${API}/posts/${postId}/image`, {
    method: "PUT",
    headers: authHeader(),
    body: formData
  }).then(res => res.json())
}

export const updatePostTags = (postId, tagIds) => {
  return fetch(`${API}/posts/${postId}/tags`, {
    method: "PUT",
    headers: {
      ...authHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tag_ids: tagIds })
  }).then(res => res.json())
}
