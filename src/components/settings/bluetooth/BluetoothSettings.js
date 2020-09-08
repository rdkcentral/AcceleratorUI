/*
* If not stated otherwise in this file or this component's Licenses.txt file the
* following copyright and licenses apply:
*
* Copyright © 2020 Tata Elxsi Limited
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
import { Lightning, Utils, Log } from 'wpe-lightning-sdk'
import { Colors } from '../../../constants/ColorConstants'
import { ImageConstants } from '../../../constants/ImageConstants'
import { DiscoverRemoteInfo } from './DiscoverRemote'
import { BluetoothTile } from './BluetoothTile'
import { BluetoothPairScreen } from './BluetoothPairScreen'
import { Loader } from './Loader'
import ThunderJS from 'ThunderJS'

/**
 * @export
 * @class Bluetooth
 * @extends Lightning.Component
 * Renders the Bluetooth Component
 */
export class Bluetooth extends Lightning.Component {
  
  /**
   * @static
   * @returns
   * @memberof Bluetooth
   * Renders the template
   */
  static _template() {
    return {
      BluetoothBg: {
        rect: true,
        w: 960,
        h: 1080,
        color: Colors.BG_GREY,
        BackArrow: { x: 81, y: 54, src: Utils.asset(ImageConstants.BACK_ARROW) },
        SettingsLabel: {
          x: 133,
          y: 54,
          text: {
            text: 'Settings',
            fontSize: 28,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        BluetoothLabel: {
          x: 82,
          y: 113,
          text: {
            text: 'Bluetooth',
            fontSize: 36,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Medium'
          }
        },
        Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
        RemoteControl: {
          x: 82,
          y: 209,
          text: {
            text: 'Remote Control',
            fontSize: 34,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        Loading: { type: Loader, x: 460, y: 700, visible: false, zIndex: 3, alpha: 0 },
        DiscoverRemote: {
          x: 81,
          y: 268,
          label: 'Discover Bluetooth Remote',
          type: BluetoothTile
        },
        PairedRemotes: {
          type: Lightning.components.ListComponent,
          x: 81,
          y: 378,
          w: 800,
          h: 1080,
          visible: false,
          itemSize: 120,
          horizontal: false,
          roll: true,
          rollMax: 0,
          rollMin: 0,
          invertDirection: true
        },
        DiscoveredRemotes: {
          type: Lightning.components.ListComponent,
          x: 81,
          y: 268,
          w: 800,
          h: 1080,
          visible: false,
          itemSize: 120,
          horizontal: false,
          roll: true,
          rollMax: 0,
          rollMin: 0,
          invertDirection: true
        },
        DiscoverInfo: {
          type: DiscoverRemoteInfo,
          visible: false
        }
      }
    }
  }

  /**
   * Thunder calls for Bluetooth functionality
   */
  _construct() {
    Log.info('Bluetooth Component ')
    this.config = {
      host: '127.0.0.1'
    }
    this.device = []
    try {
      this.thunderJS = ThunderJS(this.config)
    } catch (err) {
      Log.error(err)
    }
    this.thunderJS.on('BluetoothControl', 'scancomplete', notification => {
      Log.info('<< Scan completed >>' + notification)
      this._getDevices(() => {
        Log.info('\n Bluetooth Loop completed')
      })
    })
  }

  _startScan(timeoutval, devicetype) {
    this.thunderJS.call(
      'BluetoothControl',
      'scan',
      {
        timeout: timeoutval,
        type: devicetype
      },
      (err, result) => {
        if (err) {
          Log.info('\n Bluetooth Scan error')
        } else {
          Log.info('Scan started')
        }
      }
    )
  }
  wait_promise(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms)
      }, ms)
    })
  }

  async _getDevices() {
    let bluetooth = this
    this.thunderJS.call('BluetoothControl', 'devices', (err, result) => {
      if (err) {
        Log.error('Error in get Devices')
      } else {
        for (let i = 0; i < result.length; i++) {
          let mac = result[i]
          this.thunderJS.call('BluetoothControl', 'device@' + result[i], (err, result) => {
            if (err) {
              Log.info('\n<< Error in Device property>>')
            } else {
              result.mac = mac
              bluetooth.device.push(result)
              Log.info('\n Result Property ' + i + '-' + JSON.stringify(result))
            }
          })
        }
      }
    })
    await bluetooth.wait_promise(2000)
    Log.info('\n >>>>>>>>> ' + bluetooth.length)
    Log.info('\n >>>>>>>>> ' + bluetooth.device)
    bluetooth.tag('DiscoveredRemotes').items = bluetooth.device.map((data, index) => {
      return {
        ref: 'Remote' + index,
        type: BluetoothTile,
        label: data.name,
        mac: data.mac,
        secondarylabel: 'Not Ready',
        ready: false
      }
    })
    // Creates list of devices
    bluetooth._setState('DiscoveredRemote')
  }

  _pairDevice(addressval, timeoutval) {
    this.thunderJS.call('BluetoothRemoteControl', 'assign', { address: addressval })
    this.thunderJS.call('BluetoothControl', 'pair', { address: addressval, timeout: timeoutval })
  }

  _connectDevice(addressval) {
    let paired = { name: this.selectedDevice, mac: this.selectedmac }
    this.parent.parent.pairedDevices.push(paired)
    this.thunderJS.call('BluetoothControl', 'connect', { address: addressval })
    this.thunderJS.on(
      'BluetoothControl',
      'devicestatechange',
      { address: addressval, state: 'Connected' },
      notification => {
        Log.info('Connected Successfully' + notification)
      }
    )
  }

  _unpairDevice(addressval) {
    this.thunderJS.call('BluetoothControl', 'unpair', { address: addressval })
  }

  _disconnectDevice(addressval) {
    this.thunderJS.call('BluetoothControl', 'disconnect', { address: addressval })
    this.thunderJS.call('BluetoothRemoteControl', 'revoke')
  }

  set h(v) {
    this.tag('BluetoothBg').h = v
  }
  set w(v) {
    this.tag('BluetoothBg').w = v
  }

  _init() {
    Log.info('\n Bluetooth screen')
  }

  _active() {
    this.tag('PairedRemotes').items = this.uniqDevices(
      this.parent.parent.pairedDevices,
      item => item.mac
    ).map((data, index) => {
      return {
        ref: 'PairedRemote' + index,
        type: BluetoothTile,
        label: data.name,
        mac: data.mac,
        secondarylabel: 'Ready',
        ready: true
      }
    })
    this._setState('DiscoverRemote')
  }

  /**
   * Function returns a list of devices without duplicates
   * @param {*} data
   * @param {*} key
   */
  uniqDevices(data, key) {
    return [...new Map(data.map(x => [key(x), x])).values()]
  }

  $pairConnect() {
    //Pair and Connect method
    this.tag('Loading').visible = true
    this.tag('Loading').alpha = 1
    this._pairDevice(this.selectedmac, 10)
    this._connectDevice(this.selectedmac)
    this.pairedFlag = setTimeout(this.remoteReady.bind(this), 12000)
  }

  $disconnectRemote() {
    this._unpairDevice(this.selectedmac)
    this._disconnectDevice(this.selectedmac)
  }

  remoteReady() {
    this.$setBluetoothScreen()
    this.tag('Loading').visible = false
    this.tag('Loading').alpha = 0
    this.tag('DiscoveredRemotes').element.patch({
      secondarylabel: 'Ready',
      ready: true
    })
    this._setState('DiscoveredRemote')
  }

  $setBluetoothScreen() {
    // Bluetooth Screen
    this.childList.remove(this.tag('PairingPage'))
    this._setState('DiscoveredRemote')
  }

  /**
   * @static
   * @returns
   * @memberof BluetoothSettings
   * BluetoothSettings States
   */
  static _states() {
    return [
      class DiscoverRemote extends this {
        $enter() {
          this.tag('DiscoverRemote').visible = true
          this.tag('PairedRemotes').visible = true
        }
        _getFocused() {
          return this.tag('DiscoverRemote')
        }
        _handleDown() {
          if (this.tag('PairedRemotes').items.length > 0) {
            this._setState('PairedRemotes')
          }
        }
        _handleEnter() {
          this.startScanRemote()
        }
      },
      class DiscoveredRemote extends this {
        $enter() {
          this.tag('DiscoverRemote').visible = false
          this.tag('PairedRemotes').visible = false
          this.tag('DiscoveredRemotes').visible = true
        }
        _getFocused() {
          return this.tag('DiscoveredRemotes').element
        }
        _handleUp() {
          if (0 != this.tag('DiscoveredRemotes').index) {
            this.tag('DiscoveredRemotes').setPrevious()
          }
        }
        _handleDown() {
          if (this.tag('DiscoveredRemotes').length - 1 != this.tag('DiscoveredRemotes').index) {
            this.tag('DiscoveredRemotes').setNext()
          }
        }
        _handleEnter() {
          // pair and connect page
          this.selectedmac = this.tag('DiscoveredRemotes').element.mac
          this.selectedDevice = this.tag('DiscoveredRemotes').element.label
          this.childList.a({ ref: 'PairingPage', type: BluetoothPairScreen, x: -960 })
          this._setState('ParingScreen')
        }
      },
      class PairedRemotes extends this {
        _getFocused() {
          return this.tag('PairedRemotes').element
        }
        _handleUp() {
          if (this.tag('PairedRemotes').index == 0) {
            this._setState('DiscoverRemote')
          } else if (0 != this.tag('PairedRemotes').index) {
            this.tag('PairedRemotes').setPrevious()
          }
        }
        _handleDown() {
          if (this.tag('PairedRemotes').length - 1 != this.tag('PairedRemotes').index) {
            this.tag('PairedRemotes').setNext()
          }
        }
        _handleEnter() {
          // pair and connect page
          this.selectedmac = this.tag('PairedRemotes').element.mac
          this.selectedDevice = this.tag('PairedRemotes').element.label
          this.childList.a({ ref: 'PairingPage', type: BluetoothPairScreen, x: -960 })
          this._setState('ParingScreen')
        }
      },
      class OtherDevices extends this {
        $enter() {
          Log.info('\n Other devices')
        }
      },
      class ParingScreen extends this {
        $enter() { }
        _getFocused() {
          return this.tag('PairingPage')
        }
      }
    ]
  }

  startScanRemote() {
    this.tag('Divider').alpha = 0
    this.tag('RemoteControl').alpha = 0
    this.tag('DiscoverRemote').alpha = 0
    this.tag('PairedRemotes').alpha = 0
    this.tag('DiscoverInfo').visible = true
    this._startScan(10, 'LowEnergy')
    this.scanFlag = setTimeout(this.hideInfo.bind(this), 12000)
  }

  hideInfo() {
    this.tag('Divider').alpha = 1
    this.tag('RemoteControl').alpha = 1
    this.tag('DiscoverRemote').alpha = 1
    this.tag('PairedRemotes').alpha = 1
    this.tag('DiscoverInfo').visible = false
  }
}
