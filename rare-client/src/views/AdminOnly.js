import { Navigate, Outlet } from "react-router-dom"

export const AdminOnly = ({ isAdmin }) => {
  if (isAdmin) {
    return <Outlet />
  }
  return <Navigate to="/" replace />
}
