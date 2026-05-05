import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUnapprovedPosts, approvePost } from "../../managers/PostManager"

export const UnapprovedPostList = () => {
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  const loadPosts = () => {
    getUnapprovedPosts().then(setPosts)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleApprove = (postId) => {
    approvePost(postId).then(loadPosts)
  }

  return (
    <div className="container mt-4">
      <h2 className="title is-3">Unapproved Posts</h2>
      {posts.length === 0
        ? <p>No posts awaiting approval.</p>
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
                      className="button is-success is-small"
                      onClick={() => handleApprove(post.id)}
                    >
                      Approve
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
