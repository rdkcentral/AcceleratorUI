/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright � 2020 Tata Elxsi Limited
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
import { Lightning, Log, Storage } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'

/**
 * @export
 * @class ThunderAppService
 * @extends Lightning.Component
 * Thunder  Diagnostic calls
 */
export class ThunderPowerService extends Lightning.Component {
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

  _activate(callSign) {
    this.thunderJS.Controller.activate({ callsign: callSign }, (err, result) => {
      if (err) {
        Log.error('Ptag: Failed to activate ' + callSign)
      } else {
        Log.info('Ptag: Successfully activated ' + callSign)
      }
    })
  }

  setPowerState(state) {
    if (state === 'DEEP SLEEP') {
      state = 'DEEP_SLEEP'
    } else if (state === 'LIGHT SLEEP') {
      state = 'LIGHT_SLEEP'
    }
    Log.info('Ptag:setPowerState state' + state)
    this._activate('org.rdk.System')
    setTimeout(() => {
      this.thunderJS.call(
        'org.rdk.System',
        'setPowerState',
        { powerState: state },
        (err, result) => {
          if (err) {
            Log.info('\nPtag: setPowerState error........' + JSON.stringify(err))
          } else {
            Storage.set('PowerState', state)
            Log.info('Ptag:setPowerState Powerstate' + Storage.get('PowerState'))
            Log.info('\nPtag: setPowerState success to:........' + JSON.stringify(result))
          }
        }
      )
    }, 1000)
  }
}
