import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { searchPosts } from "../../managers/PostManager"

export const PostSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const query = searchParams.get("q") || ""
  const author = searchParams.get("author") || ""

  const queryRef = useRef(null)
  const authorRef = useRef(null)

  useEffect(() => {
    if (query || author) {
      searchPosts(query, author).then(setPosts)
    } else {
      setPosts([])
    }
  }, [query, author])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = queryRef.current.value.trim()
    const a = authorRef.current.value.trim()
    const next = {}
    if (q) next.q = q
    if (a) next.author = a
    setSearchParams(next)
  }

  const heading = () => {
    if (query && author) return `Posts by "${author}" matching "${query}"`
    if (author) return `Posts by "${author}"`
    if (query) return `Search results for "${query}"`
    return "Search posts"
  }

  return (
    <div className="container mt-4">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="field is-grouped">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Title"
              defaultValue={query}
              ref={queryRef}
            />
          </div>
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Author username"
              defaultValue={author}
              ref={authorRef}
            />
          </div>
          <div className="control">
            <button className="button is-link" type="submit">Search</button>
          </div>
        </div>
      </form>

      <h2 className="title is-4">{heading()}</h2>

      {(query || author) && posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.length > 0 && (
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
                  <td><Link to={`/posts/${post.id}`}>{post.title}</Link></td>
                  <td>{post.user.username}</td>
                  <td>{post.publication_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  )
}
