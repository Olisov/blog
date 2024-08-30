import { React } from 'react'
import { Button, ConfigProvider } from 'antd'

import stl from './header.module.scss'

function Header() {
  return (
    <header className={stl.header}>
      <span>Realworld blog</span>
      <div className={stl['btn-group']}>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                defaultHoverBorderColor: '#52C41A',
                defaultHoverColor: '#52C41A',
                defaultBorderColor: 'white',
              },
            },
          }}
        >
          <Button className={stl.btn}>Sign In</Button>
          <Button className={stl.btn}>Sign Up</Button>
        </ConfigProvider>
      </div>
    </header>
  )
}

export default Header
