import React from 'react'
import {Provider} from 'react-redux'

import store from './store'
import MainView from './main-view'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    )
  }
}
