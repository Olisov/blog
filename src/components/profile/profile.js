import { React, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Alert, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'

import { asyncUpdateUserAuthRequest } from '../../store/slices'
import { appContext } from '../../utilities'

import stl from './profile.module.scss'

function Profile() {
  const apiClientInstance = useContext(appContext)
  const { isLoading, authRequestError, userName, email, tokenJWT, avatarImg } = useSelector((state) => state.authState)
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    mode: 'onBlur',
    values: {
      username: userName,
      email,
      password: '',
      'avatar-img': avatarImg,
    },
  })

  const onSubmit = (formData) => {
    dispatch(
      asyncUpdateUserAuthRequest({
        apiClientInstance,
        regData: {
          tokenJWT,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          avatarImgUrl: formData['avatar-img'],
        },
      })
    )
    reset()
  }

  if (!tokenJWT && !localStorage.getItem('tokenJWT')) return <Navigate to="/" replace />

  useEffect(() => {
    if (tokenJWT) {
      localStorage.setItem('tokenJWT', tokenJWT)
    }
  }, [userName, email, tokenJWT, avatarImg])

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage = authRequestError && !isLoading ? <Alert message={authRequestError} banner type="error" /> : null

  return (
    <form className={stl.body} onSubmit={handleSubmit(onSubmit)}>
      <div className={stl.title}>Edit Profile</div>
      {loadingSpinner}
      {errorMessage}
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Username</div>
        <input
          className={errors.username ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          type="text"
          {...register('username', {
            required: !userName ? 'This field is required!' : false,
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
            required: !email ? 'This field is required!' : false,
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
        <div className={stl['input-label']}>New password</div>
        <input
          type="password"
          className={errors.password ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          {...register('password', {
            minLength: {
              value: 6,
              message: 'Minimum length 6 characters',
            },
            maxLength: {
              value: 40,
              message: 'Maximum length 40 characters',
            },
          })}
          placeholder="Password"
        />
        {errors.password ? <div className={stl['incorrect-message']}>{errors.password.message}</div> : null}
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Avatar image(url)</div>
        <input
          className={errors['password-conform'] ? classNames(stl.input, stl['incorrect-input']) : classNames(stl.input)}
          type="text"
          defaultValue={avatarImg}
          {...register('avatar-img', {
            pattern: {
              value: /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/,
              message: 'Should be correct URL ',
            },
          })}
          placeholder="Avatar image"
        />
        {errors['avatar-img'] ? <div className={stl['incorrect-message']}>{errors['avatar-img'].message}</div> : null}
      </div>
      <Button type="primary" htmlType="submit" block disabled={!isValid} className={stl['submit-btn']}>
        Save
      </Button>
    </form>
  )
}

export default Profile
