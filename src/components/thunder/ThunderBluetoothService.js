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
import { Lightning, Log } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'

/**
 * @export
 * @class ThunderBluetoothService
 * @extends Lightning.Component
 * Bluetooth Thunder calls
 */
export class ThunderBluetoothService extends Lightning.Component {
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
      this.parent.parent._showDevices('Discovered', () => {
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

  /**
   * Gets the realtime devices data stored in thunder and also the details of each devices. Stores it in the devices array
   */
  getDevices() {
    //Storing the devices globally for future use and rests the data when the method is called for getting realtime data
    window.devices = []
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
              window.devices.push(result)
              Log.info('\n Result Property ' + i + '-' + JSON.stringify(result))
            }
          })
        }
      }
    })
  }
}
