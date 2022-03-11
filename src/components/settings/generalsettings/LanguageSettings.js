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


 
 /**
  * @export
  * @class Resolution
  * @extends Lightning.Component
  * Renders the Resolution Component
  */
 export class Language_Class extends Lightning.Component {
   /**
    * @static
    * @returns
    * @memberof general settings
    * Renders the template
    */
   static _template() {
     return {
       LanguageBg: {
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
         DiscoverLanguage: {
           x: 81,
           y: 209,
           label: Language.translate('Language Settings'),
           type: GeneralSettingsTile
         },
         LanguageControl: {
          x: 85,
          y: 325,
          text: {
            text: Language.translate('Available Languages'),
            fontSize: 34,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
         },
         DiscoveredLanguage: {
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
       }
     }
   }
 
   _init() {
     this.availableLanguages = "";
     Log.info("available languages",Language.available());
     this.currentlanguage=Language.get();
     Log.info("current language",this.currentlanguage);
    }
 
   _active() {
     this._setState('DiscoverLanguage')
   }
  
 
   startScanLanguage() {
     Log.info('LanguageUI: startScanLanguage enter')
     this.availableLanguages = Language.available().map(a => a.code)
      setTimeout( ()=> {
     Log.info("tag:available Languages", this.availableLanguages);
     if (this.availableLanguages === "") {
         this.tag('DiscoverLanguage').visible = true
         this.tag('LanguageControl').patch({
           text: { text: 'Could not find any languages. Please try again..' } 
         })
         this._setState('DiscoverLanguage')
       }
     else{
     let templang = Language.available().map((data, index) => {
               return {
                 ref: 'DiscoveredLanguage' + index,
                 type: GeneralSettingsTile,
                 label: data.name,
                 code: data.code,
                 secondarylabel: 'Not Set',
                 ready: false
               }
             });     
     for(var i=0;i<templang.length;i++){
       Log.info("Ltag: templang[i].code"+templang[i].code)
       if (this.currentlanguage == templang[i].code) {
             templang[i].secondarylabel = 'Set'
             break
       }
     }
     let tempval =  templang[0]
     templang[0] = templang[i]  
     templang[i] = tempval
     Log.info("Ltag: templang"+JSON.stringify(templang))
     
     this.tag('DiscoveredLanguage').items = templang
     
           this.tag('LanguageControl').patch({
             text: { text: Language.translate('Available Languages') }
           })
           this._setState('DiscoveredLanguage')
           }},1000);
   }
  
 
   static _states() {
     return [
       class DiscoverLanguage extends this {
         $enter() {
             this.tag('DiscoveredLanguage').visible = true
             this.startScanLanguage()
         }
         _getFocused() {
           return this.tag('DiscoverLanguage')
         }
         _handleDown() {
           if (this.tag('DiscoveredLanguage').items.length > 0) {
             this._setState('DiscoveredLanguage')
           }
         }
         _handleEnter() {
           Log.info('LanguageUI: DiscoverLanguage Button entered.')
           this.startScanLanguage()
         }
       },
 	    class DiscoveredLanguage extends this {
         $enter() {
           this.tag('LanguageControl').visible = true
           this.tag('DiscoveredLanguage').visible = true
         }
         _getFocused() {
          return this.tag('DiscoveredLanguage').element
         }
         _handleUp() {
           if (0 === this.tag('DiscoveredLanguage').index) {
             this._setState('DiscoverLanguage')
           } else if (0 != this.tag('DiscoveredLanguage').index) {
             this.tag('DiscoveredLanguage').setPrevious()
           }
         }
         _handleDown() {
           if (this.tag('DiscoveredLanguage').length - 1 != this.tag('DiscoveredLanguage').index) {
             this.tag('DiscoveredLanguage').setNext()
          
           }
         }
      _handleBack() {
        Log.info("handle back called")
        this.fireAncestors('$setGeneralSettingsScreen')
        }
         _handleEnter() {

           Log.info("Ltag: LanguageUI: In LanguageSettings, Languages", this.tag('DiscoveredLanguage').element.code)
           this.currentlanguage=this.tag('DiscoveredLanguage').element.code
           Storage.set("selectedLanguage", this.currentlanguage)
           location.reload()
         }
       }
     ]
   }
 }
