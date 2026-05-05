import { API, authHeader } from "./api"

export const loginUser = (user) => {
  return fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      username: user.username,
      password: user.password
    })
  }).then(res => res.json())
}

export const registerUser = (newUser) => {
  return fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newUser)
  }).then(res => res.json())
}

export const getMe = () => {
  return fetch(`${API}/me`, {
    headers: authHeader()
  }).then(res => res.json())
}
