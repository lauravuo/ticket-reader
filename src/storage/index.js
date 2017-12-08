import {AsyncStorage} from 'react-native'

export const saveAccessToken = async accessToken => {
  try {
    if (accessToken) {
      await AsyncStorage.setItem('@AccessToken:key', accessToken)
    } else {
      await AsyncStorage.removeItem('@AccessToken:key')
    }
  } catch (error) {
    console.log('Error saving value to storage', error)
  }
}

export const readAccessToken = async callback => {
  try {
    const value = await AsyncStorage.getItem('@AccessToken:key')
    if (value !== null) {
      // We have data!!
      return callback(value)
    }
  } catch (error) {
    // Error retrieving data
    console.log('Error getting value from storage', error)
  }
  return callback(null)
}
