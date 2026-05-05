import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getTags, deleteTag } from "../../managers/TagManager"

export const TagList = () => {
  const [tags, setTags] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getTags().then(setTags)
  }, [])

  const handleDelete = (tag) => {
    if (window.confirm(`Are you sure you want to delete the tag "${tag.label}"?`)) {
      deleteTag(tag.id).then(() => getTags().then(setTags))
    }
  }

  return (
    <section className="section">
      <h1 className="title">Tag Management</h1>
      <button className="button is-primary mb-4" onClick={() => navigate("/tags/new")}>
        Create Tag
      </button>
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            {tag.label}
            <button
              className="button is-small is-warning ml-3"
              onClick={() => navigate(`/tags/${tag.id}/edit`)}
            >
              Edit
            </button>
            <button
              className="button is-small is-danger ml-2"
              onClick={() => handleDelete(tag)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
