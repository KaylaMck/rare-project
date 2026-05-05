import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPostsByCategory } from "../../managers/PostManager"

export const PostsByCategory = () => {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPostsByCategory(categoryId).then(data => {
      setCategory(data.category)
      setPosts(data.posts)
    })
  }, [categoryId])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">
        Posts in: {category ? category.label : "..."}
      </h2>
      <Link to="/categories" className="button is-light mb-4">Back to Categories</Link>
      {posts.length === 0 ? (
        <p>No approved posts in this category yet.</p>
      ) : (
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.user.username}</td>
                <td>{post.publication_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
