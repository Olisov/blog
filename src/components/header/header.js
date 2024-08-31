import { React } from 'react'
import { Link } from 'react-router-dom'

import stl from './header.module.scss'

function Header() {
  return (
    <header className={stl.body}>
      <span>Realworld blog</span>
      <div className={stl['link-group']}>
        <Link to="sign-in-page" className={stl.link}>
          Sign In
        </Link>
        <Link to="sign-up-page" className={stl.link}>
          Sign Up
        </Link>
      </div>
    </header>
  )
}

export default Header
