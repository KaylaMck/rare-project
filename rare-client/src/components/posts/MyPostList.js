import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getMyPosts } from "../../managers/PostManager"

export const MyPostList = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getMyPosts().then(setPosts)
  }, [])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">My Posts</h2>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Published</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </td>
              <td>{post.user.username}</td>
              <td>{post.category ? post.category.label : "—"}</td>
              <td>{post.publication_date}</td>
              <td>{post.approved ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
