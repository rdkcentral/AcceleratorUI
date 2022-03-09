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
 import { Lightning, Utils, Log, Language, Storage} from '@lightningjs/sdk'
 import { Colors } from '../../../constants/ColorConstants'
 import { ImageConstants } from '../../../constants/ImageConstants'
 import { PowerSettingsTile } from './PowerSettingsTile'
 import { ThunderPowerService } from '../../thunder/ThunderPowerService'
 import { PowerSettingsParingScreen } from './PowerSettingsPairScreen'
 
 /**
  * @export
  * @class Resolution
  * @extends Lightning.Component
  * Renders the Resolution Component
  */
 export class PowerSettings extends Lightning.Component {
   /**
    * @static
    * @returns
    * @memberof general settings
    * Renders the template
    */
   static _template() {
     return {
       PowerSettingsBg: {
         RectangleWithGradientLeftRight: {
           w: 960,
           h: 1080,
           rect: true,
           colorLeft: Colors.DIM_BLACK,
           colorRight: Colors.DARK_BLACK
         },
         BackArrow: { x: 81, y: 54, src: Utils.asset(ImageConstants.BACK_ARROW) },
         SettingsLabel: {
           x: 133,
           y: 54,
           text: {
             text: Language.translate('Settings'),
             fontSize: 28,
             textColor: Colors.TRANSPARENT_GREY,
             fontFace: 'Regular'
           }
         },
         PowerSettingsLabel: {
           x: 82,
           y: 113,
           text: {
             text: Language.translate('Power Modes'),
             fontSize: 36,
             textColor: Colors.LIGHTER_WHITE,
             fontFace: 'Medium'
           }
         },
         Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
         DiscoverPowerSettings: {
           x: 81,
           y: 209,
           label: Language.translate('Power Modes'),
           type: PowerSettingsTile
         },
         PowerSettingsControl: {
          x: 85,
          y: 325,
          text: {
            text: Language.translate('Power Modes'),
            fontSize: 34,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
         },
         DiscoveredPowerSettings: {
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
           invertDirection: true,
           clipping: true
           }
         },
       ThunderPowerService: {
      type: ThunderPowerService
      }
     }
   }
 
   _init() {
    
     console.log("Ptag: PowerSettings init");
     this.tag('DiscoveredPowerSettings').items = ["STANDBY","DEEP_SLEEP", "LIGHT_SLEEP"].map((data, index) => {
     console.log("Ptag: PowerSettings data"+data);
      return {
        ref: 'DiscoveredPowerSettings' + index,
        type: PowerSettingsTile,
        items: data,
        label: data
      }
    })
    this._setState('DiscoverPowerSettings')
    }
 
   _active() {
     this._setState('DiscoverPowerSettings')
   }
  
  $PowerSettingsScreen() {
    this.childList.remove(this.tag('PowerSettingsPairingPage'))
    this._setState('DiscoveredPowerSettings')
  }

  
 
   static _states() {
     return [
       class DiscoverPowerSettings extends this {
         $enter() {
             this.tag('DiscoveredPowerSettings').visible = true
         }
         _getFocused() {
           return this.tag('DiscoverPowerSettings')
         }
         _handleDown() {
           if (this.tag('DiscoveredPowerSettings').items.length > 0) {
             this._setState('DiscoveredPowerSettings')
           }
         }
         _handleEnter() {
           Log.info('Ptag: DiscoverPowerSettings Button entered.')
           this._setState('DiscoveredPowerSettings')
         }
       },
 	    class DiscoveredPowerSettings extends this {
         $enter() {
           this.tag('PowerSettingsControl').visible = true
           this.tag('DiscoveredPowerSettings').visible = true
         }
         _getFocused() {
         
          return this.tag('DiscoveredPowerSettings').element
          
         }
         _handleUp() {
           if (0 === this.tag('DiscoveredPowerSettings').index) {
             this._setState('DiscoverPowerSettings')
           } else if (0 != this.tag('DiscoveredPowerSettings').index) {
             this.tag('DiscoveredPowerSettings').setPrevious()
           }
         }
         _handleDown() {
           if (this.tag('DiscoveredPowerSettings').length - 1 != this.tag('DiscoveredPowerSettings').index) {
             this.tag('DiscoveredPowerSettings').setNext()
          
           }
         }
      _handleBack() {
        console.log("Ptag:handle back called")
        this._setState('DiscoverPowerSettings')
        }
         _handleEnter() {

           Storage.set("selectedPowerState", this.tag('DiscoveredPowerSettings').element.label)

             this.childList.a({ ref: 'PowerSettingsPairingPage', type: PowerSettingsParingScreen, x: -960 })
             this._setState('PowerSettingsParingScreen')        

         }
       },
       class PowerSettingsParingScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('PowerSettingsPairingPage')
        }
      }
     ]
   }
 }
