import {applyMiddleware, createStore} from 'redux'
import {createEpicMiddleware} from 'redux-observable'
import {ajax} from 'rxjs/observable/dom/ajax'
import 'rxjs/add/operator/catch'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'

import epics from './epic'
import reducers from './reducer'
import {resetGoogleAccessToken} from './actions'

const errorHandler = (error, stream) => {
  if (error.status === 401) {
    return Observable.of(resetGoogleAccessToken())
  }
  return stream
}

export const epicAdapter = {
  input: action$ => action$,
  output: action$ => action$.catch(errorHandler)
}

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
}

const epicMiddleware = createEpicMiddleware(epics, {
  dependencies: {
    get: (url, customHeaders) =>
      ajax({
        url,
        headers: Object.assign({}, headers, customHeaders),
        crossDomain: true
      }),
    post: (url, body, customHeaders, responseType) =>
      ajax({
        method: 'POST',
        url,
        body,
        headers: Object.assign({}, headers, customHeaders),
        responseType: responseType || 'json',
        crossDomain: true
      }),
    put: (url, body, customHeaders, responseType) =>
      ajax({
        method: 'PUT',
        url,
        body,
        headers: Object.assign({}, headers, customHeaders),
        responseType: responseType || 'json',
        crossDomain: true
      })
  },
  epicAdapter
})

export default createStore(reducers, {}, applyMiddleware(epicMiddleware))
