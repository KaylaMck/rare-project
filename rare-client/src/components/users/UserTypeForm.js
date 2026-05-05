import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProfile, changeUserType } from "../../managers/UserManager"

export const UserTypeForm = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userType, setUserType] = useState("Author")
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    getProfile(userId).then(profile => {
      setUserType(profile.user_type)
    })
  }, [userId])

  const handleSave = (e) => {
    e.preventDefault()
    changeUserType(userId, userType).then(res => {
      if (res.status === 202) {
        res.json().then(data => setInfo(data.message))
      } else if (res.ok) {
        navigate("/profiles")
      } else {
        res.json().then(data => setError(data.error))
      }
    })
  }

  return (
    <section className="section">
      <h1 className="title">Edit User Type</h1>
      {error && (
        <div className="notification is-danger">
          {error}
        </div>
      )}
      {info && (
        <div className="notification is-info">
          {info}{" "}
          <button className="button is-small is-light ml-2" onClick={() => navigate('/demotionqueue')}>View Pending Actions</button>
        </div>
      )}
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">User Type</label>
          <div className="control">
            <div className="select">
              <select value={userType} onChange={e => setUserType(e.target.value)}>
                <option value="Author">Author</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" type="submit">Save</button>
          <button className="button" type="button" onClick={() => navigate("/profiles")}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
