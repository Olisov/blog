/* eslint-disable no-unused-expressions */
import { React, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Checkbox, Alert, Spin, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'

import { asyncCreateUserRequest, resetAuthErrorsList } from '../../store/slices'
import { appContext } from '../../utilities'

import stl from './sign-up.module.scss'

function SignUp() {
  const apiClientInstance = useContext(appContext)
  const dispatch = useDispatch()
  const { isLoading, authErrorsList, createUserRequestError, userName, email, tokenJWT } = useSelector(
    (state) => state.authState
  )
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    getValues,
  } = useForm({ mode: 'onBlur' })
  //   {
  //   mode: 'onBlur',
  //   defaultValues: {
  //     username: 'Ollsll',
  //     email: 'fadvbfa@.mail.com',
  //     password: 'Ollsll12',
  //     'password-conform': 'Ollsll12',
  //   },
  // }

  const onSubmit = (formData) => {
    dispatch(
      asyncCreateUserRequest({
        apiClientInstance,
        regData: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      })
    )
  }

  useEffect(() => {
    if (Object.keys(authErrorsList).length > 0) dispatch(resetAuthErrorsList())
    if (tokenJWT) {
      localStorage.setItem('userName', userName)
      localStorage.setItem('email', email)
      localStorage.setItem('tokenJWT', tokenJWT)
      reset()
    }
  }, [authErrorsList, tokenJWT])

  if (authErrorsList.username) errors.username = { message: authErrorsList.username }
  if (authErrorsList.email) errors.email = { message: authErrorsList.email }
  if (authErrorsList.password) errors.password = { message: authErrorsList.password }

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage =
    createUserRequestError && !isLoading ? <Alert message={createUserRequestError} banner type="error" /> : null

  return (
    <form className={stl.body} onSubmit={handleSubmit(onSubmit)}>
      <div className={stl.title}>Create new account</div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Username</div>
        <input
          className={errors.username ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          type="text"
          {...register('username', {
            required: 'This field is required!',
            minLength: {
              value: 3,
              message: 'Minimum length 3 characters',
            },
            maxLength: {
              value: 20,
              message: 'Maximum length 20 characters',
            },
          })}
          placeholder="Username"
        />
        {errors.username ? <div className={stl['incorrect-message']}>{errors.username.message}</div> : null}
      </div>
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
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Repeat Password</div>
        <input
          className={errors['password-conform'] ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          type="password"
          {...register('password-conform', {
            required: 'This field is required!',
            validate: (value) => value === getValues('password') || 'Passwords should match!',
          })}
          placeholder="Password"
        />
        {errors['password-conform'] ? (
          <div className={stl['incorrect-message']}>{errors['password-conform'].message}</div>
        ) : null}
      </div>
      {loadingSpinner}
      {errorMessage}
      <Checkbox className={classNames(stl['agree-request'])} required name="agree-request">
        I agree to the processing of my personal information
      </Checkbox>
      <Button type="primary" htmlType="submit" block disabled={!isValid} className={stl['submit-btn']}>
        Create
      </Button>
      <div className={stl.prompt}>
        Already have an account?{' '}
        <Link to="/sign-in" className={stl.link}>
          Sign In
        </Link>
      </div>
      {tokenJWT ? <Navigate to="/articles" replace /> : null}
    </form>
  )
}

export default SignUp
