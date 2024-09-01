import { React } from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

import stl from './sign-in.module.scss'

function SignIn() {
  return (
    <form className={stl.body}>
      <div className={stl.title}>Sign In</div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Email address</div>
        <input className={stl.input} placeholder="Email addresses" />
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Password</div>
        <input className={stl.input} placeholder="Password" />
      </div>
      <Button type="primary" block className={stl['submit-btn']}>
        Login
      </Button>
      <div className={stl.message}>
        Don’t have an account?{' '}
        <Link to="sign-up" className={stl.link}>
          Sign Up
        </Link>
        .
      </div>
    </form>
  )
}

export default SignIn
