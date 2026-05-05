import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getDemotionQueue, cancelDemotionQueueItem, deactivateUser, changeUserType } from "../../managers/UserManager"

export const DemotionQueueList = () => {
  const [queue, setQueue] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const currentUserId = parseInt(localStorage.getItem('current_user_id'))

  const loadQueue = () => getDemotionQueue().then(data => setQueue(data))

  useEffect(() => {
    loadQueue()
  }, [])

  const handleApprove = (item) => {
    const action = item.action_type === 'deactivate'
      ? deactivateUser(item.target_id)
      : changeUserType(item.target_id, 'Author')

    action.then(res => {
      if (res.ok) {
        setError(null)
        loadQueue()
      } else {
        res.json().then(data => setError(data.error))
      }
    })
  }

  const handleCancel = (itemId) => {
    cancelDemotionQueueItem(itemId).then(res => {
      if (res.ok) {
        loadQueue()
      } else {
        res.json().then(data => setError(data.error))
      }
    })
  }

  return (
    <div className="container">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h1 className="title mb-0">Pending Admin Actions</h1>
        <button className="button is-light" onClick={() => navigate('/profiles')}>
          Back to Profiles
        </button>
      </div>
      {error && <div className="notification is-danger">{error}</div>}
      {queue.length === 0 ? (
        <p className="has-text-grey">No pending actions.</p>
      ) : (
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Target User</th>
              <th>Action</th>
              <th>Initiated By</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {queue.map(item => (
              <tr key={item.id}>
                <td>{item.target_username}</td>
                <td>
                  <span className={`tag ${item.action_type === 'deactivate' ? 'is-danger' : 'is-warning'}`}>
                    {item.action_type === 'deactivate' ? 'Deactivate' : 'Demote to Author'}
                  </span>
                </td>
                <td>{item.initiated_by}</td>
                <td>
                  <div className="buttons are-small">
                    {item.initiated_by_id !== currentUserId && (
                      <button
                        className="button is-primary"
                        onClick={() => handleApprove(item)}
                      >
                        Approve
                      </button>
                    )}
                    {item.initiated_by_id === currentUserId && (
                      <button
                        className="button is-light"
                        onClick={() => handleCancel(item.id)}
                      >
                        Withdraw Vote
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="notification is-info is-light mt-4">
        Admin deactivations and demotions require approval from two separate admins. Approving an action here casts your vote.
      </div>
    </div>
  )
}
