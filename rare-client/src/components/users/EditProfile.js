import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProfile, updateProfile } from "../../managers/UserManager"

export const EditProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const currentUserId = localStorage.getItem("current_user_id")
  const [profile, setProfile] = useState(null)
  const [usernameError, setUsernameError] = useState(null)
  const usernameRef = useRef(null)
  const firstNameRef = useRef(null)
  const lastNameRef = useRef(null)
  const bioRef = useRef(null)

  useEffect(() => {
    if (String(userId) !== String(currentUserId)) {
      navigate(`/profiles/${userId}`)
      return
    }
    getProfile(userId).then(data => setProfile(data))
  }, [userId])

  const handleSubmit = (e) => {
    e.preventDefault()
    setUsernameError(null)
    updateProfile(userId, {
      username: usernameRef.current.value,
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      bio: bioRef.current.value,
    }).then(data => {
      if (Array.isArray(data.username)) {
        setUsernameError(data.username[0])
      } else {
        navigate(`/profiles/${userId}`)
      }
    })
  }

  if (!profile) return null

  return (
    <div className="container">
      <div className="box mt-5" style={{ maxWidth: 480 }}>
        <h2 className="title is-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Display Name</label>
            <div className="control">
              <input
                className={`input${usernameError ? " is-danger" : ""}`}
                type="text"
                defaultValue={profile.username}
                ref={usernameRef}
              />
            </div>
            {usernameError && <p className="help is-danger">{usernameError}</p>}
          </div>
          <div className="field">
            <label className="label">First Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                defaultValue={profile.first_name}
                ref={firstNameRef}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Last Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                defaultValue={profile.last_name}
                ref={lastNameRef}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Bio</label>
            <div className="control">
              <textarea
                className="textarea"
                defaultValue={profile.bio || ""}
                ref={bioRef}
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-link" type="submit">Save</button>
            </div>
            <div className="control">
              <button
                className="button is-light"
                type="button"
                onClick={() => navigate(`/profiles/${userId}`)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
