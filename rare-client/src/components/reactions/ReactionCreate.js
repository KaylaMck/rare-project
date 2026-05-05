import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { createReaction } from "../../managers/ReactionManager"

export const ReactionCreate = () => {
  const labelRef = useRef()
  const imageUrlRef = useRef()
  const navigate = useNavigate()

  const handleSave = (e) => {
    e.preventDefault()
    createReaction({ label: labelRef.current.value, image_url: imageUrlRef.current.value })
      .then(() => navigate("/posts"))
  }

  return (
    <section className="section">
      <h1 className="title">Create Reaction</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Label</label>
          <div className="control">
            <input className="input" type="text" ref={labelRef} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Emoji</label>
          <div className="control">
            <input className="input" type="text" ref={imageUrlRef} placeholder="e.g. 😊" required />
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
