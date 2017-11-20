export const DO_GOOGLE_LOGIN = 'DO_GOOGLE_LOGIN'
export const STORE_GOOGLE_ACCESS_TOKEN = 'STORE_GOOGLE_ACCESS_TOKEN'
export const RESET_GOOGLE_ACCESS_TOKEN = 'RESET_GOOGLE_ACCESS_TOKEN'
export const FETCH_USER = 'FETCH_USER'
export const FETCH_USER_FULFILLED = 'FETCH_USER_FULFILLED'
export const FETCH_USER_FAILED = 'FETCH_USER_FAILED'
export const FETCH_SHEET_FULFILLED = 'FETCH_SHEET_FULFILLED'
export const FETCH_SHEET_FAILED = 'FETCH_SHEET_FAILED'
export const SET_STATUS = 'SET_STATUS'

export const SCANNER_SET_CAMERA_PERMISSION = 'SCANNER_SET_CAMERA_PERMISSION'
export const SCANNER_SET_LAST_SCANNED = 'SCANNER_SET_LAST_SCANNED'

export const doGoogleLogin = () => ({
  type: DO_GOOGLE_LOGIN
})

export const storeGoogleAccessToken = payload => ({
  type: STORE_GOOGLE_ACCESS_TOKEN,
  payload
})

export const resetGoogleAccessToken = payload => ({
  type: RESET_GOOGLE_ACCESS_TOKEN,
  payload
})

export const fetchUser = payload => ({
  type: FETCH_USER,
  payload
})

export const fetchUserFulfilled = payload => ({
  type: FETCH_USER_FULFILLED,
  payload
})

export const fetchUserFailed = error => ({
  type: FETCH_USER_FAILED,
  error
})

export const fetchSheetFulfilled = payload => ({
  type: FETCH_SHEET_FULFILLED,
  payload
})

export const fetchSheetFailed = error => ({
  type: FETCH_SHEET_FAILED,
  error
})

export const setStatus = payload => ({
  type: SET_STATUS,
  payload
})

export const scannerSetCameraPermission = cameraPermission => ({
  type: SCANNER_SET_CAMERA_PERMISSION,
  cameraPermission
})

export const scannerSetLastScanned = lastScanned => ({
  type: SCANNER_SET_LAST_SCANNED,
  lastScanned
})
