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
import { Lightning, Log,  Utils } from '@lightningjs/sdk'
import { SettingsMenuItem } from '../settings/SettingsMenuItem'
import { TimeUtils } from '../../utils/TimeUtils'
import { Bluetooth } from './bluetooth/BluetoothSettings'
import { ImageConstants } from '../../constants/ImageConstants'
import { Colors } from '../../constants/ColorConstants'
import { StringConstants } from '../../constants/StringConstants'
import { Diagnostic } from './diagnostics/DiagnosticScreen'
import { Wifi_Class } from './Wifi/WifiSettings'
import { Resolution_Class } from './generalsettings/ResolutionSettings'
var label_fontColor ="";
/**
 * @export
 * @class SettingsScreen
 * @extends Lightning.Component
 * Renders the SttingsScreen
 */
/* Settings Page Component  */
export class SettingsScreen extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof SettingsScreen
   * Renders the template
   */
  static _template() {
    return {
      SettingsBg: {
       rect: true,
        color: Colors.PURPLE,
       // src: Utils.asset(ImageConstants.SETTINGS_BG),
        w: 1740,
        h: 1080,
        x: 180,
        Header: {
          rect: true,
          x: 52,
          y: 54,
          w: 131,
          h: 43,
          text: {
            text: 'Settings',
           fontFace: 'Regular',
            textColor: Colors.MIXED_GREY,
            fontSize: 36
          }
        },
       /* Time: {
          x: 1550,
          y: 61,
          text: {
            text: '',
            fontFace: 'Medium',
            fontSize: 32,
            textColor: Colors.LIGHTER_WHITE
          }
        },*/
        SettingsMenu: {
          type: Lightning.components.ListComponent,
          x: 52,
          y: 344,
          w: 1700,
          h: 500,
          itemSize: 350,
          horizontal: true,
          roll: true,
          rollMin: 0,
          rollMax: 0,
          spacing: 30,
          invertDirection: false,
          viewportSize: 1300,
          clipping: true
        }
      },
      SelectedSetting: { x: 960, y: 0, w: 960, h: 1080, visible: false }
    }
  }

  _construct() {
    this.pairedDevices = []
  }

  _init() {
   // this.updateTimebar()
  //  setInterval(this.updateTimebar.bind(this), 60000)
    //this.tag('SettingsBg').patch({ src: Utils.asset(ImageConstants.SETTINGS_BG)});
    this.tag('SettingsMenu').items = [
      {
        menuIcon: ImageConstants.GENERAL_SETTINGS,
        menuName: StringConstants.GENERAL_SETTINGS
       
      },
      {
        menuIcon: ImageConstants.BLUETOOTH_MENU,
        menuName: StringConstants.BLUETOOTH_REMOTE_AND_DEVICES
     
      },
      /*{
        menuIcon: ImageConstants.NETWORK_INTERFACES,
        menuName: StringConstants.NETWORK_INTERFACES
      },*/
      {
        menuIcon: ImageConstants.DIAGNOSTICS,
        menuName: StringConstants.DIAGNOSTICS
      
      },
      {
        menuIcon: ImageConstants.WIFILOGO,
        menuName: StringConstants.WIFI
        
      }
     /* {
        menuIcon: ImageConstants.PARENTAL_CONTROL,
        menuName: StringConstants.PARENTAL_CONTROL
      }*/

    ].map((data, index) => {
      return {
        ref: 'SettingsMenuItem_' + index,
        type: SettingsMenuItem,
        items: data
      }
    })
    this._setState('MenuState')
  }

  /**
   * Returns the current time
   */
 /* updateTimebar() {
    this.time = new TimeUtils()
    this.timeText = this.time.getCurrentTime()
    this.tag('Time').patch({ text: { text: this.timeText } })
  }*/
 set theme(v)
  {
  console.log(v["settings"].bg_image)
  
    if(v["settings"].bg_image)
  {
   this.tag('SettingsBg').patch({ src: Utils.asset(v["settings"].bg_image)}); 
  }
 else if(v["settings"].bg_color)
  {   
      this.tag('SettingsBg').rect = true;
      this.tag('SettingsBg').color = v["settings"].bg_color;
  
  }
    if(v["settings"].fontFace)
  {
    this.tag('SettingsBg').patch({Header:{text:{fontFace:v["settings"].fontFace}}}); 
    
  }
       if(v["settings"].text_fontColor)
            {
                
            label_fontColor =v["settings"].text_fontColor;
             for(var i=0;i< this.tag('SettingsMenu').items.length;i++)
                   {
                    this.tag('SettingsMenu').tag('SettingsMenuItem_'+i).fontColor = label_fontColor
                           
                    }
                 }
 }
  _focus() {
    this.tag('SettingsBg').x = 180
  }

  _unfocus() {
    this.tag('SettingsBg').x = 400
  }

  /**
   * @static
   * @returns
   * @memberof SettingsScreen
   * SettingsScreen States
   */
  static _states() {
    return [
      class MenuState extends this {
        $enter() {}
        _handleRight() {
          if (this.tag('SettingsMenu').length - 1 != this.tag('SettingsMenu').index) {
            this.tag('SettingsMenu').setNext()
          }
        }
        _handleLeft() {
          if (this.tag('SettingsMenu').index == 0) {
            this.fireAncestors('$setSideNav')
          } else if (0 != this.tag('SettingsMenu').index) {
            this.tag('SettingsMenu').setPrevious()
          }
        }
        _handleEnter() {
          Log.info('\n Selected Menu ----')
         if (this.tag('SettingsMenu').index == 0  ) {
          this.tag('SelectedSetting').visible = true
          this._setState('ResolutionState')
          this.tag('SelectedSetting').childList.a({
            ref: 'ResolutionScreen',
            type: Resolution_Class,
            x: 0,
            y: 0,
            w: 960,
            h: 1080
            })
          }
          else if (this.tag('SettingsMenu').index == 1  ) {
            this.tag('SelectedSetting').visible = true
            this._setState('SelectedState')
            this.tag('SelectedSetting').childList.a({
              ref: 'BluetoothScreen',
              type: Bluetooth,
              x: 0,
              y: 0,
              w: 960,
              h: 1080
            })
          }
          else if (this.tag('SettingsMenu').index == 2) {
            this.tag('SelectedSetting').visible = true
            this._setState('DiagnosticState')
            this.tag('SelectedSetting').childList.a({
              ref: 'DiagnosticScreen',
              type: Diagnostic,
              x: 0,
              y: 0,
              w: 960,
              h: 1080
            })
          }
          else if (this.tag('SettingsMenu').index == 3)
          {
            this.tag('SelectedSetting').visible = true
            this._setState('WifiSelectedState')
            this.tag('SelectedSetting').childList.a({
              ref: 'WifiScreen',
              type: Wifi_Class,
              x: 0,
              y: 0,
              w: 960,
              h: 1080
            })
          }
        }
        _getFocused() {
          return this.tag('SettingsMenu').element
        }
        $exit() {}
      },
      class SelectedState extends this {
        $enter() {}
        _handleBack() {
          this.tag('SelectedSetting').childList.clear()
          this.tag('SelectedSetting').visible = false
          this._setState('MenuState')
        }
        _handleLeft() {
          this.tag('SelectedSetting').childList.clear()
          this.tag('SelectedSetting').visible = false
          this._setState('MenuState')
        }
        _handleRight() {}

        _handleUp() {}

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedSetting').tag('BluetoothScreen')
        }
        $exit() {}
      },
      class DiagnosticState extends this {
        $enter() {}
        _handleBack() {
          this.tag('SelectedSetting').childList.clear()
          this.tag('SelectedSetting').visible = false
          this._setState('MenuState')
        }
        _handleLeft() {
          this.tag('SelectedSetting').childList.clear()
          this.tag('SelectedSetting').visible = false
          this._setState('MenuState')
        }
        _handleRight() {}

        _handleUp() {}

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedSetting').tag('DiagnosticScreen')
        }
        $exit() {}
      },
      class WifiSelectedState extends this {
        $enter() {}
        _handleBack() {
          this.tag('SelectedSetting').childList.clear()
          this.tag('SelectedSetting').visible = false
          this._setState('MenuState')
        }
        _handleLeft() {
          this.tag('SelectedSetting').childList.clear()
          this.tag('SelectedSetting').visible = false
          this._setState('MenuState')
        }
        _handleRight() {} 

        _handleUp() {}

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedSetting').tag('WifiScreen')
        }
        $exit() {}
      },
      class ResolutionState extends this {
        $enter() {}
        _handleBack() {
          this.tag('SelectedSetting').childList.clear()
            this.tag('SelectedSetting').visible = false
            this._setState('MenuState')
        }
        _handleLeft() {
          this.tag('SelectedSetting').childList.clear()
            this.tag('SelectedSetting').visible = false
            this._setState('MenuState')
        }
        _handleRight() {}

        _handleUp() {}

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedSetting').tag('ResolutionScreen')
        }
        $exit() {}
      }
    ]
  }
}
