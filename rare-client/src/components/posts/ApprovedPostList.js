import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getApprovedPosts, unapprovePost } from "../../managers/PostManager"

export const ApprovedPostList = () => {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  const loadPosts = () => {
    getApprovedPosts().then(setPosts)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleUnapprove = (postId) => {
    unapprovePost(postId).then(loadPosts)
  }

  return (
    <div className="container mt-4">
      <h2 className="title is-3">Approved Posts</h2>
      {posts.length === 0
        ? <p>No approved posts.</p>
        : (
          <table className="table is-fullwidth is-striped is-hoverable">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <span
                      className="has-text-link is-clickable"
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      {post.title}
                    </span>
                  </td>
                  <td>{post.user.username}</td>
                  <td>{post.category?.label ?? "—"}</td>
                  <td>{post.publication_date}</td>
                  <td>
                    <button
                      className="button is-warning is-small"
                      onClick={() => handleUnapprove(post.id)}
                    >
                      Unapprove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  )
}
