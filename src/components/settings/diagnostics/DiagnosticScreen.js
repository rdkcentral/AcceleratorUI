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
import ThunderJS from 'ThunderJS'
import { ThunderDiagnosticService } from '../../thunder/ThunderDiagnosticService'

/**
 * @export
 * @class Diagnostic
 * @extends Lightning.Component
 * Renders the Diagnostic Component
 */

export class Diagnostic extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof Diagnostic
   * Renders the template
   */
  static _template() {
    return {
      DiagnosticBg: {
        rect: true,
        w: 960,
        h: 1080,
        color: Colors.BG_GREY,
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
        DiagnosticLabel: {
          x: 82,
          y: 113,
          text: {
            text: 'Diagnostics',
            fontSize: 36,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Medium',
            fontStyle: 'bold'
          }
        },
        Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
        DiagnosticVersionLabel: {
          x: 82,
          y: 209,
          text: {
            text: '',
            fontSize: 36,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        DiagnosticIPLabel: {
          x: 82,
          y: 268,
          text: {
            text: '',
            fontSize: 36,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        DiagnosticInfoLabel: {
          x: 82,
          y: 386,
          text: {
            text: '',
            fontSize: 36,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        }
      }
    }
  }
  /**
     * Thunder calls for Diagnostic functionality
     */

  _construct() {
    Log.info('Diagnostic Component ')
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
    * Thunder calls for Getting DiagnosticInfo
    */

  _diagnostic() {
    let diagObj = this
    console.log('Enter diagnostics')
    this.thunderJS.call('DeviceInfo', 'systeminfo',
      (err, result) => {
        if (err) {
          Log.info('\n version error')
        } else {
          Log.info('\n version success', result.version)
          let versionnum = result.version.substr(0, 3)
          Log.info('Diagnostics: Printing result.version and substr of same', result.version, result.version.substr(0, 3))
          let diagvers = "Version :\t" + "1.1" + "\n"
          Log.info('Diagnostics: diagvers: ', diagvers)
          diagObj.tag('DiagnosticVersionLabel').patch({ text: { text: diagvers } })
        }
      }
    )
    this.thunderJS.call('org.rdk.System', 'getSystemVersions',
      (err, result) => {
        if (err) {
          Log.info('\n Diagnostic:Version error', err)
        } else {
          Log.info('Diagnostic: Version success', result)
          let diagVers1 = "\n" + result.stbVersion + " \n" + result.stbTimestamp + " \n\n"
          Log.info('Diagnostic: VersionLabel obtained : ', diagVers1)
          diagObj.tag('DiagnosticIPLabel').patch({ text: { text: diagVers1 } })
        }
      }
    )

    this.thunderJS.call('DeviceInfo', 'systeminfo',
      (err, result) => {
        if (err) {
          Log.info('\n Diagnostic error')
        } else {
          Log.info('\n Diagnostic success', result)
          let totalram = this._bytesToSize(result.totalram)
          let freeram = this._bytesToSize(result.freeram)
          let serialnumber = this._ConvertStringToHex(result.serialnumber)
          let diagInfo = "\nSerial No : \n" + serialnumber + "\n " + "\nTime : \t" + result.time + "\n"
            + "\n " + "\nUp Time : \t" + result.uptime + "\tSec" + "\n " + "\nTotal RAM : \t" + totalram + "\n " + "\nFree RAM : \t" + freeram + "\n " + "\nDevice Name : \t" + result.devicename + "\n " + "\nCPU Load : \t" + result.cpuload + " %" + "\n "
          diagObj.tag('DiagnosticInfoLabel').patch({ text: { text: diagInfo } })
        }
      }
    )
  }


  /**
    * function to convert bytes to GB
    */

  _bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  /**
     * function to convert string to hexa-dec
     */
  _ConvertStringToHex(str) {
    var arrayy = [];
    for (var i = 0; i < str.length; i++) {
      arrayy[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return arrayy.join(" ");
  }

  /**
    * init functionality
    */
  _init() {
    Log.info('\n Diagnostic screen')
    this._diagnostic()
  }
}















