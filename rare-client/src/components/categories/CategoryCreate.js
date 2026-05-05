import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { createCategory } from "../../managers/CategoryManager"

export const CategoryCreate = () => {
  const labelRef = useRef()
  const navigate = useNavigate()

  const handleSave = (e) => {
    e.preventDefault()
    createCategory({ label: labelRef.current.value })
      .then(() => navigate("/categories"))
  }

  return (
    <section className="section">
      <h1 className="title">Create Category</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input className="input" type="text" ref={labelRef} required />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" type="submit">Save</button>
          <button className="button" type="button" onClick={() => navigate("/categories")}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
