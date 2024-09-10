import { React, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'

import { asyncAuthRequest, resetAuthErrorsList } from '../../store/slices'
import { appContext } from '../../utilities'

import stl from './sign-in.module.scss'

function SignIn() {
  const apiClientInstance = useContext(appContext)
  const { isLoading, authErrorsList, authRequestError, userName, email, tokenJWT, avatarImg } = useSelector(
    (state) => state.authState
  )
  const dispatch = useDispatch()

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({ mode: 'onBlur' })

  const onSubmit = (formData) => {
    dispatch(
      asyncAuthRequest({
        apiClientInstance,
        regData: {
          email: formData.email,
          password: formData.password,
        },
      })
    )
  }
  useEffect(() => {
    if (Object.keys(authErrorsList).length > 0) dispatch(resetAuthErrorsList())
    if (tokenJWT) {
      localStorage.setItem('tokenJWT', tokenJWT)
      reset()
    }
  }, [authErrorsList, tokenJWT])

  if (tokenJWT && !isLoading && !authRequestError) return <Navigate to="/articles" replace />

  if (authErrorsList.email) errors.email = { message: authErrorsList.email }
  if (authErrorsList.password) errors.password = { message: authErrorsList.password }
  else if (authErrorsList['email or password']) {
    errors.email = { message: `email or password ${authErrorsList['email or password']}` }
    errors.password = { message: `email or password ${authErrorsList['email or password']}` }
  }

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage = authRequestError && !isLoading ? <Alert message={authRequestError} banner type="error" /> : null

  return (
    <form className={stl.body} onSubmit={handleSubmit(onSubmit)}>
      {/* {tokenJWT ? <Navigate to="/" replace /> : null} */}
      <div className={stl.title}>Sign In</div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Email address</div>
        <input
          className={errors.email ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          type="text"
          {...register('email', {
            required: 'This field is required!',
            pattern: {
              value: /^[a-z]\S+@\S+\.\S+$/,
              message: 'Should be correct email address email@mail.com ',
            },
          })}
          placeholder="Email address"
        />
        {errors.email ? <div className={stl['incorrect-message']}>{errors.email.message}</div> : null}
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Password</div>
        <input
          type="password"
          className={errors.password ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          {...register('password', {
            required: 'This field is required!',
            minLength: {
              value: 6,
              message: 'Minimum length 6 characters',
            },
            maxLength: {
              value: 20,
              message: 'Maximum length 40 characters',
            },
          })}
          placeholder="Password"
        />
        {errors.password ? <div className={stl['incorrect-message']}>{errors.password.message}</div> : null}
      </div>
      {loadingSpinner}
      {errorMessage}
      <Button type="primary" htmlType="submit" disabled={!isValid} block className={stl['submit-btn']}>
        Login
      </Button>
      <div className={stl.message}>
        Don’t have an account?{' '}
        <Link to="sign-up" className={stl.link}>
          Sign Up.
        </Link>
      </div>
    </form>
  )
}

export default SignIn
