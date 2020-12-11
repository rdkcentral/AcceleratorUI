/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
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
import { ThunderWifiService } from '../../thunder/ThunderWifiService'
import { WifiScreen } from './WifiScreen'
import { WifiTile } from './WifiTile'

/**
 * @export
 * @class Wifi
 * @extends Lightning.Component
 * Renders the Wifi Component
 */
export class Wifi_Class extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof Wifi
   * Renders the template
   */
  static _template() {
    return {
      WifiBg: {
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
        WifiLabel: {
          x: 82,
          y: 113,
          text: {
            text: ' WIFI',
            fontSize: 36,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Medium'
          }
        },
        Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
        DiscoverWifi: {
          x: 81,
          y: 209,
          label: 'Discover Wifi Networks',
          type: WifiTile
        },
        NetworkControl: {
         x: 85,
         y: 325,
         text: {
           text: 'Wifi Networks ',
           fontSize: 34,
           textColor: Colors.TRANSPARENT_GREY,
           fontFace: 'Regular'
         }
        },
        DiscoveredWifi: {
          type: Lightning.components.ListComponent,
          x: 81,
          y: 398,
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
        ThunderWifiService: { type: ThunderWifiService }
      }
    }
  }

  _init() {
    this.availableWifi = "";
    this.connectedssid = {
      ssid: "",
      bssid: "",
      rate: "",
      noise: "",
      security: "",
      signalStrength: "",
      frequency: ""
    };
    this.scanFlag = 1;
    this.removeChildFlag = 0;
   }

  _active() {
    this._setState('DiscoverWifi')
  }
  
  startScanWifi() {
    Log.info('WifiUI: startScanWifi enter.')
    this.tag('NetworkControl').patch({
        text: { text: 'Searching for networks...' }
    })
    this.tag('ThunderWifiService')._startScan()
	  setTimeout( ()=> {
      this.availableWifi = this.tag("ThunderWifiService").ssidList;
      Log.info('WifiUI: Available Wifis:', JSON.stringify(this.availableWifi));
      if (this.availableWifi === "") {
        this.tag('DiscoverWifi').visible = true
        this.tag('NetworkControl').patch({
          text: { text: 'Could not find any network. Please try again..' } 
        })
        this._setState('DiscoverWifi');
      }
      else {
        this.tag('ThunderWifiService')._getConnectedSSID();
        setTimeout(() => {
          this.connectedssid = this.tag('ThunderWifiService').connectedssid
          this.tag('DiscoveredWifi').items = this.availableWifi.map((data, index) => {
            if (this.connectedssid.ssid === data.ssid) {
              return {
                ref: 'DiscoveredWifi' + index,
                type: WifiTile,
                label: data.ssid,
                security: data.security,
                secondarylabel: 'Connected',
                ready: false
              }
            }
            else {
              return {
                ref: 'DiscoveredWifi' + index,
                type: WifiTile,
                label: data.ssid,
                security: data.security,
                secondarylabel: 'Not  connected',
                ready: false
              }
            }
          });
          this.tag('NetworkControl').patch({
            text: { text: 'Wifi Networks' }
          })
          this._setState('DiscoveredWifi')
        }, 1000)
      }
	  }, 7000)
  }
 
  $connectReady(_wifiState) {
    Log.info("WifiUI: wifistate in connectReady is ", _wifiState)
    if (_wifiState === 5) {
      this.tag('ThunderWifiService')._getConnectedSSID();
      setTimeout (() => {
        this.connectedssid = this.tag('ThunderWifiService').connectedssid; 
        this.tag('DiscoveredWifi').items = this.availableWifi.map((data, index) => {
          if (this.connectedssid.ssid === data.ssid) {
            return {
              ref: 'DiscoveredWifi' + index,
              type: WifiTile,
              label: data.ssid,
              security: data.security,
              secondarylabel: 'Connected',
              ready: false
            }
          }
          else {
            return {
              ref: 'DiscoveredWifi' + index,
              type: WifiTile,
              label: data.ssid,
              security: data.security,
              secondarylabel: 'Not  connected',
              ready: false
            }
          }
        });
        this.$setWifiScreen()
      }, 1000);
    }
    else {
      Log.info("WifiUI: In WifiSettings, connection failed. Rescanning ")
      this.$doRescan();
    }
  }

  $forgetAndScan() {
    
    Log.info("WifiUI: In WifiSettings, forgetAndScan")
    this.availableWifi = "";
    this.connectedssid = {
      ssid: "",
      bssid: "",
      rate: "",
      noise: "",
      security: "",
      signalStrength: "",
      frequency: ""
    };
    Log.info("WifiUI: In WifiSettings, forgetAndScan , doing a rescan..")
    this.$doRescan();
  }
    
  $setWifiScreen() {
    // wifi Screen
    this.childList.remove(this.tag('ConnectingPage'))
    this._setState('DiscoveredWifi')
  }

  $doRescan() {
    this.removeFlag = 1;
    this.scanFlag = 1;
    this._setState('DiscoverWifi')
  }

  static _states() {
    return [
      class DiscoverWifi extends this {
        $enter() {
          if (this.removeFlag === 1) {
            this.removeFlag = 0;
            this.childList.remove(this.tag('ConnectingPage'))
            this.tag('DiscoveredWifi').visible = false
          }
          else {
            this.tag('DiscoveredWifi').visible = true
          }
          if (this.scanFlag === 1) {
            this.scanFlag = 0;
            this.startScanWifi();
          }   
        }
        _getFocused() {
          return this.tag('DiscoverWifi')
        }
        _handleDown() {
          if (this.tag('DiscoveredWifi').items.length > 0) {
            this._setState('DiscoveredWifi')
          }
        }
        _handleEnter() {
          Log.info('WifiUI: DiscoverWifi Button entered.')
          this.startScanWifi()
        }
      },
	    class DiscoveredWifi extends this {
        $enter() {
          this.tag('NetworkControl').visible = true
          this.tag('DiscoveredWifi').visible = true
        }
        _getFocused() {
          return this.tag('DiscoveredWifi').element
        }
        _handleUp() {
          if (0 === this.tag('DiscoveredWifi').index) {
            this._setState('DiscoverWifi')
          } else if (0 != this.tag('DiscoveredWifi').index) {
            this.tag('DiscoveredWifi').setPrevious()
          }
        }
        _handleDown() {
          if (this.tag('DiscoveredWifi').length - 1 != this.tag('DiscoveredWifi').index) {
            this.tag('DiscoveredWifi').setNext()
          }
        }
        _handleEnter() {
          // connect page
          Log.info("WifiUI: In WifiSettings, ssid and security", this.tag('DiscoveredWifi').element.label, this.tag('DiscoveredWifi').element.security)
          this.childList.a({ ref: 'ConnectingPage', type: WifiScreen, x: -960, label: this.tag('DiscoveredWifi').element.label, security: this.tag('DiscoveredWifi').element.security, connectedssid: this.connectedssid})
          this._setState('ConnectingScreen')
        }
      },
      class ConnectingScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('ConnectingPage') 
        }
      }
    ]
  }
}
