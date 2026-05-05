import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createPost, uploadPostImage } from "../../managers/PostManager"
import { getCategories } from "../../managers/CategoryManager"

export const PostCreate = () => {
  const [categories, setCategories] = useState([])
  const [pendingPostId, setPendingPostId] = useState(null)
  const titleRef = useRef()
  const categoryRef = useRef()
  const fileRef = useRef()
  const contentRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    createPost({
      title: titleRef.current.value,
      category_id: parseInt(categoryRef.current.value),
      content: contentRef.current.value,
    }).then(post => {
      const file = fileRef.current.files[0]
      const finish = () => {
        if (!post.approved) {
          setPendingPostId(post.id)
        } else {
          navigate(`/posts/${post.id}`)
        }
      }
      if (file) {
        const formData = new FormData()
        formData.append("image", file)
        uploadPostImage(post.id, formData).then(finish)
      } else {
        finish()
      }
    })
  }

  if (pendingPostId) {
    return (
      <section className="section">
        <div className="container">
          <div className="notification is-warning">
            <p className="has-text-weight-semibold">Your post has been submitted for review.</p>
            <p>It will appear publicly once an admin approves it.</p>
          </div>
          <button className="button is-primary" onClick={() => navigate(`/posts/${pendingPostId}`)}>
            View Post
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <h1 className="title">New Post</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" type="text" ref={titleRef} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Category</label>
          <div className="control">
            <div className="select">
              <select ref={categoryRef} required>
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Header Image (optional)</label>
          <div className="control">
            <input className="input" type="file" accept="image/*" ref={fileRef} />
          </div>
        </div>
        <div className="field">
          <label className="label">Content</label>
          <div className="control">
            <textarea className="textarea" ref={contentRef} required />
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">Save</button>
        </div>
      </form>
    </section>
  )
}
