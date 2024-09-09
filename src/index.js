import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import ApiClient from './api-client'
import { appContext } from './utilities'
import store from './store/store'
import './index.module.scss'
import App from './components/app'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <appContext.Provider value={new ApiClient()}>
      <App />
    </appContext.Provider>
  </Provider>
)
