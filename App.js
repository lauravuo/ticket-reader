import React from 'react'
import {Provider} from 'react-redux'

import store from './src/store'
import MainView from './src/main-view'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    )
  }
}
