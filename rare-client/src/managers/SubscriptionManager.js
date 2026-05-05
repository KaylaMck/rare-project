import { API, authHeader } from "./api"

export const subscribeToUser = (authorId) => {
  return fetch(`${API}/profiles/${authorId}/subscribe`, {
    method: "POST",
    headers: authHeader()
  }).then(res => res.json())
}

export const unsubscribeFromUser = (authorId) => {
  return fetch(`${API}/profiles/${authorId}/unsubscribe`, {
    method: "DELETE",
    headers: authHeader()
  }).then(res => res.json())
}
