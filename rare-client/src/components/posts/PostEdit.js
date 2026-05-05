import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getPost, updatePost, uploadPostImage } from "../../managers/PostManager"
import { getCategories } from "../../managers/CategoryManager"

export const PostEdit = () => {
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [categories, setCategories] = useState([])
  const titleRef = useRef()
  const categoryRef = useRef()
  const fileRef = useRef()
  const contentRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getPost(postId).then(setPost)
    getCategories().then(setCategories)
  }, [postId])

  const handleSave = (e) => {
    e.preventDefault()
    updatePost(postId, {
      title: titleRef.current.value,
      category_id: parseInt(categoryRef.current.value),
      image_url: post.image_url,
      content: contentRef.current.value,
    }).then(() => {
      const file = fileRef.current.files[0]
      if (file) {
        const formData = new FormData()
        formData.append("image", file)
        uploadPostImage(postId, formData).then(() => navigate(`/posts/${postId}`))
      } else {
        navigate(`/posts/${postId}`)
      }
    })
  }

  if (!post || categories.length === 0) return <p className="p-4">Loading...</p>

  return (
    <section className="section">
      <h1 className="title">Edit Post</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Title</label>
          <div className="control">
            <input className="input" type="text" ref={titleRef} defaultValue={post.title} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Category</label>
          <div className="control">
            <div className="select">
              <select ref={categoryRef} defaultValue={post.category?.id ?? ""} required>
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Header Image</label>
          {post.image_url && (
            <figure className="image mb-2" style={{ maxWidth: 300 }}>
              <img src={post.image_url} alt="Current header" />
            </figure>
          )}
          <div className="control">
            <input className="input" type="file" accept="image/*" ref={fileRef} />
          </div>
          <p className="help">Upload a new image to replace the current one.</p>
        </div>
        <div className="field">
          <label className="label">Content</label>
          <div className="control">
            <textarea className="textarea" ref={contentRef} defaultValue={post.content} required />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" type="submit">Save</button>
          <button className="button" type="button" onClick={() => navigate("/posts")}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
