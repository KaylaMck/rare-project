import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPostsByTag } from "../../managers/PostManager"

export const PostsByTag = () => {
  const { tagId } = useParams()
  const [tag, setTag] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPostsByTag(tagId).then(data => {
      setTag(data.tag)
      setPosts(data.posts)
    })
  }, [tagId])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">
        Posts tagged: {tag ? tag.label : "..."}
      </h2>
      <Link to="/posts" className="button is-light mb-4">Back to Posts</Link>
      {posts.length === 0 ? (
        <p>No approved posts with this tag yet.</p>
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
