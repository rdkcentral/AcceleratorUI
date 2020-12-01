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
      host: '127.0.0.1',
      port: '9998'
    }

    try {
      this.thunderJS = ThunderJS(this.config)
    } catch (err) {
      Log.error("Error in initialising Thunder service" + err)
    }

    /**
     * To activate bluetooth plugin since bluetooth plugin need not be enabled by default
     */
    this.thunderJS.Controller.activate({ callsign: 'org.rdk.Bluetooth' }, (err, result) => {
      if (err) {
        Log.error('Failed to activate  Bluetooth plugin')
      } else {
        Log.info('Successfully activated ' + callSign)
      }
    })

    /**
     * Event listener to listen to device discovered
     */
    this.thunderJS.on('org.rdk.Bluetooth', 'onDiscoveredDevice', notification => {
      Log.info('<<Device discovered  event>>' + JSON.stringify(notification))
    })


    /**
     * Event listener to verify
     */
    this.thunderJS.on('org.rdk.Bluetooth', 'onStatusChanged', notification => {
      Log.info('<< Scan completed >>' + JSON.stringify(notification))
      // Show scan result page when scan is completed, which shows the discovered images
      if (notification.newStatus === 'DISCOVERY_COMPLETED') {
        this.parent.parent._showDevices('Discovered', () => {
          Log.info('\n Bluetooth Scan completed')
        })
      }
    })
  }

  /**
   * Starts scanning for devices
   * @param {*} timeoutval - timeout for scanning
   * @param {*} devicetype - Type of the device, say 'Low Energy'
   */
  _startScan(timeoutVal, deviceProfile) {
    this.thunderJS.call(
      'org.rdk.Bluetooth',
      'startScan',
      {
        timeout: timeoutVal,
        profile: deviceProfile
      },
      (err, result) => {
        if (err) {
          Log.info('\n Bluetooth Scan error' + JSON.stringify(err))
        } else {
          Log.info('Scan started' + JSON.stringify(result))
        }
      }
    )
  }

  /**
   * Performs pairing of the given device
   * @param {*} addressval - mac address of the device
   * @param {*} timeoutval - time out for pairing
   */
  _pairDevice(deviceIDval) {
    this.thunderJS.call('org.rdk.Bluetooth', 'pair', { deviceID: deviceIDval },
      (err, result) => {
        if (err) {
          Log.info('\n Bluetooth Pair error' + JSON.stringify(err))
        } else {
          Log.info('Pairing success' + JSON.stringify(result))
        }
      }
    )
  }

  /**
   * Performs bluetooth connect so that the paired remote get connected
   * @param {*} deviceIDval - device ID of the device
   *  @param {*} deviceTypeValue - deviceTypeValue say, DEFAULT
   */
  _connectDevice(deviceIDval, deviceTypeValue) {
    this.thunderJS.call('org.rdk.Bluetooth', 'connect', { deviceID: deviceIDval, deviceType: deviceTypeValue, profile: deviceTypeValue },
      (err, result) => {
        if (err) {
          Log.info('\n Bluetooth Connect error' + JSON.stringify(err))
        } else {
          Log.info('Connect success' + JSON.stringify(result))
        }
      })
  }

  /**
   * Performs unpairing of device from thunder before disconnecting
   * @param {*} addressval - mac address of the device
   */
  _unpairDevice(deviceIDval) {
    this.thunderJS.call('org.rdk.Bluetooth', 'unpair', { deviceID: deviceIDval },
      (err, result) => {
        if (err) {
          Log.info('\n Bluetooth Unpair error' + JSON.stringify(err))
        } else {
          Log.info('Unpair success' + JSON.stringify(result))
        }
      })
  }

  /**
   * Performs thunder disconnect and revoke for removing bluetooth connectivity
   * @param {*} addressval - mac address of the device
   */
  _disconnectDevice(deviceIDval) {
    this.thunderJS.call('org.rdk.Bluetooth', 'disconnect', { deviceID: deviceIDval },
      (err, result) => {
        if (err) {
          Log.info('\n Bluetooth disconnect error' + JSON.stringify(err))
        } else {
          Log.info('Disconnect success' + JSON.stringify(result))
        }
      })
  }

  /**
   * Gets the realtime devices data stored in thunder and also the details of each devices. Stores it in the devices array
   */
  async getDevices() {
    //Storing the devices globally for future use and rests the data when the method is called for getting realtime data
    window.devices = []
    let discovered = []
    let paired = []
    this.thunderJS.call(
      'org.rdk.Bluetooth',
      'getDiscoveredDevices',
      (err, result) => {
        if (err) {
          Log.info('\n Discovered error' + JSON.stringify(err))
        } else {

          window.devices = result.discoveredDevices
          discovered = result.discoveredDevices
          Log.info('Discovereddevices' + JSON.stringify(result))
        }
      }
    )
    await this.wait_promise(2000)
    this.thunderJS.call(
      'org.rdk.Bluetooth',
      'getPairedDevices',
      (err, result) => {
        if (err) {
          Log.info('\n Discovered error' + JSON.stringify(err))
        } else {
          window.devices = result.pairedDevices
          paired = result.pairedDevices
          Log.info('Paireddevices' + JSON.stringify(result))
        }
      }
    )
    await this.wait_promise(2000)
    window.devices = discovered.concat(paired)
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
}
