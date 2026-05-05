import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"
import Logo from "./rare.jpeg"

export const NavBar = ({ token, setToken, isAdmin }) => {
  const navigate = useNavigate()
  const navbar = useRef()
  const hamburger = useRef()
  const [searchQuery, setSearchQuery] = useState("")
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/posts/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  useEffect(() => {
    const close = () => setAdminDropdownOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const showMobileNavbar = () => {
    hamburger.current.classList.toggle('is-active')
    navbar.current.classList.toggle('is-active')
  }

  return (
    <nav className="navbar is-success mb-3" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src={Logo} height="3rem" alt="Rare Logo" /> <h1 className="title is-4">Rare Publishing</h1>
        </a>

        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={showMobileNavbar} ref={hamburger}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu" ref={navbar}>
        <div className="navbar-start">
          {
            token
              ?
              <>
                <Link to="/posts" className="navbar-item">Posts</Link>
                <Link to="/posts/new" className="navbar-item">New Post</Link>
                <Link to="/myposts" className="navbar-item">My Posts</Link>
                {isAdmin && (
                  <div className={`navbar-item has-dropdown${adminDropdownOpen ? ' is-active' : ''}`}>
                    <a className="navbar-link" onClick={(e) => { e.stopPropagation(); setAdminDropdownOpen(o => !o) }}>
                      Admin
                    </a>
                    <div className="navbar-dropdown">
                      <Link to="/tags" className="navbar-item" onClick={() => setAdminDropdownOpen(false)}>Tag Management</Link>
                      <Link to="/categories" className="navbar-item" onClick={() => setAdminDropdownOpen(false)}>Category Management</Link>
                      <Link to="/profiles" className="navbar-item" onClick={() => setAdminDropdownOpen(false)}>User Profiles</Link>
                      <hr className="navbar-divider" />
                      <Link to="/unapprovedposts" className="navbar-item" onClick={() => setAdminDropdownOpen(false)}>Approve Posts</Link>
                      <Link to="/approvedposts" className="navbar-item" onClick={() => setAdminDropdownOpen(false)}>Unapprove Posts</Link>
                      <Link to="/demotionqueue" className="navbar-item" onClick={() => setAdminDropdownOpen(false)}>Pending Actions</Link>
                      <hr className="navbar-divider" />
                      <Link to="/reactions/new" className="navbar-item" onClick={() => setAdminDropdownOpen(false)}>Add Reaction</Link>
                    </div>
                  </div>
                )}
              </>
              :
              ""
          }
        </div>

        <div className="navbar-end">
          {token && (
            <div className="navbar-item">
              <form onSubmit={handleSearch} className="is-flex">
                <input
                  className="input"
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="button is-outlined ml-1">Search</button>
              </form>
            </div>
          )}
          <div className="navbar-item">
            <div className="buttons">
              {
                token
                  ?
                  <button className="button is-outlined" onClick={() => {
                    setToken(null)
                    navigate('/login')
                  }}>Logout</button>
                  :
                  <>
                    <Link to="/register" className="button is-link">Register</Link>
                    <Link to="/login" className="button is-outlined">Login</Link>
                  </>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
