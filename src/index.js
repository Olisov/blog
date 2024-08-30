import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'

import store from './store/store'
import './index.scss'
import App from './components/app'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ConfigProvider
    theme={{
      components: {
        Radio: {
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '12px',
          borderRadius: 4,
          buttonBg: '#fff',
          buttonColor: '#4a4a4a',
          buttonCheckedBg: '#2196F3',
          colorPrimaryHover: '#000',
        },
      },
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
)
