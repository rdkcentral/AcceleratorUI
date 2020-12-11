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
import { StringConstants } from '../../constants/StringConstants'
import { ImageConstants } from '../../constants/ImageConstants'
import { Colors } from '../../constants/ColorConstants'
import { TimeUtils } from '../../utils/TimeUtils'
/**
 * @export
 * @class InfoBar
 * @extends {Lightning.Component}
 * To render the InfoBar Component.
 */
export class InfoBar extends Lightning.Component {
  static _template() {
    return {
      Logo: {
        x: 1555,
        y: 39,
        w: 272,
        h: 79,
        alpha: 0,
        flex: { direction: 'row', padding: 20, wrap: true },
        rect: true,
        color: Colors.TRANSPARENT,
        LogoflexItem: {
          src: Utils.asset(ImageConstants.LOGO)
        }
      },
      Info: {
        x: 1436,
        y: 56,
        w: 400,
        h: 200,
        alpha: 1,
        flex: { direction: 'row' },
        rect: true,
        color: Colors.TRANSPARENT,
        Wifi: {
          src: Utils.asset(ImageConstants.WIFI),
          flexItem: {
            marginBottom: 976,
            marginRight: 32
          }
        },
        Bluetooth: {
          src: Utils.asset(ImageConstants.BLUETOOTH),
          flexItem: {
            marginBottom: 976
          }
        },
        Weather: {
          w: 52,
          src: Utils.asset(ImageConstants.WEATHER),
          flexItem: {
            marginLeft: 31.5,
            marginBottom: 976
          }
        },
        Temperature: {
          text: {
            text: StringConstants.TEMP,
            fontFace: 'Medium',
            fontSize: 32
          },
          flexItem: {
            marginLeft: 8,
            marginBottom: 981
          }
        },
        Time: {
          h: 38,
          text: { text: ' ', fontFace: 'Medium', fontSize: 32 },
          flexItem: {
            marginLeft: 32,
            marginBottom: 975
          }
        }
      }
    }
  }

  _init() {
    this.updateTimebar()
    setInterval(this.updateTimebar.bind(this), 60000) //Updating time in every minute
    this._setState('InfoState') // To show infobar as default
  }

  /**
   * Returns the current time
   */
  updateTimebar() {
    this.time = new TimeUtils()
    this.timeText = this.time.getCurrentTime()
    this.tag('Time').patch({ text: { text: this.timeText } })
  }

  /**
   * Switches state to info that is to be used with set Timeout/Interval
   */
  switchtoInfo() {
    this._setState('InfoState')
  }

  /**
   * Switches state to logo that is to be used with set Timeout/Interval
   */
  switchtoLogo() {
    this._setState('LogoState')
  }

  /**
   * Function to use in other files to hide infobar
   */
  hideInfobar() {
    clearInterval(this.flag)
    clearInterval(this.flag1)
    this.visible = false
  }

  /**
   * Function to use in other files to show infobar
   */
  showInfobar() {
    this.visible = true
    this._setState('InfoState')
  }

  /**
   * @static
   * @returns
   * @memberof InfoBar
   * Infobar states
   */
  static _states() {
    return [
      class LogoState extends this {
        $enter() {
          this.tag('Logo').alpha = 1
          this.flag = setTimeout(this.switchtoInfo.bind(this), 10000) //Switch to Info state after 10 seconds
        }
        $exit() {
          this.tag('Logo').alpha = 0
        }
      },
      class InfoState extends this {
        $enter() {
          this.tag('Info').alpha = 1
          this.flag1 = setTimeout(this.switchtoLogo.bind(this), 120000) // Switch to Logo state after 2 minutes
        }
        $exit() {
          this.tag('Info').alpha = 0
        }
      }
    ]
  }
}
