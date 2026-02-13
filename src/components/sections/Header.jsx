import React from 'react'
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className='header'>
      <div className="header-container">
        <div className="project-name-container">
        <h1 className='project-name'>Education Platform</h1>
        </div>

        <nav className='nav'>
        <Link className='nav-links' to="/">Home</Link>
        <Link className='nav-links' to="/create-course">Course Admin</Link>
        <Link className='nav-links' to="/create-lesson">Lesson Admin</Link>
        <Link className='nav-links' to="/create-instructor">Instructor Admin</Link>
        <Link className='nav-links' to="/create-participant">Participant Admin</Link>
        </nav>

      </div>
    </header>
  )
}

export default Header