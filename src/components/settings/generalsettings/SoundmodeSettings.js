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
 import { Lightning, Utils, Log, Language,Storage } from '@lightningjs/sdk'
 import { Colors } from '../../../constants/ColorConstants'
 import { ImageConstants } from '../../../constants/ImageConstants'
 import { GeneralSettingsTile} from './GeneralSettingsTile'
 import { ThunderAudioVideoService } from '../../thunder/ThunderAudioVideoService'

 
 /**
  * @export
  * @class Resolution
  * @extends Lightning.Component
  * Renders the Resolution Component
  */
 export class Soundmode_Class extends Lightning.Component {
   /**
    * @static
    * @returns
    * @memberof general settings
    * Renders the template
    */
   static _template() {
     return {
       SoundmodeBg: {
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
         DiscoverSoundmode: {
           x: 81,
           y: 209,
           label: Language.translate('Soundmode Settings'),
           type: GeneralSettingsTile
         },
         SoundmodeControl: {
          x: 85,
          y: 325,
          text: {
            text: Language.translate('Available Resolutions'),
            fontSize: 34,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
         },
         DiscoveredSoundmode: {
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
     this.availablesoundmodes = ["Passthrough","Stereo"];
     if(Storage.get("lastsetsoundmode")){
     Log.info("AVtag:SoundmodeUI:lastsetsoundmode from storage :"+ Storage.get("lastsetsoundmode"))
     this.currentsoundmode =Storage.get("lastsetsoundmode")
     this.tag('ThunderAudioVideoService').setSoundMode(this.currentsoundmode)
     } else {
       this.tag('ThunderAudioVideoService').checkHDMIstatus().then((data) => {
          if(data) {
             this.currentsoundmode = "Surround"
           } else {
             this.currentsoundmode = "Stereo"
           }
        })
     }
     this._setState('DiscoverSoundmode')
    }
 
   _active() {
      this.flag = 0;
     this._setState('DiscoverSoundmode')
   }
  
 
   startScanSoundmode() {
    this.tag('ThunderAudioVideoService').checkHDMIstatus().then((data) => {
    if(data){
        Log.info('AVtag: SoundmodeUI: checkHDMIstatus'+ data);
        this.availablesoundmodes = ["Passthrough","Stereo","Surround"];
     }else{
        this.availablesoundmodes = ["Passthrough","Stereo"];
     }
     })
     
     setTimeout( ()=> {
       Log.info('AVtag: SoundmodeUI: Available Soundmodes:'+ this.availablesoundmodes);
       if (this.availablesoundmodes === "") {
         this.tag('DiscoverSoundmode').visible = true
         this.tag('SoundmodeControl').patch({
           text: { text: 'Could not find any soundmode. Please try again..' } 
         })
         this._setState('DiscoverSoundmode')
       }
       else { 
       let tempsound = this.availablesoundmodes.map((data, index) => {
               return {
                 ref: 'DiscoveredSoundmode' + index,
                 type: GeneralSettingsTile,
                 label: data,
                 secondarylabel: 'Not Set',
                 ready: false
               }
             });     
     for(var i=0;i<tempsound.length;i++)
     {
       if (this.currentsoundmode == tempsound[i].label) {
             tempsound[i].secondarylabel = 'Set'
             break
       }
     }
     let tempval =  tempsound[0]
     tempsound[0] = tempsound[i]  
     tempsound[i] = tempval
     
     this.tag('DiscoveredSoundmode').items = tempsound 
     
     this.tag('SoundmodeControl').patch({
             text: { text: 'Available Soundmodes' }
     })
           this._setState('DiscoveredSoundmode')
     }},1000);
   }
  
 
   static _states() {
     return [
       class DiscoverSoundmode extends this {
         $enter() {
             this.tag('DiscoveredSoundmode').visible = true
             this.tag('SoundmodeControl').patch({
         text: { text: 'Searching for available sound modes...' }
           })  
             this.startScanSoundmode()
         }
         _getFocused() {
           return this.tag('DiscoverSoundmode')
         }
         _handleDown() {
           if (this.tag('DiscoveredSoundmode').items.length > 0) {
             this._setState('DiscoveredSoundmode')
           }
         }
         _handleEnter() {
          this.startScanSoundmode()
         }
       },
 	    class DiscoveredSoundmode extends this {
         $enter() {
           this.tag('SoundmodeControl').visible = true
           this.tag('DiscoveredSoundmode').visible = true
         }
         _getFocused() {
          return this.tag('DiscoveredSoundmode').element
         }
         _handleUp() {
          if (0 === this.tag('DiscoveredSoundmode').index) {
             this._setState('DiscoverSoundmode')
           } else if (0 != this.tag('DiscoveredSoundmode').index) {
             this.tag('DiscoveredSoundmode').setPrevious()
           }
         }
         _handleDown() {
           if (this.tag('DiscoveredSoundmode').length - 1 != this.tag('DiscoveredSoundmode').index) {
             this.tag('DiscoveredSoundmode').setNext()
           }
         }
        _handleBack() {
          Log.info("handle back called")
          this.fireAncestors('$setAudioSettingsScreen')
         }
         _handleEnter() {
           // connect page 
             this.tag('ThunderAudioVideoService').setSoundMode(this.tag('DiscoveredSoundmode').element.label)
             this.currentsoundmode=this.tag('DiscoveredSoundmode').element.label
              Storage.set("lastsetsoundmode", this.currentsoundmode);
               setTimeout (() => {this.startScanSoundmode()}, 1000);
         }
       }
     ]
   }
 }
