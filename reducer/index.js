import {combineReducers} from 'redux'
import {saveAccessToken} from '../storage'

export const updateObject = (oldObject, newValues) => Object.assign({}, oldObject, newValues)

export const createReducer = (initialState, handlers) => (state = initialState, action) => {
  if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
    return handlers[action.type](state, action)
  }
  return state
}

const initialStatus = 'NOT_LOGGED_IN'
const saveStatus = (state, action) => action.payload
const userLoggingIn = () => 'MAIN_LOADING'
const userDataReceived = () => 'MAIN'
const status = createReducer(initialStatus, {
  SET_STATUS: saveStatus,
  DO_GOOGLE_LOGIN: userLoggingIn,
  FETCH_USER_FULFILLED: userDataReceived
})

const initialToken = null
const saveToken = (state, action) => {
  const newToken = action.payload
  saveAccessToken(newToken)
  return newToken
}
const resetToken = () => {
  saveAccessToken(null)
  return null
}
const accessToken = createReducer(initialToken, {
  STORE_GOOGLE_ACCESS_TOKEN: saveToken,
  FETCH_USER_FAILED: resetToken,
  RESET_GOOGLE_ACCESS_TOKEN: resetToken
})

const initialUser = null
const saveUser = (state, action) => action.payload
const resetUser = () => null
const user = createReducer(initialUser, {
  FETCH_USER_FULFILLED: saveUser,
  RESET_GOOGLE_ACCESS_TOKEN: resetUser
})

const initialSheet = null
const saveSheet = (state, action) => action.payload
const sheet = createReducer(initialSheet, {
  FETCH_SHEET_FULFILLED: saveSheet
})

const initialScanner = {cameraPermission: false, lastScanned: ''}
const setCameraPermission = (state, action) =>
  updateObject(state, {cameraPermission: action.cameraPermission})
const setLastScanned = (state, action) => updateObject(state, {lastScanned: action.lastScanned})
const scanner = createReducer(initialScanner, {
  SCANNER_SET_CAMERA_PERMISSION: setCameraPermission,
  SCANNER_SET_LAST_SCANNED: setLastScanned
})

export default combineReducers({
  accessToken,
  user,
  sheet,
  status,
  scanner
})
