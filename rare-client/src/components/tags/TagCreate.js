import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { createTag } from "../../managers/TagManager"

export const TagCreate = () => {
  const labelRef = useRef()
  const navigate = useNavigate()

  const handleSave = (e) => {
    e.preventDefault()
    createTag(labelRef.current.value).then(() => navigate("/tags"))
  }

  return (
    <section className="section">
      <h1 className="title">Create Tag</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Tag Name</label>
          <div className="control">
            <input className="input" type="text" ref={labelRef} required />
          </div>
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">Save</button>
        </div>
      </form>
    </section>
  )
}
