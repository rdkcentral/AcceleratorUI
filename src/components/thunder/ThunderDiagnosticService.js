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
export class ThunderDiagnosticService extends Lightning.Component {
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

  /**
    * Function to call device Info thunder call 
    */
  _diagnostic() {
    let diagObj = this
    console.log('Enter diagnostics')
    this.thunderJS.call('DeviceInfo', 'systeminfo',
      (err, result) => {
        if (err) {
          Log.info('\n Diagnostic error')
        } else {
          Log.info('Diagnostic success', result)
          Log.info('Diagnostic success', result.version)
          let diagInfo = 'Version : \t' + result.version + "\n" + "\n Time : \t" + result.time + "\n" + "\n Up Time : \t" + result.uptime + "\n" + "\n Total RAM : \t" + result.totalram + "\n Free RAM : \t" + result.freeram + "\n" + "\n Device Name : \t" + result.devicename + "\n" + "\n CPU Load : \t" + result.cpuload + "\n" + "\n Serial Number : \t" + result.serialnumber
          diagObj.tag('DiagnosticInfoLabel').patch({ text: { text: diagInfo } })
        }
      }
    )
  }
}
