import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getTag, updateTag } from "../../managers/TagManager"

export const TagEdit = () => {
  const { tagId } = useParams()
  const labelRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getTag(tagId).then(tag => {
      labelRef.current.value = tag.label
    })
  }, [tagId])

  const handleSave = (e) => {
    e.preventDefault()
    updateTag(tagId, labelRef.current.value).then(() => navigate("/tags"))
  }

  return (
    <section className="section">
      <h1 className="title">Edit Tag</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">Tag Name</label>
          <div className="control">
            <input className="input" type="text" ref={labelRef} required />
          </div>
        </div>
        <div className="control">
          <button className="button is-primary mr-2" type="submit">Save</button>
          <button className="button" type="button" onClick={() => navigate("/tags")}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
