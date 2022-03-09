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
import { Lightning, Log } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'

/**
 * @export
 * @class ThunderAppService
 * @extends Lightning.Component
 * Thunder  Diagnostic calls
 */
export class ThunderResetService extends Lightning.Component {
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
        Log.error('Failed to activate ' + callSign)
      } else {
        Log.info('Successfully activated ' + callSign)
      }
    })
  }

  reset_app(type) {
    this._activate('org.rdk.Warehouse')
    setTimeout(() => {
      this.thunderJS.call(
        'org.rdk.Warehouse',
        'resetDevice',
        { suppressReboot: true, resetType: type },
        (err, result) => {
          if (err) {
            console.log('\n Warehouse set error' + type)
          } else {
            console.log('\n Warehouse set success to:' + 'suppressReboot' + type)
          }
        }
      )
    }, 1000)
  }
}
