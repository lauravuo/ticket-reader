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
  fetchUserFulfilled,
  fetchUserFailed,
  fetchSheetFulfilled,
  fetchSheetFailed
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
  action$.ofType(FETCH_USER_FULFILLED).mergeMap(() =>
    get(
      `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Sheet1!A1:Q1000?majorDimension=ROWS`,
      {
        Authorization: `Bearer ${store.getState().accessToken}`
      }
    )
      .map(payload => fetchSheetFulfilled(payload.response))
      .catch(error => Observable.of(fetchSheetFailed(error)))
  )

export default combineEpics(fetchUserEpic, fetchSheetEpic)
