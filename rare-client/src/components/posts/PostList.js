import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getAllPosts, getMyPosts } from "../../managers/PostManager"
import { getCategories } from "../../managers/CategoryManager"
import { getTags } from "../../managers/TagManager"

export const PostList = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getAllPosts(), getMyPosts(), getCategories(), getTags()]).then(
      ([approved, mine, cats, allTags]) => {
        const pending = mine.filter(p => !p.approved)
        setPosts([...pending, ...approved])
        setCategories(cats)
        setTags(allTags)
      }
    )
  }, [])

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category && post.category.id === parseInt(selectedCategory))
    : posts

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">Posts</h2>
      <div className="is-flex is-gap-4 mb-4" style={{ gap: "1rem" }}>
        <div className="field">
          <div className="control">
            <div className="select">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <div className="select">
              <select value="" onChange={e => { if (e.target.value) navigate(`/tags/${e.target.value}/posts`) }}>
                <option value="">Filter by Tag</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="columns is-multiline">
        {filteredPosts.map(post => (
          <div key={post.id} className="column is-4-desktop is-6-tablet">
            <div className="card is-flex is-flex-direction-column" style={{ height: "100%" }}>
              <div className="card-header">
                <p className="card-header-title">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </p>
                {!post.approved && (
                  <div className="card-header-icon">
                    <span className="tag is-warning">Pending Review</span>
                  </div>
                )}
              </div>
              <div className="card-content is-flex-grow-1">
                <p className="is-size-7 has-text-grey mb-2">
                  By {post.user.full_name || post.user.username}
                </p>
                <p className="content is-size-6">{post.content_excerpt}</p>
                {post.category && (
                  <span className="tag is-info is-light">{post.category.label}</span>
                )}
              </div>
              <footer className="card-footer">
                <span className="card-footer-item has-text-grey is-size-7">{post.publication_date}</span>
                <span className="card-footer-item has-text-grey is-size-7">{post.comment_count} comments</span>
                <span className="card-footer-item has-text-grey is-size-7">{post.reaction_count} reactions</span>
              </footer>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
