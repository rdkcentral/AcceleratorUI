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


 /**
  * @export
  * @class Resolution
  * @extends Lightning.Component
  * Renders the Resolution Component
  */
 export class Video_Class extends Lightning.Component {
   /**
    * @static
    * @returns
    * @memberof general settings
    * Renders the template
    */
   static _template() {
     return {
       VideoSettingsBg: {
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
         DiscoverVideoSettings: {
           x: 81,
           y: 209,
           label: Language.translate('Video Settings'),
           type: GeneralSettingsTile
         },
         VideoSettingsControl: {
          x: 85,
          y: 325,
          text: {
            text: Language.translate('Available Video Settings'),
            fontSize: 34,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
         },
         DiscoveredVideoSettings: {
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
           }
         },
       ThunderAudioVideoService: {
      type: ThunderAudioVideoService
      }
     }
   }
 
   _init() {
     Log.info("Vtag: VideoSettings init");
     this._togglecec = false
     this.availablevideosettings=['CEC']   
      this.tag('DiscoveredVideoSettings').items = this.availablevideosettings.map((data, index) =>{
               return {
               ref: 'DiscoveredVideoSettings' + index,
               type: VideoSettingsTile,
               items: data,
              label: data,
              setswitch: false
              }
              }) 
    this._setState('DiscoverVideoSettings')
    }
 
   _active() {
      Log.info("Vtag: VideoSettings active");
      this._setState('DiscoverVideoSettings')
  }


initial_state()
{        
   if(Storage.get("lastsetcecstate") != ''){
   Log.info("AVTag:lastsetcecstate from storage :",Storage.get("lastsetcecstate"))
       if(Storage.get("lastsetcecstate") == true){
             this._togglecec = true       
             this.tag('DiscoveredVideoSettings').items[0].setswitch =this._togglecec
             this.tag('ThunderAudioVideoService').setCEC('true')
       }else if(Storage.get("lastsetcecstate") == false){
             this._togglecec = false       
             this.tag('DiscoveredVideoSettings').items[0].setswitch =this._togglecec
             this.tag('ThunderAudioVideoService').setCEC('false')
       } 
    }else{
      this.tag('ThunderAudioVideoService').getCEC().then((res) => {
        if(res == true){
          this._togglecec = true
          this.tag('DiscoveredVideoSettings').items[0].setswitch =this._togglecec
        }else if(res == false){
          this._togglecec = false
          this.tag('DiscoveredVideoSettings').items[0].setswitch =this._togglecec
        }
    })  
    } 
}
   
switchOnOff(_toggle) {
   Log.info("Vtag: Inside switchOnOff enter"+ _toggle)
   let state = _toggle
    if (state == true && this.tag('DiscoveredVideoSettings').element.label == "CEC") {
            this.tag('ThunderAudioVideoService').setCEC('true')
            this.tag('DiscoveredVideoSettings').element.setswitch =true
            Storage.set("lastsetcecstate", state)     
    } else if (state == false) {
      if(this.tag('DiscoveredVideoSettings').element.label == "CEC"){
            this.tag('ThunderAudioVideoService').setCEC('false')
            this.tag('DiscoveredVideoSettings').element.setswitch =false
            Storage.set("lastsetcecstate", state)
      }
    }
    this._setState('DiscoveredVideoSettings')
  }
   static _states() {
     return [
       class DiscoverVideoSettings extends this {
         $enter() {
             this.tag('DiscoveredVideoSettings').visible = true
         }
         _getFocused() {
              this.initial_state()
              this._setState('DiscoveredVideoSettings')
         }
         _handleDown() {
           if (this.tag('DiscoveredVideoSettings').items.length > 0) {
             this._setState('DiscoveredVideoSettings')
           }
         }
         _handleEnter() {
           this._setState('DiscoveredVideoSettings')
         }
         _handleBack() {
            this.fireAncestors('$setGeneralSettingsScreen')
        }
       },  
       
 	    class DiscoveredVideoSettings extends this {
         $enter() {
           this.tag('VideoSettingsControl').visible = true
           this.tag('DiscoveredVideoSettings').visible = true
         }
         $exit(){
           this.fireAncestors('$exitbutton')
         }
         _getFocused() {
            return this.tag('DiscoveredVideoSettings').element
         }
         _handleUp() {
           if (0 === this.tag('DiscoveredVideoSettings').index) {
             this._setState('DiscoverVideoSettings')
           } else if (0 != this.tag('DiscoveredVideoSettings').index) {
             this.tag('DiscoveredVideoSettings').setPrevious()
           }
         }
         _handleDown() {
           if (this.tag('DiscoveredVideoSettings').length - 1 != this.tag('DiscoveredVideoSettings').index) {
             this.tag('DiscoveredVideoSettings').setNext()
           }
         }
        _handleBack() {
          this.fireAncestors('$setGeneralSettingsScreen')
        }
        _handleEnter() { 
           if(this.tag('DiscoveredVideoSettings').element.label == 'CEC'){
              this._togglecec = !this._togglecec
              this.switchOnOff(this._togglecec)
           }        
         }
       }

     ]
   }
 }
