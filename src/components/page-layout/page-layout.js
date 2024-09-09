import { React } from 'react'
import { Outlet } from 'react-router-dom'

import Header from '../header'

import stl from './page-layout.module.scss'

function PageLayout() {
  return (
    <div className={stl.wrapper}>
      <Header />
      <div className={stl.main}>
        <Outlet />
      </div>
    </div>
  )
}

export default PageLayout
