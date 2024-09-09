import { React } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

import { resetUserAuthData } from '../../store/slices'
import defaultAva from '../../assets/default-ava.png'

import stl from './header.module.scss'

function Header() {
  const { userName, tokenJWT, avatarImg = defaultAva } = useSelector((state) => state.authState)
  const dispatch = useDispatch()

  function onLogOut() {
    localStorage.removeItem('userName')
    localStorage.removeItem('email')
    localStorage.removeItem('tokenJWT')
    localStorage.removeItem('avatarImg')

    dispatch(resetUserAuthData())
  }

  const linkGroup = !tokenJWT ? (
    <div className={stl['link-group']}>
      <Link to="/sign-in" className={stl.link}>
        Sign In
      </Link>
      <Link to="/sign-up" className={stl.link}>
        Sign Up
      </Link>
    </div>
  ) : (
    <div className={stl['link-group']}>
      <Link to="/new-article" className={stl['create-btn']}>
        Create article
      </Link>
      <Link to="/profile" className={stl.profile}>
        <span className={stl['profile-name']}>{userName}</span>
        <img className={stl['profile-img']} alt="Profile" src={avatarImg} />
      </Link>
      <Button className={stl.link} onClick={onLogOut}>
        Log Out
      </Button>
    </div>
  )
  return (
    <header className={stl.body}>
      <span>Realworld Blog</span>
      {linkGroup}
    </header>
  )
}

export default Header
