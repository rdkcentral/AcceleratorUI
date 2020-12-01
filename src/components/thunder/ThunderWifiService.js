/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright Â© 2020 Tata Elxsi Limited
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

/*
 *This file does not use thunderservices for the time being. It is intended to be replaced by the same
 */
import { Lightning, Log } from '@lightningjs/sdk'
/**
 * @export
 * @class ThunderWifiService
 * @extends Lightning.Component
 * Wifi Thunder calls
 */
export class ThunderWifiService extends Lightning.Component {
  _construct() {
    this.pluginName = 'org.rdk.Wifi';
    this.pluginVersion = '1';
    this.wsResps = [];
    this.connect = () => {
      return new Promise((resolve, reject) => {
        this.ws = new WebSocket('ws://127.0.0.1:9998/jsonrpc', 'notification');
        this.ws.onopen = () => {
          resolve(this.ws)
        }
        this.ws.onerror = error => {
          reject(error)
        }
        this.ws.onmessage = e => {
          this.wsResps.push(e.data)
        }
      });
    };
    this.responseId = 0
    this.responseTimeout = 10000;
    this.checkPeriod = 500;

    this.promiseTimeout = (ms, promise) => {
      // Create a promise that rejects in <ms> milliseconds
      let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
          clearTimeout(id);
          reject('Timed out in ' + ms + 'ms.')
        }, ms)
      })

      // Returns a race between our timeout and the passed in promise
      return Promise.race([promise, timeout])
    }

    /**
     * Invoke a method and process response.
     *
     * @param {*} method  The name of the method.
     * @param {*} params  Any parameters as object of names and values.
     * @param {*} timeout Optional timeout to wait for response (defaults to 10s).
     * @param {*} check   Optional function used to check response.
     */
    this.invoke = (method, params, timeout, check) => {
      return new Promise((resolve, reject) => {
        Log.info('WifiUI: Invoke called.')
        const cmd = JSON.stringify({
          jsonrpc: '2.0',
          id: ++this.responseId,
          method: this.pluginName + '.' + this.pluginVersion + '.' + method,
          params: params === undefined ? {} : params
        })
        this.ws.send(cmd);
        Log.info('WifiUI: Command sent:', cmd)
        let interval
        const checkInputResponses = () => {
          for (let i = 0; i < this.wsResps.length; i++) {
            const e = this.wsResps[i];
            const resp = JSON.parse(e);
            Log.info('WifiUI: Response:', JSON.stringify(resp))
            if (method === 'clearSSID' || method === 'saveSSID') {
              this._result = resp.result.result;
              Log.info('WifiUI: Resultof forget/save:', resp.result.result)
            }
            if (method === 'getConnectedSSID') {
              this._connectedssid = resp.result;
              Log.info('WifiUI: Result of getConnectedSSID: ', resp.result)
            }
            if (resp.id !== undefined && resp.id === this.responseId) {
              if (interval !== undefined) clearInterval(interval);
              this.wsResps.splice(i, 1)
              if (check !== undefined) check(resp.result)
              resolve(resp);
            }
          }
        };
        if (timeout === undefined) timeout = this.responseTimeout;
        checkInputResponses();
        interval = setInterval(() => {
          checkInputResponses();
          timeout -= this.checkPeriod;
          if (timeout <= 0) {
            clearInterval(interval);
            reject();
          }
        }, this.checkPeriod);
      });
    };

    /**
     * Wait for an event from Thunder.
     *
     * @param {*} name    The name of the event.
     * @param {*} id      The id of the request associated with the event.
     * @param {*} timeout An optional timeout to override the default one.
     * @param {*} check   Optional function used to check event. Return true if more events in this sequence are expected.
     */
    this.waitEvent = (name, id, timeout, check) => {
      return new Promise((resolve, reject) => {
        // Returns true if the response has been found
        Log.info('WifiUI: Waitevent entered.')
        const checkInputResponses = () => {
          for (let i = 0; i < this.wsResps.length; i++) {
            const resp = JSON.parse(this.wsResps[i]);
            if (resp.method !== undefined && resp.method === id + '.' + name) {
              Log.info(
                'WifiUI: waitEvent ',
                id,
                '.',
                name,
                ' received: ',
                JSON.stringify(resp.params)
              )
              if (name === 'onAvailableSSIDs') {
                this._ssidList = resp.params.ssids;
                Log.info('WifiUI: SSIDList obtained:', JSON.stringify(resp.params.ssids));
              } else if (name === 'onWIFIStateChanged') {
                this._wifiState = resp.params.state;
                Log.info('WifiUI: WIFIState obtained:', resp.params.state);
              } else if (name === 'onError') {
                this._errorCode = resp.params.code;
                Log.info('WifiUI: Errorcode obtained:', resp.params.code);
              }
              this.wsResps.splice(i, 1);

              // Is the response to be checked?
              let finished = true;
              if (check !== undefined) {
                // By returning true it implies that more events of this time are expected
                let moreData = check(resp.params)
                if (moreData !== undefined && moreData === true) {
                  finished = false;
                  Log.info('WifiUI: waitEvent expecting more results...');
                }
              }
              if (finished) {
                resolve(resp);
                return true;
              }
            }
          }
          // Haven't found the event
          return false;
        };
        if (timeout === undefined) timeout = this.responseTimeout;
        if (checkInputResponses()) return
        let interval = setInterval(() => {
          // Have we found the response?
          if (checkInputResponses()) {
            clearInterval(interval);
            return;
          }
          // Have we timed out?
          timeout -= this.checkPeriod;
          if (timeout <= 0) {
            clearInterval(interval);
            reject();
          }
        }, this.checkPeriod);
      });
    };
  }

  _startScan() {
    this._ssidList = ''
    Log.info('WifiUI: ThunderWifiService startScan.')
    this.connect()
      .catch(error => {
        Log.info("WifiUI: web socket can't be opened: " + JSON.stringify(error, ["message", "arguments", "type", "name"]))
      })
      .then(() => {
        return this.invoke(
          'register',
          { event: 'onAvailableSSIDs', id: 1 },
          undefined,
          result => {}
        )
      })
      .then(() => {
        return this.invoke('startScan', { incremental: false }, undefined, result => {})
      })
      .then(() => {
        return this.waitEvent('onAvailableSSIDs', 1, params => {})
      })
      .then(() => {
        return this.invoke(
          'unregister',
          { event: 'onAvailableSSIDs', id: 1 },
          undefined,
          result => {}
        )
      }).
      then(() => {
        this.ws.close();
      })
  }

  _getConnectedSSID() {
    this._connectedssid = ''
    Log.info('WifiUI: ThunderWifiService getConnectedSSID.')
    this.connect()
      .catch(error => {
        Log.info("WifiUI: web socket can't be opened: " + error)
      })
      .then(() => {
        // Try to clear, clear doesn't return anything that's useful to test
        return this.invoke('getConnectedSSID', {});
      }).
      then(() => {
        this.ws.close();
      })
  }

  _connectWifi(_ssid, _passphrase, _securityMode) {
    this._errorCode = 100;
    this._wifiState = 100;
    this.passphraseWrong = false;

    Log.info('WifiUI: ThunderWifiService connectWifi entered.')
    Log.info('WifiUI: params', _ssid, _passphrase, _securityMode)
    this.connect()
      .catch(error => {
        Log.info("WifiUI: web socket can't be opened: " + error)
      })
      .then(() => {
        // Start listening to errors
        return this.invoke('register', { event: 'onError', id: 3 }, undefined, result => {})
      })
      .then(() => {
        // Start listening to wifi state changes
        return this.invoke(
          'register',
          { event: 'onWIFIStateChanged', id: 4 },
          undefined,
          result => {}
        )
      })
      .then(() => {
        return this.invoke('connect', {
          ssid: _ssid,
          passphrase: _passphrase,
          securityMode: _securityMode
        })
      })
      .then(() => {
        let wait = this.promiseTimeout(
          1000,
          this.waitEvent('onError', 3, undefined, params => {
            if ('code' in params && params.code === 4) this.passphraseWrong = true
            return false
          })
        );
        wait.then(() => {
          return this.invoke('unregister', { event: 'onError', id: 3 }, undefined, result => {})
        })
      })
      .then(() => {
        // Expect state change to connecting...
        return this.waitEvent('onWIFIStateChanged', 4, undefined, params => {
          if (this.passphraseWrong === true) {
            return false;
          }
          if ('state' in params && (params.state === 4 || params.state === 2)) return true
          else return false
        });
      })
      .then(() => {
        // Stop receiving 'onWIFIStateChanged' events.
        return this.invoke(
          'unregister',
          { event: 'onWIFIStateChanged', id: 4 },
          undefined,
          result => {}
        )
      }).
      then(() => {
        this.ws.close();
      })
  }

  _disconnectWifi() {
    this._wifiState = 100;
    Log.info('WifiUI: ThunderWifiService disconnectWifi.')
    this.connect()
      .catch(error => {
        Log.info("WifiUI: web socket can't be opened: " + error)
      })
      .then(() => {
        // Start listening to wifi state changes
        return this.invoke(
          'register',
          { event: 'onWIFIStateChanged', id: 4 },
          undefined,
          result => {}
        )
      })
      .then(() => {
        // Try to disconnect, disconnect doesn't return anything that's useful to test
        return this.invoke('disconnect', {});
      })
      .then(() => {
        // Expect state change to connecting...
        return this.waitEvent('onWIFIStateChanged', 4, undefined, params => {
          if ('state' in params && (params.state === 4 || params.state === 5)) return true
          else return false
        });
      })
      .then(() => {
        // Stop receiving 'onWIFIStateChanged' events.
        return this.invoke(
          'unregister',
          { event: 'onWIFIStateChanged', id: 4 },
          undefined,
          result => {}
        )
      })
      .then(() => {
        this.ws.close();
      })
  }

  _forgetWifi() {
    Log.info('WifiUI: ThunderWifiService forgetWifi.')
    this.connect()
      .catch(error => {
        Log.info("WifiUI: web socket can't be opened: " + error)
      })
      .then(() => {
        // Try to clear, clear doesn't return anything that's useful to test
        return this.invoke('clearSSID', {});
      })
      .then(() => {
        this.ws.close();
      })
  }

  _saveWifi(_ssid, _passphrase, _securityMode) {
    Log.info('WifiUI: ThunderWifiService saveWifi.')
    this.connect()
      .catch(error => {
        Log.info("WifiUI: web socket can't be opened: " + error)
      })
      .then(() => {
        // Try to clear, clear doesn't return anything that's useful to test
        return this.invoke('saveSSID', {
          ssid: _ssid,
          passphrase: _passphrase,
          securityMode: _securityMode
        })
      })
      .then(() => {
        this.ws.close();
      })
  }

  //Return SSIDList obtained from onAvaialableSSIDs event fired on startScan
  get ssidList() {
    return this._ssidList;
  }

  //Return connected ssid obtained from getConnectedSSID
  get connectedssid() {
    return this._connectedssid;
  }

  //Return WifiState obtained from onWIFIStateChanged event fired on connect/disconnect
  get wifiState() {
    Log.info('WifiUI: In thunderwifi, wifistate is ', this._wifiState)
    return this._wifiState;
  }

  //Return Error Code obtained from onError event
  get errorCode() {
    Log.info('WifiUI: In thunderwifi, errorCode is ', this._errorCode)
    return this._errorCode;
  }

  //Return the result of saveSSID/clearSSID
  get result() {
    return this._result;
  }
}
