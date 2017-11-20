import React from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'
import Expo from 'expo'
import {ANDROID_CLIENT_ID, IOS_CLIENT_ID} from 'react-native-dotenv'

import {doGoogleLogin, resetGoogleAccessToken, storeGoogleAccessToken, setStatus} from './actions'
import {readAccessToken} from './storage'
import Scanner from './scanner'

async function signInWithGoogleAsync() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId: ANDROID_CLIENT_ID,
      iosClientId: IOS_CLIENT_ID,
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets']
    })

    if (result.type === 'success') {
      return result.accessToken
    }
    return {cancelled: true}
  } catch (e) {
    return {error: true}
  }
}

export class MainView extends React.Component {
  componentWillMount() {
    const {saveToken} = this.props
    readAccessToken(saveToken)
  }

  render() {
    const {
      accessToken,
      storeAccessToken,
      user,
      sheet,
      status,
      goToDetails,
      goToScanner,
      goToMain,
      logout,
      startGoogleLogin
    } = this.props
    const storeToken = async () => {
      startGoogleLogin()
      const token = await signInWithGoogleAsync()
      storeAccessToken(token)
    }
    const getChecked = (row, index) => index !== 0 && row.length > 16 && row[16]
    const ticketStatus = sheet
      ? `${sheet.values.filter(getChecked).length}/${sheet.values.length - 1}`
      : '0/0'
    return (
      <View style={styles.container}>
        {user ? (
          <View>
            {status === 'SCAN_CODE' ? (
              <Scanner />
            ) : (
              <View>
                <Text>Logged in as {user.email}</Text>
                {sheet && <Text>Tickets scanned: {ticketStatus}</Text>}
                {status !== 'MAIN' && <Button title="Status" onPress={goToMain} />}
                {status !== 'DETAILS' && <Button title="See details" onPress={goToDetails} />}
                {status !== 'SCAN_CODE' && <Button title="Scan code" onPress={goToScanner} />}
                <Button title="Logout" onPress={logout} />
                {sheet &&
                  status === 'DETAILS' &&
                  sheet.values.map(row => (
                    <View key={row[2]}>
                      <Text>{`${row[0]} ${row[5]} ${row[6]}`}</Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        ) : (
          <View>
            {accessToken || status === 'MAIN_LOADING' ? (
              <Text>Loading</Text>
            ) : (
              <Button title="Login" onPress={storeToken} />
            )}
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = ({accessToken, user, sheet, status}) => ({
  status,
  accessToken,
  user,
  sheet
})

const mapDispatchToProps = dispatch => ({
  storeAccessToken: payload => dispatch(storeGoogleAccessToken(payload)),
  goToMain: () => dispatch(setStatus('MAIN')),
  goToDetails: () => dispatch(setStatus('DETAILS')),
  goToScanner: () => dispatch(setStatus('SCAN_CODE')),
  saveToken: payload => dispatch(storeGoogleAccessToken(payload)),
  logout: () => dispatch(resetGoogleAccessToken()),
  startGoogleLogin: () => dispatch(doGoogleLogin())
})

export default connect(mapStateToProps, mapDispatchToProps)(MainView)
