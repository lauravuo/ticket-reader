import React, {Component} from 'react'
import {Dimensions, LayoutAnimation, Text, StatusBar} from 'react-native'
import {BarCodeScanner, Permissions} from 'expo'
import {connect} from 'react-redux'

import {Container} from '../style'
import {WarnText} from './style'
import {scannerSetCameraPermission, scannerSetLastScanned, setStatus} from '../../actions'

const requestCameraPermission = async saveFn => {
  const {status} = await Permissions.askAsync(Permissions.CAMERA)
  saveFn(status === 'granted')
}

class Scanner extends Component {
  componentDidMount() {
    const {saveCameraPermission} = this.props
    requestCameraPermission(saveCameraPermission)
  }

  render() {
    const {cameraPermission, lastScanned} = this.props.scanner
    const {saveLastScanned, goBackToMain} = this.props
    const handleBarCodeRead = result => {
      if (result.data !== lastScanned) {
        LayoutAnimation.spring()
        saveLastScanned(result.data)
        console.log(result.data)
        goBackToMain()
      }
    }
    return (
      <Container>
        {cameraPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : cameraPermission === false ? (
          <WarnText>Camera permission is not granted</WarnText>
        ) : (
          <BarCodeScanner
            onBarCodeRead={handleBarCodeRead}
            style={{
              height: Dimensions.get('window').height,
              width: Dimensions.get('window').width
            }}
          />
        )}
        <StatusBar hidden />
      </Container>
    )
  }
}

const mapStateToProps = ({scanner}) => ({
  scanner
})

const mapDispatchToProps = dispatch => ({
  saveCameraPermission: payload => dispatch(scannerSetCameraPermission(payload)),
  saveLastScanned: payload => dispatch(scannerSetLastScanned(payload)),
  goBackToMain: () => dispatch(setStatus('MAIN'))
})

export default connect(mapStateToProps, mapDispatchToProps)(Scanner)
