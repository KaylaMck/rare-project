import { API, authHeader } from "./api"

export const getTags = () => {
  return fetch(`${API}/tags`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getTag = (id) => {
  return fetch(`${API}/tags/${id}`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const createTag = (label) => {
  return fetch(`${API}/tags`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ label })
  }).then(res => res.json())
}

export const updateTag = (id, label) => {
  return fetch(`${API}/tags/${id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ label })
  }).then(res => res.json())
}

export const deleteTag = (id) => {
  return fetch(`${API}/tags/${id}`, {
    method: "DELETE",
    headers: authHeader()
  })
}
