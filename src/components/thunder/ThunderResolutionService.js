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
  import { Lightning, Log } from '@lightningjs/sdk'
  import ThunderJS from 'ThunderJS'
  
  /**
   * @export
   * @class ThunderAppService
   * @extends Lightning.Component
   * Thunder  Diagnostic calls
   */
  export class ThunderResolutionService extends Lightning.Component {
    _construct() {
      this.config = {
        host: '127.0.0.1',
        port: '9998'
      }
      this.device = []
      try {
        this.thunderJS = ThunderJS(this.config)
      } catch (err) {

        Log.error(err)
      }  
    }
    
    //get current resolution
  getcurrentresolution(){
  let resObj = this
  return new Promise(function (resolve, reject) {
    resObj.thunderJS.call('org.rdk.DisplaySettings','getCurrentResolution',{"videoDisplay":"HDMI0"},
        (err, result) => {
          if (err) {
            Log.info('\n Current Resolution get error in general settings')
            reject()
          } else {
            Log.info('\n Current Resolution get success in general settings', result.resolution)
           resObj.currentresolution=result.resolution
           Log.info('Rtag: Current Resolution get success in general settings', resObj.currentresolution)
           resolve(result.resolution)
          }
        })
        })
        }
        
  getavailableresolutions(){
  let resObj = this
  return new Promise(function (resolve, reject) {
    resObj.thunderJS.call('org.rdk.DisplaySettings','getSupportedResolutions',{"videoDisplay":"HDMI0"},
        (err, result) => {
          if (err) {
            Log.info('\n Resolution settings get error in general settings')
            reject()
          } else {
            Log.info('\n Resolution settings get success in general settings', result.supportedTvResolutions)
            let fullavailableresolution=result.supportedResolutions.slice()
            let reqindex= fullavailableresolution.indexOf("720p")
            resolve(fullavailableresolution.slice(reqindex))
          }
        })
        })
        }
        
  setresolution(selected_resolution){
   this.thunderJS.call('org.rdk.DisplaySettings','setCurrentResolution',{"videoDisplay":"HDMI0", "resolution":selected_resolution,     "persist":true},
       (err, result) => {
         if (err) {
           Log.info('\n Display settings set error')
         } else {
           Log.info('\n Display settings set success to:' + selected_resolution )
         }
       })
       }
    
    }