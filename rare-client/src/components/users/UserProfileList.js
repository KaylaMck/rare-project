import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getProfiles, deactivateUser, reactivateUser, getDemotionQueue } from "../../managers/UserManager"

export const UserProfileList = () => {
  const [profiles, setProfiles] = useState([])
  const [showDeactivated, setShowDeactivated] = useState(false)
  const [demotionQueue, setDemotionQueue] = useState([])
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const navigate = useNavigate()
  const currentUserId = parseInt(localStorage.getItem('current_user_id'))

  const loadData = () => {
    Promise.all([getProfiles(), getDemotionQueue()]).then(([profileData, queueData]) => {
      setProfiles(profileData)
      setDemotionQueue(queueData)
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeactivate = (e, profile) => {
    e.stopPropagation()
    const pendingVote = demotionQueue.find(
      item => item.action === `deactivate:${profile.id}` && item.initiated_by_id === currentUserId
    )
    if (pendingVote) {
      setError('You have already voted to deactivate this admin. A second admin must also approve.')
      return
    }
    if (!window.confirm(`Deactivate ${profile.username}? They will no longer be able to log in.`)) return
    deactivateUser(profile.id).then(res => {
      if (res.status === 202) {
        res.json().then(data => {
          setError(null)
          setInfo(data.message)
          loadData()
        })
      } else if (res.ok) {
        setError(null)
        setInfo(null)
        loadData()
      } else {
        res.json().then(data => setError(data.error))
      }
    })
  }

  const handleReactivate = (e, profile) => {
    e.stopPropagation()
    reactivateUser(profile.id).then(() => loadData())
  }

  const getDeactivatePendingVotes = (profileId) => {
    return demotionQueue.filter(item => item.action === `deactivate:${profileId}`)
  }

  const displayed = profiles.filter(p => showDeactivated ? !p.is_active : p.is_active)

  return (
    <div className="container">
      {error && (
        <div className="notification is-danger">
          {error}
        </div>
      )}
      {info && (
        <div className="notification is-info">
          {info}
          {" "}<button className="button is-small is-light ml-2" onClick={() => navigate('/demotionqueue')}>View Pending Actions</button>
        </div>
      )}
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h1 className="title mb-0">User Profiles</h1>
        <div className="buttons">
          {demotionQueue.length > 0 && (
            <button className="button is-warning" onClick={() => navigate('/demotionqueue')}>
              Pending Actions ({demotionQueue.length})
            </button>
          )}
          <button
            className="button is-light"
            onClick={() => setShowDeactivated(!showDeactivated)}
          >
            {showDeactivated ? "View Active" : "View Deactivated"}
          </button>
        </div>
      </div>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Display Name</th>
            <th>User Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {displayed.map(profile => {
            const pendingVotes = getDeactivatePendingVotes(profile.id)
            const alreadyVoted = pendingVotes.some(v => v.initiated_by_id === currentUserId)
            return (
              <tr
                key={profile.id}
                onClick={() => navigate(`/profiles/${profile.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{profile.full_name}</td>
                <td>{profile.username}</td>
                <td>
                  {profile.user_type}
                  {pendingVotes.length > 0 && (
                    <span className="tag is-warning ml-2">Deactivation Pending</span>
                  )}
                </td>
                <td>
                  <div className="buttons are-small">
                    {!showDeactivated && (
                      <button
                        className="button is-info"
                        onClick={(e) => { e.stopPropagation(); navigate(`/profiles/${profile.id}/edit-type`) }}
                      >
                        Edit
                      </button>
                    )}
                    {showDeactivated ? (
                      <button
                        className="button is-success"
                        onClick={(e) => handleReactivate(e, profile)}
                      >
                        Reactivate
                      </button>
                    ) : (
                      profile.user_type === 'Admin' && alreadyVoted ? (
                        <button className="button is-warning" disabled>
                          Voted (1/2)
                        </button>
                      ) : profile.user_type === 'Admin' && pendingVotes.length > 0 ? (
                        <button
                          className="button is-danger"
                          onClick={(e) => handleDeactivate(e, profile)}
                        >
                          Approve Deactivation
                        </button>
                      ) : (
                        <button
                          className="button is-danger"
                          onClick={(e) => handleDeactivate(e, profile)}
                        >
                          Deactivate
                        </button>
                      )
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
