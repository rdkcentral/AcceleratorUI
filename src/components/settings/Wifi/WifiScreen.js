/* eslint-disable quotes */
/* eslint-disable semi */
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
import { Lightning, Log } from  '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
import { WifiTile } from './WifiTile'
import { Keyboardscreen } from './Keyboard'
import { ThunderWifiService } from '../../thunder/ThunderWifiService'
/**
 * @export
 * @class WifiScreen
 * @extends Lightning.Component
 * Renders Wifi Screen
 */

export class WifiScreen extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof WifiPairScreen
   * Renders the template
   */
  static _template() {
    return {
      LeftBg: {
        x: 0,
        y: 0,
        rect: true,
        color: Colors.DIM_BLACK,
        w: 960,
        h: 1080,
        ConnectHeader: {
          x: 160,
          y: 430,
          text: {
            fontSize: 58,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Regular'
          }
        },
        ConnectDesc: {
          x: 160,
          y: 518,
          text: {
            fontSize: 21,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Regular'
          }
        }
      },
      RightBg: {
        x: 960,
        y: 0,
        rect: true,
        w: 960,
        h: 1080,
        color: Colors.BG_GREY
      },
      WrongPassword: {
        x: 1625,
        y: 520,
        visible: false,
        Text: {
          x: 10,
          y: 10,
          text: {
            text: "Wrong password",
            textColor: Colors.RED,
            fontFace: 'Medium',
            fontSize: 28,
            textAlign: 'center'
          }
        }
      },  
      Button: { x: 1041, y: 434, type: WifiTile },
      BackButton: { x: 1041, y: 556, type: WifiTile, label: 'Back' },
      KeyBoardScreen: { type: Keyboardscreen , visible: false},
      ThunderWifiService: { type: ThunderWifiService }
    }
  }

  _active() {
    this._setState('Button')	
  }
   
  set security(v) {
    this._security = v;
  }	  

  set label(v) {
    this._label = v;
    this.patch({ LeftBg: { ConnectHeader: { text: { text:this._label }}}})
  }

  set connectedssid(v) {
    this._connectedssid = v
    this._setState('Button')	
  }

  disconnectWifi() {
    this.tag('ThunderWifiService')._disconnectWifi()
    this.tag('ThunderWifiService')._forgetWifi()
    this.fireAncestors('$forgetAndScan');  
  }

  securityCheck() {   
    if (this._security === 0) {   
      this.$connectDesc("Connecting...") 
      this.$connectWifi("");
    }
    else {
      this._setState('InputText')
    }    
  }

  handleWrongPassword() {
    this.$connectDesc("")
    this.tag('WrongPassword').visible=true
    this.tag('KeyBoardScreen').tag('Pass').tag('Text').text.text = ""
  }

  $connectWifi(_passphrase) {
    //Connect method
    this.tag('ThunderWifiService')._connectWifi(this._label, _passphrase, this._security)
    setTimeout( ()=> {
      let errorCode = this.tag('ThunderWifiService').errorCode;
      if (errorCode === 4) {
        this.handleWrongPassword();
      }
      else {
        let wifiState = this.tag('ThunderWifiService').wifiState;
        Log.info("WifiUI: In connectWifi, wifiSTate is ", wifiState)
        this.fireAncestors('$connectReady', wifiState);
      }
    }, 8000)
  }

  $connectDesc(_connectDesc) {
    this.patch({
      LeftBg: {
        ConnectDesc: {
          text: {
            text: _connectDesc
          }
        }
      }
    })
  }

  static _states() {
    return [
      class Button extends this {
        $enter() {
          if (this._connectedssid.ssid === this._label){
            this.connected = true;
            this.patch({
              Button: {
                label: 'Disconnect'
              }
            })
            this.$connectDesc("ssid : " + this._connectedssid.ssid + "\n\n" +
                              "bssid : " + this._connectedssid.bssid + "\n\n" +
                              "Rate : " + this._connectedssid.rate + "\n\n" +
                              "Noise : " + this._connectedssid.noise + "\n\n" +
                              "Security : " + this._connectedssid.security + "\n\n" +
                              "Signal strength : " + this._connectedssid.signalStrength + "\n\n" +
                              "Frequency : " + this._connectedssid.frequency 
                              )
            
          }
          else {
            this.connected = false;
            this.patch({
              Button: {
                label: "Connect"
              }
            })
            this.$connectDesc("Do you want to connect to this network?")
          }
        }
        _handleEnter() {
          if (this.connected === false) {
            this.securityCheck();
          }
          else if (this.connected === true) {
            this.disconnectWifi()
          }
        }
        _getFocused() {
          return this.tag('Button')
        }
        _handleDown() {
          this._setState('BackButton')
        }
		    _handleBack() {
          this.fireAncestors('$setWifiScreen')
		    }
      },
      class BackButton extends this {
        $enter() {
          Log.info('Enter')
        }
        _handleEnter() {
          this.fireAncestors('$setWifiScreen')
        }
        _getFocused() {
          return this.tag('BackButton')
        }
        _handleUp() {
          this._setState('Button')
        }	
		    _handleBack() {
         this.fireAncestors('$setWifiScreen')
		    } 
      },
	    class InputText extends this {
        $enter() {
        this.tag('Button').visible = false;
	       this.tag('BackButton').visible = false;
         this.tag('KeyBoardScreen').visible=true;
        }
        _getFocused() {
          return this.tag('KeyBoardScreen')
        }
        _handleBack() {
          this.fireAncestors('$setWifiScreen')
        }
	    }
    ]
  }
}

