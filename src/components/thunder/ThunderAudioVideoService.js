/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright � 2020 Tata Elxsi Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Lightning, Log, Storage } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'

var setmode = ''
/**
 * @export
 * @class ThunderAppService
 * @extends Lightning.Component
 * Thunder  Diagnostic calls
 */
export class ThunderAudioVideoService extends Lightning.Component {
  _construct() {
    this.config = {
      host: '127.0.0.1',
      port: '9998'
    }
    this.device = []
    try {
      this.thunderJS = ThunderJS(this.config)
    } catch (err) {
      Log.error(err)
    }
  }

  _activate(callSign) {
    this.thunderJS.Controller.activate({ callsign: callSign }, (err, result) => {
      if (err) {
        Log.error('Ptag: Failed to activate ' + callSign)
      } else {
        Log.info('Ptag: Successfully activated ' + callSign)
      }
    })
  }

  setSPDIF(state) {
    Log.info('AVtag:setSPDIF state' + state)
    this.thunderJS.call(
      'org.rdk.DisplaySettings',
      'setEnableAudioPort',
      { audioPort: 'SPDIF0', enable: state },
      (err, result) => {
        if (err) {
          Log.info('\nAVtag: setSPDIF error........' + JSON.stringify(err))
        } else {
          Log.info('\nAVtag: setSPDIF success to:........' + JSON.stringify(result))
        }
      }
    )
  }

  setCEC(state) {
    console.log('Voltag:setCEC state' + state)

    // enable cec1

    this.thunderJS.call('org.rdk.HdmiCec', 'setEnabled', { enabled: state }, (err, result) => {
      if (err) {
        console.log('Voltag: setCEC error........' + JSON.stringify(err))
      } else {
        console.log('Voltag: setCEC success to:........' + JSON.stringify(result))
        this.checkTVStatus(state)
      }
    })

    // enable cec2
    this.thunderJS.call('org.rdk.HdmiCec_2', 'setEnabled', { enabled: state }, (err, result) => {
      if (err) {
        Log.info('\nAVtag: setCEC error........' + JSON.stringify(err))
      } else {
        Log.info('\nAVtag: setCEC success to:........' + JSON.stringify(result))
      }
    })
  }

  checkTVStatus(state) {
    console.log('cectag: inside checkTVStatus')
    if (state === 'true') {
      let params = { message: 'MI8=' }
      this.thunderJS.call('org.rdk.HdmiCec', 'sendMessage', params, (err, result) => {
        if (err) {
          console.log('cectag: send cec message error:........' + JSON.stringify(err))
        } else {
          let preValue = ''
          console.log('cectag: send cec message success:........' + JSON.stringify(result))
          if (this.cecListener) {
            this.cecListener.dispose()
          }
          this.cecListener = this.thunderJS.on('org.rdk.HdmiCec', 'onMessage', notification => {
            console.log('cectag:message from TV------------------- ' + JSON.stringify(notification))
            let currValue = notification.message
            if (preValue != currValue) {
              preValue = currValue
              if (currValue === 'BJAA') {
                console.log('cectag: current value BJAA and setting volume 100')
                this.setVolume(100)
              }
            }
          })
        }
      })
    } else {
      this.changeSoundModeVolume()
    }
  }

  getCEC() {
    Log.info('AVtag:getCEC state')
    return new Promise(resolve => {
      this.thunderJS.call('org.rdk.HdmiCec', 'getEnabled', (err, result) => {
        if (err) {
          Log.info('\nAVtag: getCEC1 error........' + JSON.stringify(err))
          resolve()
        } else {
          Log.info('\nAVtag: getCEC1 success to:........' + JSON.stringify(result))
          resolve(result.enabled)
        }
      })
    })
  }

  changeSoundModeVolume() {
    this.getSoundMode().then(soundMode => {
      this.getCEC().then(cec => {
        console.log('cectag: inside changeSoundModeVolume: soundmode : cec' + soundMode + cec)
        if (cec === false) {
          if (soundMode.toUpperCase().indexOf('STEREO') != -1) {
            this.setVolume(Storage.get('lastsetvolume'))
          } else {
            this.setVolume(100)
          }
        } else {
          this.setVolume(100)
        }
      })
    })
  }

  getSoundMode() {
    return new Promise(resolve => {
      this.thunderJS.call(
        'org.rdk.DisplaySettings',
        'getSoundMode',
        {
          audioPort: 'HDMI0'
        },
        (err, result) => {
          if (err) {
            console.log('Voltag: getSoundMode error........' + JSON.stringify(err))
            resolve()
          } else {
            console.log('Voltag: getSoundMode success to:........' + result)
            resolve(result.soundMode)
          }
        }
      )
    })
  }

  setVolume(volLevel) {
    this.thunderJS.call('org.rdk.DisplaySettings', 'setVolumeLevel', {
      audioPort: 'HDMI0',
      volumeLevel: volLevel
    })
  }

  setSoundMode(mode) {
    if (mode == 'Passthrough') {
      setmode = 'passthru'
    } else if (mode == 'Stereo') {
      setmode = 'stereo'
    } else if (mode == 'Surround') {
      setmode = 'SURROUND'
    }
    console.log('AVtag:setSoundMode mode' + mode + '.............' + setmode)
    this.thunderJS.call(
      'org.rdk.DisplaySettings',
      'setSoundMode',
      {
        audioPort: 'HDMI0',
        soundMode: setmode,
        persist: true
      },
      (err, result) => {
        if (err) {
          console.log('AVtag: setSoundMode error........' + JSON.stringify(err))
        } else {
          console.log('AVtag: setSoundMode success to:........' + setmode)
          this.changeSoundModeVolume()
        }
      }
    )
  }

  checkHDMIstatus() {
    console.log('AVtag:checkHDMIstatus')
    return new Promise(resolve => {
      this.thunderJS.call('org.rdk.DisplaySettings', 'getConnectedAudioPorts', (err, result) => {
        if (err) {
          console.log('AVtag: checkHDMIstatus error........' + JSON.stringify(err))
          resolve()
        } else {
          console.log('AVtag: checkHDMIstatus success to:........' + JSON.stringify(result))
          let ports = result.connectedAudioPorts
          if (ports.includes('HDMI0')) {
            resolve(true)
          } else {
            resolve(false)
          }
        }
      })
    })
  }
}
