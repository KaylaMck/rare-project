import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPostsByUser } from "../../managers/PostManager"
import { getProfile } from "../../managers/UserManager"

export const UserPostList = () => {
  const { userId } = useParams()
  const [posts, setPosts] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    getProfile(userId).then(setProfile)
    getPostsByUser(userId).then(setPosts)
  }, [userId])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">
        Posts by {profile ? profile.username : "..."}
      </h2>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </td>
              <td>{post.category ? post.category.label : "—"}</td>
              <td>{post.publication_date}</td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan="3">No posts yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
