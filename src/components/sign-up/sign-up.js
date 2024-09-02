import { React, useContext } from 'react'
import { Button, Checkbox } from 'antd'
import { Link } from 'react-router-dom'

import { appContext } from '../../utilities'

import stl from './sign-up.module.scss'

function SignUp() {
  const apiClientInstance = useContext(appContext)

  apiClientInstance.createNewUser({ username: 'Ollsll', email: 'fadvbfa@.mail.com', password: 'Ollsll12' })

  const onCheckboxChange = (e) => {
    console.log(`checked = ${e.target.checked}`)
  }

  return (
    <form className={stl.body}>
      <div className={stl.title}>Create new account</div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Username</div>
        <input className={stl.input} placeholder="Username" />
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Email address</div>
        <input className={stl.input} placeholder="Email address" />
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Password</div>
        <input type="password" className={stl.input} placeholder="Password" />
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Repeat Password</div>
        <input type="password" className={stl.input} placeholder="Password" />
      </div>
      <Checkbox className={stl['agree-message']} onChange={onCheckboxChange}>
        I agree to the processing of my personal information
      </Checkbox>
      <Button type="primary" block className={stl['submit-btn']}>
        Create
      </Button>
      <div className={stl.message}>
        Already have an account?{' '}
        <Link to="sign-in" className={stl.link}>
          Sign In
        </Link>
      </div>
    </form>
  )
}

export default SignUp
