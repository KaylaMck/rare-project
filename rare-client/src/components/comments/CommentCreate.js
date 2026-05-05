import { useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createComment } from "../../managers/CommentManager"

export const CommentCreate = () => {
  const { postId } = useParams()
  const subjectRef = useRef()
  const contentRef = useRef()
  const navigate = useNavigate()

  const handleSave = (e) => {
    e.preventDefault()
    createComment(postId, {
      subject: subjectRef.current.value,
      content: contentRef.current.value,
    }).then(() => navigate(`/posts/${postId}`))
  }

  return (
    <section className="section">
      <h1 className="title">Add Comment</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Subject</label>
          <div className="control">
            <input className="input" type="text" ref={subjectRef} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Content</label>
          <div className="control">
            <textarea className="textarea" ref={contentRef} required />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" type="submit">Save</button>
          <button className="button" type="button" onClick={() => navigate(`/posts/${postId}`)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
