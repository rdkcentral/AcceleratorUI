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
import { ResolutionTile } from './ResolutionTile'
import ThunderJS from 'ThunderJS'

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
            text: 'Settings',
            fontSize: 28,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        generalsettingsLabel: {
          x: 82,
          y: 113,
          text: {
            text: 'GENERAL SETTINGS',
            fontSize: 36,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Medium'
          }
        },
        Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
        DiscoverResolution: {
          x: 81,
          y: 209,
          label: 'Resolution Settings',
          type: ResolutionTile
        },
        ResolutionControl: {
         x: 85,
         y: 325,
         text: {
           text: 'Available Resolutions',
           fontSize: 34,
           textColor: Colors.TRANSPARENT_GREY,
           fontFace: 'Regular'
         }
        },
        /*DiscoveredResolution: {
          type: ScrollableListResolution,
          x: 81,
          y: 398,
          w: 800,
          h: 1080,
          visible: false,
          itemSize: 120,
          horizontal: false,
          spacing: 20,
          roll: true,
          rollMax: 800,
          rollMin: 0,
          invertDirection: true
        }*/
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
      }
    }
  }

   _construct() {
     Log.info('Resolution Component ')
       this.config = {
         host: '127.0.0.1'
       }
     this.device = []
       try {
         this.thunderJS = ThunderJS(this.config)
       } catch (err) {
         Log.error(err)
       }
   }

  _init() {
    this.availableresolution = "";
    /*this.setbestresolution();*/
    this.getcurrentresolution();
    this.scanFlag = 1;
    this.removeChildFlag = 0;
   }

  _active() {
    this._setState('DiscoverResolution')
  }
 

  //get current resolution
  getcurrentresolution(){
    this.thunderJS.call('org.rdk.DisplaySettings','getCurrentResolution',{"videoDisplay":"HDMI0"},
        (err, result) => {
          if (err) {
            Log.info('\n Current Resolution get error in general settings')
          } else {
            Log.info('\n Current Resolution get success in general settings', result.resolution)
           this.currentresolution=result.resolution
          }
        })}

  //get available resolution
  getavailableresolutions(){
    this.thunderJS.call('org.rdk.DisplaySettings','getSupportedResolutions',{"videoDisplay":"HDMI0"},
        (err, result) => {
          if (err) {
            Log.info('\n Resolution settings get error in general settings')
          } else {
            Log.info('\n Resolution settings get success in general settings', result.supportedTvResolutions)
            this.fullavailableresolution=result.supportedResolutions.slice()
            let reqindex= this.fullavailableresolution.indexOf("720p")
            this.availableresolution=this.fullavailableresolution.slice(reqindex)
          }
        })}

  //set resolution
  setresolution(selected_resolution){
   this.thunderJS.call('org.rdk.DisplaySettings','setCurrentResolution',{"videoDisplay":"HDMI0", "resolution":selected_resolution,     "persist":true},
       (err, result) => {
         if (err) {
           Log.info('\n Display settings set error')
         } else {
           Log.info('\n Display settings set success to:' + selected_resolution )
         }
       }
       )
 }
  //set best resolution
  setbestresolution(){
    this.thunderJS.call('org.rdk.DisplaySettings','getSupportedResolutions',{"videoDisplay":"HDMI0"},
        (err, result) => {
          if (err) {
            Log.info('\n Display settings get error')
          } else {
            Log.info('\n Display settings get success', result.supportedResolutions)
              let display_array=result.supportedResolutions.slice()
              Log.info('\n Display settings get display_array', display_array)
              let display_array_length=display_array.length
              let highest_resolution=display_array[display_array_length-1]
              Log.info('\n Display settings get result length' + display_array_length)
              Log.info('\n Display settings get highest resolution' + highest_resolution)
              this.thunderJS.call('org.rdk.DisplaySettings','setCurrentResolution',{"videoDisplay":"HDMI0", "resolution":highest_resolution,     "persist":true},
                  (err, result) => {
                    if (err) {
                      Log.info('\n Display settings set error')
                        this.thunderJS.call('org.rdk.DisplaySettings','setCurrentResolution',{"videoDisplay":"HDMI0", "resolution":"1080p60"    , "persist":true})
                        Log.info('Resolution set on default to: 1080p')
                        this.currentresolution= "1080p60"
                    } else {
                      Log.info('\n Display settings set success to:' + highest_resolution )
                        this.currentresolution= highest_resolution
                    }
                  }
                  )
          }
        } )
  }

  startScanResolution() {
    Log.info('ResolutionUI: startScanResolution enter.')
    /*this.tag('ResolutionControl').patch({
        text: { text: 'Searching for available resolutions...' }
    })*/
    this.getavailableresolutions();
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
                type: ResolutionTile,
                label: data,
                secondarylabel: 'Set',
                ready: false
              }
            }
            else {
              return {
                ref: 'DiscoveredResolution' + index,
                type: ResolutionTile,
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
          return this.tag('DiscoveredResolution').element
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
        _handleEnter() {
          // connect page
          Log.info("ResolutionUI: In ResolutionSettings, resolutions", this.tag('DiscoveredResolution').element.label) 
            this.setresolution(this.tag('DiscoveredResolution').element.label)
            this.currentresolution=this.tag('DiscoveredResolution').element.label
            setTimeout (() => {
               this.startScanResolution()
          }, 1000);
        }
      }
    ]
  }
}
