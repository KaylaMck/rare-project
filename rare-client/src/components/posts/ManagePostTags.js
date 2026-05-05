import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getPost, updatePostTags } from "../../managers/PostManager"
import { getTags } from "../../managers/TagManager"

export const ManagePostTags = () => {
  const { postId } = useParams()
  const [allTags, setAllTags] = useState([])
  const [selectedTagIds, setSelectedTagIds] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getTags(), getPost(postId)]).then(([tags, post]) => {
      setAllTags(tags)
      setSelectedTagIds(new Set(post.tags.map(t => t.id)))
    })
  }, [postId])

  const toggleTag = (tagId) => {
    setSelectedTagIds(prev => {
      const next = new Set(prev)
      next.has(tagId) ? next.delete(tagId) : next.add(tagId)
      return next
    })
  }

  const handleSave = () => {
    updatePostTags(postId, [...selectedTagIds]).then(() => {
      navigate(`/posts/${postId}`)
    })
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Manage Tags</h1>
        <div className="mb-4">
          {allTags.map(tag => (
            <label key={tag.id} className="checkbox mr-4 mb-2" style={{ display: "block" }}>
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedTagIds.has(tag.id)}
                onChange={() => toggleTag(tag.id)}
              />
              {tag.label}
            </label>
          ))}
        </div>
        <div className="buttons">
          <button className="button is-primary" onClick={handleSave}>
            Save
          </button>
          <button className="button" onClick={() => navigate(`/posts/${postId}`)}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  )
}
