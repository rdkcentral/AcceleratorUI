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
import { Lightning, Utils, Log } from 'wpe-lightning-sdk'
import { Colors } from '../../constants/ColorConstants'
import { PlayerControls } from './PlayerControls'
import { InfoBar } from '../infoBar/InfoBar'
/**
 * @export
 * @class GalleryView
 * @extends {Lightning.Component}
 * Render the UI controls for the video player
 */

export class PlayerUI extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof PlayerUI
   * Renders the template
   */
  static _template() {
    return {
      Background: {
        width: 1920,
        height: 1080,
        Channel: {
          w: 361,
          h: 71,
          type: ChannelDetails,
          visible: false
        },
        InfoBar: { type: InfoBar, visible: false },
        PlayerControls: {
          x: 90,
          y: 657,
          w: 1920 - 84,
          h: 1080 - 657 - 60,
          type: PlayerControls,
          visible: true
        }
      }
    }
  }
  resetPlayerControls() {
    this.tag('PlayerControls')._reset()
  }
  /**
   * set channel data
   */
  set channelData(data) {
    this.data = data
    Log.info(data, 'data in set channelData')
    this.tag('PlayerControls').title = this.data.title
    this.tag('PlayerControls').subtitle = this.data.category
    this.tag('Channel').logo = this.data.logoPath
    this.tag('Channel').number = this.data.number
    this.tag('Channel').name = this.data.name
  }
  /**
   * set playerUi infobar , channel info , playercontrols visible
   */

  showPlayerUI() {
    this.visible = true
    this.tag('InfoBar').showInfobar()
    this.tag('Channel').visible = true
    Log.info('Show player UI')
    this.tag('PlayerControls').visible = true
  }

  hidePlayerUI() {
    Log.info('Hide Player UI')
    this.visible = false
  }

  _getFocused() {
    return this.tag('PlayerControls')
  }
  /**
   * Progress bar time settings
   * @param {String} currentTime current time to be displayed
   * @param {String} duration video duration to be set.
   */
  mediaplayerProgress(currentTime, duration) {
    this.tag('PlayerControls').currentTime = currentTime
    this.tag('PlayerControls').duration = duration
  }
}

/**
 * @class ChannleDetails
 * @extends Lightning.Component
 * Renders the ChannelDetails
 */
class ChannelDetails extends Lightning.Component {
  static _template() {
    return {
      ChannelInfo: {
        flex: { direction: 'row' },
        x: 85,
        color: Colors.TRANSPARENT,
        Logo: { flexItem: { margin: 25 }, w: 170, h: 70 },
        Channeldata: {
          flexItem: {},
          ChannelNumber: { y: 60, text: { text: '' } },
          ChannelName: { y: 94 }
        }
      }
    }
  }
  /**
   * Function to set data for Channel Logo
   */
  set logo(v) {
    this.tag('Logo').patch({ y: 37, src: Utils.asset(v) })
  }
  /**
   * Function to set data for Channel number
   */
  set number(v) {
    this.tag('ChannelNumber').patch({
      y: 60,
      text: { fontSize: 28, fontStyle: 'bold', text: v }
    })
  }
  /**
   * Function to set data for Channel name
   */
  set name(v) {
    this.tag('ChannelName').patch({ y: 94, text: { fontSize: 30, text: v } })
  }
}
