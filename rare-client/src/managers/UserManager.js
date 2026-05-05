import { API, authHeader } from "./api"

export const getProfiles = () => {
  return fetch(`${API}/profiles`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const getProfile = (id) => {
  return fetch(`${API}/profiles/${id}`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const deactivateUser = (id) => {
  return fetch(`${API}/profiles/${id}/deactivate`, {
    method: "PUT",
    headers: authHeader()
  })
}

export const reactivateUser = (id) => {
  return fetch(`${API}/profiles/${id}/reactivate`, {
    method: "PUT",
    headers: authHeader()
  })
}

export const changeUserType = (id, userType) => {
  return fetch(`${API}/profiles/${id}/type`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ user_type: userType })
  })
}

export const getDemotionQueue = () => {
  return fetch(`${API}/demotionqueue`, {
    headers: authHeader()
  }).then(res => res.json())
}

export const cancelDemotionQueueItem = (id) => {
  return fetch(`${API}/demotionqueue/${id}`, {
    method: "DELETE",
    headers: authHeader()
  })
}

export const uploadProfileImage = (id, formData) => {
  return fetch(`${API}/profiles/${id}/image`, {
    method: "PUT",
    headers: authHeader(),
    body: formData
  }).then(res => res.json())
}
