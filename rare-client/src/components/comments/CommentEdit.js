import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getComment, updateComment } from "../../managers/CommentManager"

export const CommentEdit = () => {
  const { commentId } = useParams()
  const [comment, setComment] = useState(null)
  const subjectRef = useRef()
  const contentRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getComment(commentId).then(setComment)
  }, [commentId])

  const handleSave = (e) => {
    e.preventDefault()
    updateComment(commentId, {
      subject: subjectRef.current.value,
      content: contentRef.current.value,
    }).then(() => navigate(`/posts/${comment.post}`))
  }

  if (!comment) return <p className="p-4">Loading...</p>

  return (
    <section className="section">
      <h1 className="title">Edit Comment</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Subject</label>
          <div className="control">
            <input className="input" type="text" ref={subjectRef} defaultValue={comment.subject} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Content</label>
          <div className="control">
            <textarea className="textarea" ref={contentRef} defaultValue={comment.content} required />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" type="submit">Save</button>
          <button className="button" type="button" onClick={() => navigate(`/posts/${comment.post}`)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
