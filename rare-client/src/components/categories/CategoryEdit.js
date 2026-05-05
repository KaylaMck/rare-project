import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getCategory, updateCategory } from "../../managers/CategoryManager"

export const CategoryEdit = () => {
  const { categoryId } = useParams()
  const labelRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getCategory(categoryId).then(category => {
      labelRef.current.value = category.label
    })
  }, [categoryId])

  const handleSave = (e) => {
    e.preventDefault()
    updateCategory(categoryId, { label: labelRef.current.value })
      .then(() => navigate("/categories"))
  }

  return (
    <section className="section">
      <h1 className="title">Edit Category</h1>
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
