/**
 * If not stated otherwise in this file or this component's LICENSE
 * file the following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
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
 **/

import { Storage, Log } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'
/**
 * Class for Xcast thunder plugin apis.
 */

export default class XcastApi {
  constructor() {
    console.log('XCtag:Xcast constructor')
    this._events = new Map()
  }

  /**
   * Function to activate the Xcast plugin
   */
  activate() {
    return new Promise((resolve, reject) => {
      const config = {
        host: '127.0.0.1',
        port: 9998,
        default: 1
      }
      this._thunder = ThunderJS(config)
      this.callsign = 'org.rdk.Xcast'
      //this._thunder.call('Controller', 'deactivate', { callsign: this.callsign })
      this._thunder
        .call('Controller', 'activate', { callsign: this.callsign })
        .then(result => {
          Log.info('XCtag:Xcast activation success')
          this._thunder
            .call('org.rdk.Xcast', 'setEnabled', { enabled: true })
            .then(result => {
              Log.info('XCtag:Inside setenabled: Xcast set enabled success')
              this._thunder
                .call('org.rdk.Xcast', 'getEnabled')
                .then(result => {
                  if (result.success) {
                    Log.info('XCtag:Inside getenabled: Xcast get enabled success')
                    this._thunder.on(this.callsign, 'onApplicationLaunchRequest', notification => {
                      Log.info('XCtag:onApplicationLaunchRequest ' + JSON.stringify(notification))
                      if (this._events.has('onApplicationLaunchRequest')) {
                        this._events.get('onApplicationLaunchRequest')(notification)
                      }
                    })
                    this._thunder.on(this.callsign, 'onApplicationHideRequest', notification => {
                      Log.info('XCtag:onApplicationHideRequest ' + JSON.stringify(notification))
                      if (this._events.has('onApplicationHideRequest')) {
                        this._events.get('onApplicationHideRequest')(notification)
                      }
                    })
                    this._thunder.on(this.callsign, 'onApplicationResumeRequest', notification => {
                      Log.info('XCtag:onApplicationResumeRequest ' + JSON.stringify(notification))
                      if (this._events.has('onApplicationResumeRequest')) {
                        this._events.get('onApplicationResumeRequest')(notification)
                      }
                    })
                    this._thunder.on(this.callsign, 'onApplicationStopRequest', notification => {
                      Log.info('XCtag:onApplicationStopRequest ' + JSON.stringify(notification))
                      if (this._events.has('onApplicationStopRequest')) {
                        this._events.get('onApplicationStopRequest')(notification)
                      }
                    })
                    this._thunder.on(this.callsign, 'onApplicationStateRequest', notification => {
                      Log.info('XCtag:onApplicationStateRequest ' + JSON.stringify(notification))
                      if (this._events.has('onApplicationStateRequest')) {
                        this._events.get('onApplicationStateRequest')(notification)
                      }
                    })
                    resolve(true)
                  } else {
                    Log.info('XCtag:Inside getenabled Xcast enabled failed')
                  }
                })
                .catch(err => {
                  Log.info('XCtag:get Enabling failure', err)
                  reject('XCtag:Xcast get enabling failed', err)
                })
            })
            .catch(err => {
              Log.info('XCtag:set enable failure', err)
              reject('XCtag:Xcast set enable failed', err)
            })
        })
        .catch(err => {
          Log.info('XCtag:Activation failure', err)
          reject('XCtag:Xcast activation failed', err)
        })
    })
  }

  /**
   *
   * @param {string} eventId
   * @param {function} callback
   * Function to register the events for the Xcast plugin.
   */
  registerEvent(eventId, callback) {
    this._events.set(eventId, callback)
  }

  /**
   * Function to deactivate the Xcast plugin.
   */
  deactivate() {
    this._events = new Map()
    this._thunder = null
  }

  /**
   * Function to get the plugin name for the application name.
   * @param {string} app App instance.
   */
  xcastApps(app) {
    if (Object.keys(this.supportedApps()).includes(app)) {
      return this.supportedApps()[app]
    } else return false
  }

  /* Used to fetch the state of the plugin
   *
   * @param_values string: callsign of the plugin,
   *               string: response from of the state request
   * @return bool: if the state request was successfull or not.
   */
  getAppState(plugin) {
    return new Promise((resolve, reject) => {
      this._thunder.call(plugin, 'state', (err, result) => {
        if (err) {
          reject(false)
        } else {
          resolve(result)
        }
      })
    })
  }

  _deactivateApp(callSign) {
    this._thunder.Controller.deactivate({ callsign: callSign }, (err, result) => {
      if (err) {
        Log.error('XCtag:Failed to deactivate ' + callSign)
      } else {
        Log.info('XCtag:Successfully deactivated ' + callSign)
      }
    })
    Storage.set('applicationType', '')
  }

  /**
   * Function to notify the state of the app.
   */
  onApplicationStateChanged(params) {
    return new Promise(resolve => {
      Log.info('XCtag:Notifying back')
      this._thunder.call('org.rdk.Xcast', 'onApplicationStateChanged', params).then(result => {
        Log.info('XCtag:Inside onApplicationStateChanged' + JSON.stringify(result))
        resolve(result)
      })
    })
  }

  static supportedApps() {
    var xcastApps = { AmazonInstantVideo: 'Amazon', YouTube: 'Cobalt', NetflixApp: 'Netflix' }
    return xcastApps
  }
}
