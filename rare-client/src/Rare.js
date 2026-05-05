import { useEffect, useState } from "react"
import { ApplicationViews } from "./views/ApplicationViews"
import { NavBar } from "./components/nav/NavBar"
import { getMe } from "./managers/AuthManager"


export const Rare = () => {
  const [token, setTokenState] = useState(localStorage.getItem('auth_token'))
  const [currentUserId, setCurrentUserId] = useState(
    parseInt(localStorage.getItem('current_user_id')) || null
  )
  const [isAdmin, setIsAdmin] = useState(false)

  const setToken = (newToken, userId = null, staffStatus = false) => {
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('current_user_id', userId)
      setTokenState(newToken)
      setCurrentUserId(userId)
      setIsAdmin(staffStatus)
    } else {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('current_user_id')
      setTokenState(null)
      setCurrentUserId(null)
      setIsAdmin(false)
    }
  }

  // On page refresh, re-derive isAdmin from the /me endpoint
  useEffect(() => {
    if (token) {
      getMe().then(user => {
        setCurrentUserId(user.id)
        setIsAdmin(user.is_staff)
      }).catch(() => {
        // Token is invalid — clear auth state
        setToken(null)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    <NavBar token={token} setToken={setToken} isAdmin={isAdmin} />
    <ApplicationViews token={token} setToken={setToken} isAdmin={isAdmin} />
  </>
}
