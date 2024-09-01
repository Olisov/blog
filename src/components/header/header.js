import { React } from 'react'
import { Link } from 'react-router-dom'

import stl from './header.module.scss'

function Header() {
  return (
    <header className={stl.body}>
      <span>Realworld Blog</span>
      <div className={stl['link-group']}>
        <Link to="sign-in" className={stl.link}>
          Sign In
        </Link>
        <Link to="sign-up" className={stl.link}>
          Sign Up
        </Link>
      </div>
    </header>
  )
}

export default Header
