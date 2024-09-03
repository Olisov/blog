/* eslint-disable no-unused-expressions */
import { React, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Checkbox, Alert, Spin, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import classNames from 'classnames'

import { asyncCreateUserRequest } from '../../store/slices'
import { appContext } from '../../utilities'

import stl from './sign-up.module.scss'

// function faultMessage(faultText) {
//   if (faultText) return <div className={stl['incorrect-message']}>{faultText}</div>
//   return null
// }

function SignUp() {
  const apiClientInstance = useContext(appContext)
  const dispatch = useDispatch()
  const { isLoading, authErrorsList, createUserRequestError } = useSelector((state) => state.authState)
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    getValues,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      username: 'Ollsll',
      email: 'fadvbfa@.mail.com',
      password: 'Ollsll12',
      'password-conform': 'Ollsll12',
    },
  })

  // const userNameFault = errors.username

  // apiClientInstance.createNewUser({ username: 'Ollsll', email: 'fadvbfa@.mail.com', password: 'Ollsll12' })

  // const onCheckboxChange = (e) => {
  //   console.log(`checked = ${e.target.checked}`)
  // }

  const onSubmit = ({ username, email, password }) => {
    // evt.preventDefault()
    // console.log('evt.target', formData)

    // dispatch(
    //   asyncCreateUserRequest({
    //     apiClientInstance,
    //     regData: {
    //       username: 'Ollsll',
    //       email: 'fadvbfa@.mail.com',
    //       password: 'Ollsll12',
    //     },
    //   })
    // )
    dispatch(
      asyncCreateUserRequest({
        apiClientInstance,
        regData: {
          username,
          email,
          password,
        },
      })
    )
    // apiClientInstance.createNewUser({ username: 'Ollsll', email: 'fadvbfa@.mail.com', password: 'Ollsll12' })
    // apiClientInstance.createNewUser({ username, email, password })
  }

  console.log('authErrorsList', authErrorsList)

  if (authErrorsList.username) errors.username = { message: authErrorsList.username }
  if (authErrorsList.email) errors.email = { message: authErrorsList.email }
  if (authErrorsList.password) errors.password = { message: authErrorsList.password }

  console.log('errors', errors)

  const loadingSpinner = isLoading ? <Spin indicator={<LoadingOutlined spin />} size="large" /> : null
  const errorMessage =
    createUserRequestError && !isLoading ? <Alert message={createUserRequestError} banner type="error" /> : null

  return (
    // <form className={stl.body} onSubmit={onSubmit}>
    <form className={stl.body} onSubmit={handleSubmit(onSubmit)}>
      <div className={stl.title}>Create new account</div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Username</div>
        {/* <input className={stl.input} name="username" type="text" placeholder="Username" /> */}
        {/* stl['incorrect-input']  */}
        <input
          // className={stl.input}
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
        {/* <div className={stl.message}>{errors.username?.message}</div> */}
        {/* <div className={stl['incorrect-message']}>Minimum length 5 characters</div> */}
        {errors.username ? <div className={stl['incorrect-message']}>{errors.username.message}</div> : null}
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Email address</div>
        {/* <input className={stl.input} name="email" type="text" placeholder="Email address" /> */}
        <input
          className={stl.input}
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
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Password</div>
        {/* <input type="password" name="password" className={stl.input} placeholder="Password" /> */}
        <input
          type="password"
          className={stl.input}
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
      </div>
      <div className={stl['input-group']}>
        <div className={stl['input-label']}>Repeat Password</div>
        {/* <input type="password" name="password-conform" className={stl.input} placeholder="Password" /> */}
        <input
          className={stl.input}
          type="password"
          {...register('password-conform', {
            required: 'This field is required!',
            validate: (value) => value === getValues('password') || 'Passwords should match!',
            // {
            //   value:
            //   },
            //   message: 'Password and Repeat Password must match',
          })}
          placeholder="Password"
        />
      </div>
      {/* <Checkbox required className={stl['agree-message']} onChange={onCheckboxChange}> */}
      {/* <div className={stl.message}>Create new account</div> */}
      {loadingSpinner}
      {errorMessage}
      {/* <Checkbox className={stl['agree-request']} name="agree-request"> */}
      {/* <Checkbox className={classNames(stl['agree-request'], stl['incorrect-input'])} name="agree-request"> */}
      <Checkbox className={classNames(stl['agree-request'])} required name="agree-request">
        I agree to the processing of my personal information
      </Checkbox>
      <div className={stl['incorrect-message']}>Minimum length 5 characters</div>

      <Button type="primary" htmlType="submit" block disabled={!isValid} className={stl['submit-btn']}>
        Create
      </Button>
      <div className={stl.prompt}>
        Already have an account?{' '}
        <Link to="/sign-in" className={stl.link}>
          Sign In
        </Link>
      </div>
    </form>
  )
}

export default SignUp
