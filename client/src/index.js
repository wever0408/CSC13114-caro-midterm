import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import './index.css'
import App from './containers/App'
import store from "./store";



render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
