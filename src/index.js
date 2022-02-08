import React from 'react'
import ReactDOM from 'react-dom'
import './assets/common/normalize.css'
import Router from './router'
import { Provider } from 'mobx-react'
import store from './store'
import 'antd-mobile/2x/es/global';

ReactDOM.render(
  <Provider {...store}>
    <Router />
  </Provider>,
  document.getElementById('root')
)
