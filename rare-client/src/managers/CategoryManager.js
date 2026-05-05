import { API, authHeader } from "./api"

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getCategory = (id) => {
  return fetch(`${API}/categories/${id}`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const createCategory = (category) => {
  return fetch(`${API}/categories`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(category)
  }).then(res => res.json())
}

export const updateCategory = (id, category) => {
  return fetch(`${API}/categories/${id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(category)
  }).then(res => res.json())
}

export const deleteCategory = (id) => {
  return fetch(`${API}/categories/${id}`, {
    method: "DELETE",
    headers: authHeader()
  })
}
