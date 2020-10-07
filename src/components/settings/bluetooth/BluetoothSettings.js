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
   * Initialise thunder calls for Bluetooth functionality
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
    //scan complete event listener
    this.thunderJS.on('BluetoothControl', 'scancomplete', notification => {
      Log.info('<< Scan completed >>' + notification)
      this._showDevices('Discovered', () => {
        Log.info('\n Bluetooth Loop completed')
      })
    })
  }

  /**
   * Starts scanning for devices
   * @param {*} timeoutval - timeout for scanning
   * @param {*} devicetype - Type of the device, say 'Low Energy'
   */
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

  /**
   * Execution waits for the time specified in milliseconds
   */
  wait_promise(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(ms)
      }, ms)
    })
  }

  /**
   * Gets the devices and its status from Thunder UI and renders the device tiles in Main screen or scan result screen
   * @param {*} view - For scan results - Discovered and For main bluetooth page - 'Paired'
   */
  async _showDevices(view) {
    // Determines which are the states and tags to be set based on the parameter
    let setState
    let tag
    let bluetoothTile
    switch (view) {
      case 'Discovered':
        setState = 'DiscoveredRemote'
        tag = 'DiscoveredRemotes'
        bluetoothTile = 'Remote'
        break
      case 'Paired':
        setState = 'DiscoverRemote'
        tag = 'PairedRemotes'
        bluetoothTile = 'PairedRemote'
        break
    }

    let devices = [] // to store devices array
    this._setState(setState)
    //Gets the details of devices connected to thunder UI
    this.thunderJS.call('BluetoothControl', 'devices', (err, result) => {
      if (err) {
        Log.error('Error in get Devices')
      } else {
        for (let i = 0; i < result.length; i++) {
          let mac = result[i]
          //Gets the detailed status of each device based on the mac address
          this.thunderJS.call('BluetoothControl', 'device@' + result[i], (err, result) => {
            if (err) {
              Log.info('\n<< Error in Device property>>')
            } else {
              result.mac = mac
              devices.push(result)
              Log.info('\n Result Property ' + i + '-' + JSON.stringify(result))
            }
          })
        }
      }
    })
    //Adding wait for the call back to finish before proceeding to next steps to get the complete list of devices
    await this.wait_promise(1000)
    this.secondarylabel = ''
    this.readyStatus = false
    // There is a chance that the devices array has repeated entries, so to avoid this only uniqdevices are taken
    this.tag(tag).items = this.uniqDevices(devices, item => item.mac).map((data, index) => {
      if (data.paired == true && data.connected == true) {
        this.secondarylabel = 'Ready'
        this.readyStatus = true
      } else {
        this.secondarylabel = 'Not Ready'
        this.readyStatus = false
      }
      return {
        ref: bluetoothTile + index,
        type: BluetoothTile,
        label: data.name,
        mac: data.mac,
        secondarylabel: this.secondarylabel,
        ready: this.readyStatus
      }
    })
  }

  /**
   * Performs thunder operations like assign and pair before connecting to bluetooth
   * @param {*} addressval - mac address of the device
   * @param {*} timeoutval - time out for pairing
   */
  _pairDevice(addressval, timeoutval) {
    this.thunderJS.call('BluetoothRemoteControl', 'assign', { address: addressval })
    this.thunderJS.call('BluetoothControl', 'pair', { address: addressval, timeout: timeoutval })
  }

  /**
   * Performs bluetooth connect fron thunder, so that the paired remote get connected
   * @param {*} addressval - mac address of the device
   */
  _connectDevice(addressval) {
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

  /**
   * Performs unpairing of device from thunder before disconnecting
   * @param {*} addressval - mac address of the device
   */
  _unpairDevice(addressval) {
    this.thunderJS.call('BluetoothControl', 'unpair', { address: addressval })
  }

  /**
   * Performs thunder disconnect and revoke for removing bluetooth connectivity
   * @param {*} addressval - mac address of the device
   */
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

  /**
   * This method gets invoked when the Bluetooth Settings page is active
   */
  _active() {
    this._showDevices('Paired')
  }

  /**
   * Function returns a list of devices without duplicates
   * @param {*} data
   * @param {*} key
   */
  uniqDevices(data, key) {
    return [...new Map(data.map(x => [key(x), x])).values()]
  }

  /**
   * Pair and connect method
   */
  $pairConnect() {
    this.tag('Loading').visible = true
    this.tag('Loading').alpha = 1
    this._pairDevice(this.selectedmac, 10)
    this._connectDevice(this.selectedmac)
    this.pairedFlag = setTimeout(this.remoteReady.bind(this), 12000)
  }

  /**
   * Disconnect the device
   */
  $disconnectRemote() {
    this._unpairDevice(this.selectedmac)
    this._disconnectDevice(this.selectedmac)
  }

  remoteReady() {
    this.tag('Loading').visible = false
    this.tag('Loading').alpha = 0
    this.$setBluetoothScreen()
  }

  /**
   * Method invoked after exiting from pairing page to show the details of device in main bluetooth page
   */
  $setBluetoothScreen() {
    this.childList.remove(this.tag('PairingPage'))
    this._showDevices('Paired')
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
        $exit() {
          this.tag('DiscoveredRemotes').visible = false
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
        $enter() {}
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
