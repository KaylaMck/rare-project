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
        <div className="box mt-4">
          <p className="title is-5">Your subscription feed is empty</p>
          <p>
            This page shows the latest posts from authors you subscribe to. Once you
            follow someone, their new posts will appear here.
          </p>
          <p className="mt-3">
            Browse the <Link to="/posts">Posts page</Link> to discover authors and
            content you enjoy. You can subscribe to an author from any of their posts.
          </p>
          <Link to="/posts" className="button is-primary mt-4">
            Browse Posts
          </Link>
        </div>
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
