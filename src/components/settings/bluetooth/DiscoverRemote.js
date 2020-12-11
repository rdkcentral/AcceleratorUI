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
import { Lightning, Utils } from '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
import { ImageConstants } from '../../../constants/ImageConstants'

/**
 * @export
 * @class DiscoverRemoteInfo
 * @extends Lightning.Component
 * Renders DiscoverRemoteInfo
 */
export class DiscoverRemoteInfo extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof DiscoverRemoteInfo
   * Renders the template
   */
  static _template() {
    return {
      Arrow: { x: 250, y: 120, src: Utils.asset(ImageConstants.NEXT_ARROW) },
      Title: {
        x: 295,
        y: 113,
        text: {
          text: 'How to Discover',
          fontSize: 36,
          textColor: Colors.LIGHTER_WHITE,
          fontFace: 'Bold'
        }
      },
      Instruction: {
        x: 0,
        y: 178,
        src: Utils.asset(ImageConstants.BLUETOOTH_REMOTE),
        w: 960,
        h: 682
      },
      ScanTime: {
        x: 382,
        y: 921,
        text: { text: '', fontSize: 40, textColor: Colors.FLUORESCENT_GREEN, fontFace: 'Regular' }
      },
      PostScript: {
        x: 279,
        y: 974,
        text: {
          text: '( Until scan results load automatically )',
          fontSize: 24,
          textColor: Colors.MEDIUM_GREY,
          fontFace: 'Regular'
        }
      }
    }
  }

  _construct() {
    this.timer = 10
  }

  _active() {
    // Timeout of 10 seconds in scan of devices and repeat timer in every one second
    this.timer = 10
    this.timerFlag = setInterval(this.updateTimer.bind(this), 1000)
  }

  _inactive() {
    //clears timer while not on screen
    this.timer = 10
    clearInterval(this.timerFlag)
  }

  zeroPad(num, places) {
    return String(num).padStart(places, '0')
  }

  /**
   * Function to Update Time of scan
   */
  updateTimer() {
    this.tag('ScanTime').text.text = '00:' + this.zeroPad(this.timer, 2)
    if (this.timer == 0) {
      clearInterval(this.timerFlag)
    } else {
      this.timer = this.timer - 1
    }
  }
}
