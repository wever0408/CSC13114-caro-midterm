import { combineReducers } from 'redux'
import history from './history'
import isDescending from './isDescending'
import step from './step'
import xIsNext from './xIsNext'
import authReducer from "./authReducer"
import errorReducer from "./errorReducer"

export default combineReducers({
  history,
  isDescending,
  step,
  xIsNext,
  auth: authReducer,
  errors: errorReducer
})

