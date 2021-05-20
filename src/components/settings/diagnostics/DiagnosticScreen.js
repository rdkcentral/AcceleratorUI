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
            fontSize: 21,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        DiagnosticIPLabel: {
            x: 82,
            y: 234,
            text: {
              text: '',
              fontSize: 21,
              textColor: Colors.TRANSPARENT_GREY,
              fontFace: 'Regular'
            }
        },
        DiagnosticInfoLabel: {
          x: 82,
          y: 386,
          text: {
            text: '',
            fontSize: 21,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        DiagnosticResolutionLabel: {
           x: 82,
           y: 309,
           text: {
              text: '',
              fontSize: 21,
              textColor: Colors.TRANSPARENT_GREY,
              fontFace: 'Regular'
        }
      }
     },
     ThunderDiagnosticService: {
     type: ThunderDiagnosticService
     }
   }
 }
/**
   * Thunder calls for Diagnostic functionality
   */

 _construct() {
	Log.info('Dtag: Enter Diagnostic Component ')
         }

 /**
   * Thunder calls for Getting DiagnosticInfo
   */

_diagnostic(){

this.tag('ThunderDiagnosticService')._diagnostic().then(data => {
console.log("@@@inside diag screen",data);
let version = this.tag('ThunderDiagnosticService').version
this.tag('DiagnosticVersionLabel').patch({text: {text: version}})
this.tag('DiagnosticInfoLabel').patch({text: {text: data}})
})
this.tag('ThunderDiagnosticService')._diagnosticVersion().then(data => {
console.log("@@@inside diag screen",data);
this.tag('DiagnosticIPLabel').patch({text: {text: data}})
})
this.tag('ThunderDiagnosticService')._diagnosticResolution().then(data => {
console.log("@@@inside diag screen",data);
this.tag('DiagnosticResolutionLabel').patch({text: {text: data}})
})

}
 
 /**
   * init functionality
   */
 _init() {
    Log.info('\n Dtag: Diagnostic screen init')
    this. _diagnostic()
    }
}








  

 


     

