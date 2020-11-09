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
/* eslint-disable no-undef */
import { Lightning, Utils, Log } from '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
import { ImageConstants } from '../../../constants/ImageConstants'
import { DiscoverRemoteInfo } from './DiscoverRemote'
import { BluetoothTile } from './BluetoothTile'
import { BluetoothPairScreen } from './BluetoothPairScreen'
import { ThunderBluetoothService } from '../../thunder/ThunderBluetoothService'
import { Loader } from './Loader'

/**
 * Renders the Bluetooth Component
 * @export
 * @class Bluetooth
 * @extends Lightning.Component
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
        SavedRemotes: {
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
        },
        ThunderBluetoothService: {
          type: ThunderBluetoothService
        }
      }
    }
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
    this._showDevices('Saved')
  }

  /**
   * Pair and connect method
   */
  $pairConnect() {
    this.tag('Loading').visible = true
    this.tag('Loading').alpha = 1
    this.tag('ThunderBluetoothService')._pairDevice(this.selectedmac, 10)
    this.tag('ThunderBluetoothService')._connectDevice(this.selectedmac)
    this.pairedFlag = setTimeout(this.remoteReady.bind(this), 12000)
  }

  /**
   * Disconnect the device
   */
  $disconnectRemote() {
    this.tag('ThunderBluetoothService')._unpairDevice(this.selectedmac)
    this.tag('ThunderBluetoothService')._disconnectDevice(this.selectedmac)
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
    this._showDevices('Saved')
  }

  /**
   * Gets the devices and its status from Thunder and renders the device tiles in Main screen or scan result screen
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
      case 'Saved':
        setState = 'DiscoverRemote'
        tag = 'SavedRemotes'
        bluetoothTile = 'PairedRemote'
        break
    }

    /**
     * Gets the devices stored in Thunder and also the details of the devices.
     * Stores it in the global variable for later use
     */
    this.tag('ThunderBluetoothService').getDevices()
    await this.wait_promise(1000) //Await period for the call back to finish

    this.secondarylabel = ''
    this.readyStatus = false
    /**
     * Displays the devices as tiles in the corresponding component.
     * The 'scan Completed' event can occur multiple times. SO devices array has repeated entries in the case of scanning
     * So as a work around only uniqdevices are taken
     */
    this.tag(tag).items = this.uniqDevices(window.devices, item => item.mac).map((data, index) => {
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
    this._setState(setState)
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
   * Function returns a list of devices without duplicates
   * @param {*} data
   * @param {*} key
   */
  uniqDevices(data, key) {
    return [...new Map(data.map(x => [key(x), x])).values()]
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
          this.tag('SavedRemotes').visible = true
        }
        _getFocused() {
          return this.tag('DiscoverRemote')
        }
        _handleDown() {
          if (this.tag('SavedRemotes').items.length > 0) {
            this._setState('SavedRemotes')
          }
        }
        _handleEnter() {
          this.startScanRemote()
        }
      },
      class DiscoveredRemote extends this {
        $enter() {
          this.tag('DiscoverRemote').visible = false
          this.tag('SavedRemotes').visible = false
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
          this.selectedmac = this.tag('DiscoveredRemotes').element.mac
          this.selectedDevice = this.tag('DiscoveredRemotes').element.label
          this.childList.a({ ref: 'PairingPage', type: BluetoothPairScreen, x: -960 })
          this._setState('ParingScreen')
        }
        $exit() {
          this.tag('DiscoveredRemotes').visible = false
        }
      },
      class SavedRemotes extends this {
        _getFocused() {
          return this.tag('SavedRemotes').element
        }
        _handleUp() {
          if (this.tag('SavedRemotes').index == 0) {
            this._setState('DiscoverRemote')
          } else if (0 != this.tag('SavedRemotes').index) {
            this.tag('SavedRemotes').setPrevious()
          }
        }
        _handleDown() {
          if (this.tag('SavedRemotes').length - 1 != this.tag('SavedRemotes').index) {
            this.tag('SavedRemotes').setNext()
          }
        }
        _handleEnter() {
          this.selectedmac = this.tag('SavedRemotes').element.mac
          this.selectedDevice = this.tag('SavedRemotes').element.label
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
    this.tag('SavedRemotes').alpha = 0
    this.tag('DiscoverInfo').visible = true
    this.tag('ThunderBluetoothService')._startScan(10, 'LowEnergy')
    this.scanFlag = setTimeout(this.hideInfo.bind(this), 12000)
  }

  hideInfo() {
    this.tag('Divider').alpha = 1
    this.tag('RemoteControl').alpha = 1
    this.tag('DiscoverRemote').alpha = 1
    this.tag('SavedRemotes').alpha = 1
    this.tag('DiscoverInfo').visible = false
  }
}
