import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getCategories, deleteCategory } from "../../managers/CategoryManager"

export const CategoryList = () => {
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.label}"?`)) {
      deleteCategory(category.id).then(() => {
        navigate("/categories")
        getCategories().then(setCategories)
      })
    }
  }

  return (
    <section className="section">
      <h1 className="title">Category Management</h1>
      <button
        className="button is-primary mb-4"
        onClick={() => navigate("/categories/new")}
      >
        Create Category
      </button>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            <Link to={`/categories/${category.id}/posts`}>{category.label}</Link>
            <button
              className="button is-small is-warning ml-3"
              onClick={() => navigate(`/categories/${category.id}/edit`)}
            >
              Edit
            </button>
            <button
              className="button is-small is-danger ml-2"
              onClick={() => handleDelete(category)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
