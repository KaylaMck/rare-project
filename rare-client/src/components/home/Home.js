import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getSubscribedPosts } from "../../managers/PostManager"

export const Home = () => {
  const [subscribedPosts, setSubscribedPosts] = useState([])

  useEffect(() => {
    getSubscribedPosts().then(setSubscribedPosts)
  }, [])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">Posts from Subscriptions</h2>
      {subscribedPosts.length === 0 ? (
        <p>No posts from subscribed authors yet.</p>
      ) : (
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {subscribedPosts.map(post => (
              <tr key={post.id}>
                <td>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.user.username}</td>
                <td>{post.category ? post.category.label : "—"}</td>
                <td>{post.publication_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
