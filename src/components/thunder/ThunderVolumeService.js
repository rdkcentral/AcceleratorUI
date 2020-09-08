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
import { Lightning, Log } from "wpe-lightning-sdk"
import ThunderJS from 'ThunderJS'

/**
 * @export 
 * @class ThunderVolumeService
 * @extends Lightning.Component
 * Volume Thunder calls
 */
export class ThunderVolumeService extends Lightning.Component {
  _construct() {
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

 /**
  * Function to call volume change thunder call based on percentage value
  * @param {*} volumeVal 
  */
  _volumeUp(volumeVal) {
    Log.info(volumeVal, 'value of volume')
    this.volumeValue = volumeVal
    this.thunderJS.call('VolumeControl', 'volume', this.volumeValue)
  }

  /**
   * Function to call thundr call to mute/unmute volume based on boolean passed
   * @param {*} muteBool 
   */
  _volumeMute(muteBool) {
    Log.info(muteBool, '_volumeMute function value')
    this.muteBoolean = muteBool
    this.thunderJS.call('VolumeControl', 'muted', this.muteBoolean)
  }

}