import React, {Component} from 'react'
import {Dimensions, LayoutAnimation, Text, View, StatusBar, StyleSheet} from 'react-native'
import {BarCodeScanner, Permissions} from 'expo'
import {connect} from 'react-redux'
import {scannerSetCameraPermission, scannerSetLastScanned, setStatus} from '../actions'

const requestCameraPermission = async saveFn => {
  const {status} = await Permissions.askAsync(Permissions.CAMERA)
  saveFn(status === 'granted')
}

const handleBarCodeRead = (result, lastScanned, saveFn, goToMain) => {
  if (result.data !== lastScanned) {
    LayoutAnimation.spring()
    saveFn(result.data)
    console.log(result.data)
    goToMain()
  }
}

class Scanner extends Component {
  componentDidMount() {
    const {saveCameraPermission} = this.props
    requestCameraPermission(saveCameraPermission)
  }

  render() {
    const {cameraPermission, lastScanned} = this.props.scanner
    const {saveLastScanned, goBackToMain} = this.props
    return (
      <View style={styles.container}>
        {cameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : cameraPermission === false ? (
          <Text style={{color: '#fff'}}>Camera permission is not granted</Text>
        ) : (
          <BarCodeScanner
            onBarCodeRead={result =>
              handleBarCodeRead(result, lastScanned, saveLastScanned, goBackToMain)
            }
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width
            }}
          />
        )}
        <StatusBar hidden />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row'
  },
  url: {
    flex: 1
  },
  urlText: {
    color: '#fff',
    fontSize: 20
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18
  }
})

const mapStateToProps = ({scanner}) => ({
  scanner
})

const mapDispatchToProps = dispatch => ({
  saveCameraPermission: payload => dispatch(scannerSetCameraPermission(payload)),
  saveLastScanned: payload => dispatch(scannerSetLastScanned(payload)),
  goBackToMain: () => dispatch(setStatus('MAIN'))
})

export default connect(mapStateToProps, mapDispatchToProps)(Scanner)
