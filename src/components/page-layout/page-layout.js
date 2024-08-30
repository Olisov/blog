import { React } from 'react'
import { Link, Outlet } from 'react-router-dom'

import Header from '../header'

import stl from './page-layout.module.scss'

function PageLayout() {
  return (
    <div className={stl.wrapper}>
      <Header />
      <Outlet />
    </div>
  )
}

export default PageLayout
