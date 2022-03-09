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
 import { GeneralSettingsTile } from './GeneralSettingsTile'
 import { VideoSettingsTile } from './VideoSettingsTile'
 import { ThunderAudioVideoService } from '../../thunder/ThunderAudioVideoService'
 import { Soundmode_Class } from './SoundmodeSettings'
 /**
  * @export
  * @class Resolution
  * @extends Lightning.Component
  * Renders the Resolution Component
  */
 export class Audio_Class extends Lightning.Component {
   /**
    * @static
    * @returns
    * @memberof general settings
    * Renders the template
    */
   static _template() {
     return {
       AudioSettingsBg: {
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
         GeneralSettingsLabel: {
           x: 82,
           y: 113,
           text: {
             text: Language.translate('General_Settings'),
             fontSize: 36,
             textColor: Colors.LIGHTER_WHITE,
             fontFace: 'Medium'
           }
         },
         Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
         DiscoverAudioSettings: {
           x: 81,
           y: 209,
           label: Language.translate('Audio Settings'),
           type: GeneralSettingsTile
         },
         AudioSettingsControl: {
          x: 85,
          y: 325,
          text: {
            text: Language.translate('Available Audio Settings'),
            fontSize: 34,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
         },
         DiscoveredAudioSettings: {
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
         DiscoveredNewAudioSettings: {
           type: Lightning.components.ListComponent,
           x: 81,
           y: 525,
           w: 800,
           h: 1080,
           visible: false,
           itemSize: 120,
           horizontal: false,
           roll: true,
           rollMax: 0,
           rollMin: 0,
           invertDirection: true
           }
         },
       ThunderAudioVideoService: {type: ThunderAudioVideoService},
      SelectedAudioSettings: { x: 0, y: 1080, w: 960, h: 1080, visible: false }
     }
   }
 
   _init() {
     this.availableaudiosettings=['SPDIF']
     this.availableaudiosettingslist=['Sound Modes']
       if(Storage.get("lastsetspdifstate")){
             this._toggle = Storage.get("lastsetspdifstate")
             this.tag('DiscoveredAudioSettings').items = this.availableaudiosettings.map((data, index) =>{
               return {
                 ref: 'DiscoveredAudioSettings' + index,
                 type: VideoSettingsTile,
                 items: data,
                 label: data,
                 setswitch: this._toggle
              }
             })
             this.tag('ThunderAudioVideoService').setSPDIF(this._toggle)
       }else{
             this._toggle = false
             this.tag('DiscoveredAudioSettings').items = this.availableaudiosettings.map((data, index) =>{
               return {
                 ref: 'DiscoveredAudioSettings' + index,
                 type: VideoSettingsTile,
                 items: data,
                 label: data,
                 setswitch: false
              }
             })
       }     
     this.tag('DiscoveredNewAudioSettings').items = this.availableaudiosettingslist.map((data, index) =>{
     return {
               ref: 'DiscoveredAudioSettings' + index,
               type: GeneralSettingsTile,
               items: data,
               label: data,
              }
       })
      this._setState('DiscoverAudioSettings')
    }
 
   _active() {
      this._setState('DiscoverAudioSettings')
  }

  $setAudioSettingsScreen() {
     this.childList.remove(this.tag('SoundmodePage'))
     this._setState('DiscoverAudioSettings')
  }
    
  switchOnOff(state) {
   Storage.set("lastsetspdifstate", state);
    if (state == true) {
      if(this.tag('DiscoveredAudioSettings').element.label == "SPDIF"){ 
            this.tag('ThunderAudioVideoService').setSPDIF('true')
            this.tag('DiscoveredAudioSettings').element.setswitch =true
            }      
    } else{
      if(this.tag('DiscoveredAudioSettings').element.label == "SPDIF"){ 
            this.tag('ThunderAudioVideoService').setSPDIF('false')
            this.tag('DiscoveredAudioSettings').element.setswitch =false
      }
      }
      this._setState('DiscoveredAudioSettings')
    }
    
   static _states() {
     return [
       class DiscoverAudioSettings extends this {
         $enter() {
             this.tag('DiscoveredAudioSettings').visible = true
             this.tag('DiscoveredNewAudioSettings').visible = true
         }
         _getFocused() {
              this._setState('DiscoveredAudioSettings')
         }
         _handleDown() {
           if (this.tag('DiscoveredAudioSettings').items.length > 0) {
             this._setState('DiscoveredAudioSettings')
           }
         }
         _handleEnter() {
           Log.info('Atag: DiscoverAudioSettings Button entered.')
           this._setState('DiscoveredAudioSettings')
         }
         _handleBack() {
          Log.info("Atag:handle back called")
          this.fireAncestors('$setGeneralSettingsScreen')
        }
       },
       
 	    class DiscoveredAudioSettings extends this {
         $enter() {
           this.tag('AudioSettingsControl').visible = true
           this.tag('DiscoveredAudioSettings').visible = true
         }
         $exit(){
         this.fireAncestors('$exitbutton')
         }
         _getFocused() {

          return this.tag('DiscoveredAudioSettings').element
          }
         _handleUp() {
           if (0 === this.tag('DiscoveredAudioSettings').index) {
             this._setState('DiscoverAudioSettings')
           } else if (0 != this.tag('DiscoveredAudioSettings').index) {
             this.tag('DiscoveredAudioSettings').setPrevious()
           }
         }
         _handleDown() {
           if (this.tag('DiscoveredAudioSettings').length - 1 != this.tag('DiscoveredAudioSettings').index) {
             this.tag('DiscoveredAudioSettings').setNext()
           }else{
           this._setState('DiscoveredNewAudioSettings')
           }
         }
         _handleBack() {
            Log.info("Atag:handle back called")
            this.fireAncestors('$setGeneralSettingsScreen')
          }
         _handleEnter() {
            this._toggle = !this._toggle
            this.switchOnOff(this._toggle)
            Log.info("Atag: AudioSettings enter"+this._toggle)         
           }
         },
       class DiscoveredNewAudioSettings extends this {
         $enter() {
           this.tag('AudioSettingsControl').visible = true
           this.tag('DiscoveredAudioSettings').visible = true
           this.tag('DiscoveredNewAudioSettings').visible = true
         }
         $exit(){
           this.fireAncestors('$exitbutton')
         }
         _getFocused() {
           return this.tag('DiscoveredNewAudioSettings').element
          }
         _handleUp() {
           if (0 === this.tag('DiscoveredNewAudioSettings').index) {
             this._setState('DiscoveredAudioSettings')
           } else if (0 != this.tag('DiscoveredewAudioSettings').index) {
             this.tag('DiscoveredNewAudioSettings').setPrevious()
           }
         }
         _handleDown() {
           if (this.tag('DiscoveredNewAudioSettings').length - 1 != this.tag('DiscoveredNewAudioSettings').index) {
             this.tag('DiscoveredNewAudioSettings').setNext()
           }
         }
         _handleBack() {
           this.fireAncestors('$setGeneralSettingsScreen')
          }
         _handleEnter() { 
           this.childList.a({ ref: 'SoundmodePage', type: Soundmode_Class, x: 0, y: 0, w: 960, h: 1080 ,label: this.tag('SelectedAudioSettings')})
           this._setState('SoundmodeScreen')         
         }
       },
       class SoundmodeScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('SoundmodePage')
        }
      }

     ]
   }
 }
