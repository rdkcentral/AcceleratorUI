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
 import { ThunderResolutionService } from '../../thunder/ThunderResolutionService'

 
 /**
  * @export
  * @class Resolution
  * @extends Lightning.Component
  * Renders the Resolution Component
  */
 export class Resolution_Class extends Lightning.Component {
   /**
    * @static
    * @returns
    * @memberof general settings
    * Renders the template
    */
   static _template() {
     return {
       ResolutionBg: {
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
         DiscoverResolution: {
           x: 81,
           y: 209,
           label: Language.translate('Resolution Settings'),
           type: GeneralSettingsTile
         },
         ResolutionControl: {
          x: 85,
          y: 325,
          text: {
            text: Language.translate('Available Resolutions'),
            fontSize: 34,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
         },
         DiscoveredResolution: {
           type: Lightning.components.ListComponent,
           x: 81,
           y: 398,
           w: 800,
           h: 1080,
           visible: false,
           itemSize: 120,
           horizontal: false,
           roll: true,
           rollMax: 1080,
           rollMin: 0,
           invertDirection: true
         }
       },
       ThunderResolutionService: {
      type: ThunderResolutionService
      }
     }
   }
 
   _init() {
     this.availableresolution = "";
     /*this.setbestresolution();*/
     
     if(Storage.get("lastsetresolution"))
     {
     console.log("ResTag:lastsetresolution from storage :",Storage.get("lastsetresolution"))
     this.currentresolution =Storage.get("lastsetresolution")
     }
     else
     {
     this.tag('ThunderResolutionService').getcurrentresolution().then(data => {
     this.currentresolution = data
     });
     }
     this.scanFlag = 1;
     this.removeChildFlag = 0;
    }
 
   _active() {
      this.flag = 0;
     this._setState('DiscoverResolution')
   }
  
 
   startScanResolution() {
     Log.info('ResolutionUI: startScanResolution enter.')
     this.tag('ResolutionControl').patch({
         text: { text: 'Searching for available resolutions...' }
     })
    
     this.tag('ThunderResolutionService').getavailableresolutions().then(data => {
     console.log("Rtag:available resolution", data);
     this.availableresolution = data;
     
         setTimeout( ()=> {
       Log.info('ResoltionUI: Available Resolutions:', this.availableresolution);
       if (this.availableresolution === "") {
         this.tag('DiscoverResolution').visible = true
         this.tag('ResolutionControl').patch({
           text: { text: 'Could not find any resolution. Please try again..' } 
         })
         this._setState('DiscoverResolution')
       }
       else {  
           this.tag('DiscoveredResolution').items = this.availableresolution.map((data, index) => {
             if (this.currentresolution === data) {
               return {
                 ref: 'DiscoveredResolution' + index,
                 type: GeneralSettingsTile,
                 label: data,
                 secondarylabel: 'Set',
                 ready: false
               }
             }
             else {
               return {
                 ref: 'DiscoveredResolution' + index,
                 type: GeneralSettingsTile,
                 label: data,
                 secondarylabel: 'Not Set',
                 ready: false
               }
             }
           });
           this.tag('ResolutionControl').patch({
             text: { text: 'Available Resolutions' }
           })
           this._setState('DiscoveredResolution')
       }
     },1000);
    });
   }
  
 
   static _states() {
     return [
       class DiscoverResolution extends this {
         $enter() {
           /*if (this.removeFlag === 1) {
             this.removeFlag = 0;
             this.childList.remove(this.tag('ConnectingPage'))
             this.tag('DiscoveredResolution').visible = false
           }
           else */
             this.tag('DiscoveredResolution').visible = true
           //if (this.scanFlag === 1) {
            // this.scanFlag = 0;
             this.startScanResolution()
          // }  
         }
         _getFocused() {
           return this.tag('DiscoverResolution')
         }
         _handleDown() {
           if (this.tag('DiscoveredResolution').items.length > 0) {
             this._setState('DiscoveredResolution')
           }
         }
         _handleEnter() {
           Log.info('ResolutionUI: DiscoverResolution Button entered.')
           this.startScanResolution()
         }
       },
 	    class DiscoveredResolution extends this {
         $enter() {
           this.tag('ResolutionControl').visible = true
           this.tag('DiscoveredResolution').visible = true
         }
         _getFocused() {
         if(this.flag ===0)
          {
           this.flag++
            let highresIndex = this.availableresolution.indexOf(this.currentresolution)
            return this.tag('DiscoveredResolution').items[highresIndex]      
          }
          else
          {
          return this.tag('DiscoveredResolution').element
          }
         }
         _handleUp() {
           if (0 === this.tag('DiscoveredResolution').index) {
             this._setState('DiscoverResolution')
           } else if (0 != this.tag('DiscoveredResolution').index) {
             this.tag('DiscoveredResolution').setPrevious()
           }
         }
         _handleDown() {
           if (this.tag('DiscoveredResolution').length - 1 != this.tag('DiscoveredResolution').index) {
             this.tag('DiscoveredResolution').setNext()
           }
         }
        _handleBack() {
          console.log("handle back called")
          this.fireAncestors('$setGeneralSettingsScreen')
         }
         _handleEnter() {
           // connect page
           Log.info("ResolutionUI: In ResolutionSettings, resolutions", this.tag('DiscoveredResolution').element.label) 
             this.tag('ThunderResolutionService').setresolution(this.tag('DiscoveredResolution').element.label)
             this.currentresolution=this.tag('DiscoveredResolution').element.label
              Storage.set("lastsetresolution", this.currentresolution);
             setTimeout (() => {
                this.startScanResolution()
           }, 1000);
         }
       }
     ]
   }
 }
