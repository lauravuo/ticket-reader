import {combineEpics} from 'redux-observable'

import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'

import {GOOGLE_SHEET_ID} from 'react-native-dotenv'

import {
  STORE_GOOGLE_ACCESS_TOKEN,
  FETCH_USER_FULFILLED,
  SCANNER_SET_LAST_SCANNED,
  FETCH_SHEET_FULFILLED,
  fetchUserFulfilled,
  fetchUserFailed,
  fetchSheetFulfilled,
  fetchSheetFailed,
  scannerResetLastScanned,
  scannerUpdateFailed,
  scannerCodeValid,
  scannerCodeInvalid
} from '../actions'

const fetchUserEpic = (action$, store, {get}) =>
  action$.ofType(STORE_GOOGLE_ACCESS_TOKEN).mergeMap(() =>
    get('https://www.googleapis.com/userinfo/v2/me', {
      Authorization: `Bearer ${store.getState().accessToken}`
    })
      .map(payload => fetchUserFulfilled(payload.response))
      .catch(error => Observable.of(fetchUserFailed(error)))
  )

const fetchSheetEpic = (action$, store, {get}) =>
  action$.ofType(FETCH_USER_FULFILLED, SCANNER_SET_LAST_SCANNED).mergeMap(() =>
    get(
      `https://sheets.googleapis.com/v4/spreadsheets/${
        GOOGLE_SHEET_ID
      }/values/Sheet1!A1:Q1000?majorDimension=ROWS`,
      {
        Authorization: `Bearer ${store.getState().accessToken}`
      }
    )
      .map(payload => fetchSheetFulfilled(payload.response))
      .catch(error => Observable.of(fetchSheetFailed(error)))
  )

const getRangeForUpdate = (scanned, sheet) => {
  const selected = sheet.values.find(row => row[2] === scanned)
  if (!selected || selected[16]) {
    return null
  }
  const rowNumber = sheet.values.indexOf(selected) + 1
  return `Sheet1!Q${rowNumber}`
}

const updateSheetWithScannedEpic = (action$, store, {put}) =>
  action$.ofType(FETCH_SHEET_FULFILLED).mergeMap(action => {
    const scanned = store.getState().scanner.lastScanned
    if (scanned) {
      const range = getRangeForUpdate(scanned, action.payload)
      if (range) {
        return put(
          `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${
            range
          }?valueInputOption=USER_ENTERED`,
          {
            range,
            values: [[new Date().getTime().toString()]],
            majorDimension: 'ROWS'
          },
          {
            Authorization: `Bearer ${store.getState().accessToken}`
          }
        )
          .mergeMap(() => Observable.of(scannerResetLastScanned(), scannerCodeValid()))
          .catch(() => Observable.of(scannerUpdateFailed()))
      }
      return Observable.of(scannerCodeInvalid())
    }
    return Observable.of(scannerResetLastScanned())
  })

export default combineEpics(fetchUserEpic, fetchSheetEpic, updateSheetWithScannedEpic)
