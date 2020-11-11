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
import { Lightning, Utils, Log } from '@lightningjs/sdk'
import { ImageConstants } from '../../constants/ImageConstants'
/**
 * @export
 * @class GalleryView
 * @extends {Lightning.Component}
 * Render the UI controls for the video player
 */
export class PlayerControls extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof PlayerControls
   * Renders the template
   */
  static _template() {
    return {
      w: 1755,
      clipping: true,
      Title: {
        w: 409,
        h: 67
      },
      Subtitle: {
        y: 72,
        w: 202,
        h: 34
      },
      TimeBar: {
        y: 142,
        zIndex: 1,
        color: 0xff3a3a3a,
        w: 1755,
        h: 8,
        rect: true
      },
      ProgressBar: {
        y: 142,
        h: 8,
        zIndex: 1,
        rect: true,
        color: 0xff0ad887
      },

      ControlsBackground: {
        w: 1755,
        h: 116,
        y: 147,
        rect: true,
        color: 0xff000000,
        CurrentTime: {
          color: 0xffc4c4c4,
          w: 92,
          h: 29,
          x: 27,
          y: 11
        },
        TotalTime: {
          color: 0xffc4c4c4,
          x: 1638,
          y: 11,
          w: 92,
          h: 29
        },
        ControlsList: {
          x: 506,
          y: 5,
          w: 740,
          h: 106,
          roll: true,
          itemSize: 146,
          horizontal: true,
          invertDirection: false,
          type: Lightning.components.ListComponent
        }
      },

      SettingsBackground: {
        y: 263,
        w: 1755,
        h: 100,
        rect: true,
        color: 0x30000052,
        PlaybackSettings: {
          x: 533,
          y: 0,
          w: 690,
          h: 100,
          itemSize: 144,
          roll: true,
          horizontal: true,
          invertDirection: false,
          type: Lightning.components.ListComponent
        }
      }
    }
  }

  _init() {
    this.toggle = null
    /**
     * Setting icons for Controls and Settings
     */
    this.tag('ControlsList').items = [
      {
        iconNormal: ImageConstants.FIRST,
        iconSelected: ImageConstants.FIRST_SELECTED,
        HighLight: ImageConstants.PRIMARY_SELECTION
      },
      {
        iconNormal: ImageConstants.REWIND,
        iconSelected: ImageConstants.REWIND_SELECTED,
        HighLight: ImageConstants.PRIMARY_SELECTION
      },
      {
        iconNormal: ImageConstants.PAUSEBUTTON,
        iconSelected: ImageConstants.PAUSE_SELECTED,
        HighLight: ImageConstants.PRIMARY_SELECTION
      },
      {
        iconNormal: ImageConstants.FORWARD,
        iconSelected: ImageConstants.FORWARD_SELECTED,
        HighLight: ImageConstants.PRIMARY_SELECTION
      },
      {
        iconNormal: ImageConstants.LAST,
        iconSelected: ImageConstants.LAST_SELECTED,
        HighLight: ImageConstants.PRIMARY_SELECTION
      }
    ].map((data, index) => {
      return {
        ref: 'Icon_' + index,
        type: IconComponent,
        items: data,
        h: 106
      }
    })
    this.tag('PlaybackSettings').items = [
      {
        iconNormal: ImageConstants.RECORD,
        iconSelected: ImageConstants.RECORD_INACTIVE,
        HighLight: ImageConstants.SECONDARY_SELECTION
      },
      {
        iconNormal: ImageConstants.SETTINGS_ICON_NORMAL,
        iconSelected: ImageConstants.SETTINGS_ICON_SELECTED,
        HighLight: ImageConstants.SECONDARY_SELECTION
      },
      {
        iconNormal: ImageConstants.CAPTIONS,
        iconSelected: ImageConstants.CAPTIONS,
        HighLight: ImageConstants.SECONDARY_SELECTION
      },
      {
        iconNormal: ImageConstants.INFO,
        iconSelected: ImageConstants.INFO,
        HighLight: ImageConstants.SECONDARY_SELECTION
      }
    ].map((data, index) => {
      return {
        ref: 'Icon_' + index,
        type: IconComponent,
        items: data,
        h: 106,
        w: 140
      }
    })
    //Variable to store the duration of the video content.
    this.videoDuration = 0
    this._setState('PlaybackControls')
  }

  /**
   * Function to set the title in the video controls.
   * @param {String} title title to be displayed in video controls.
   */
  set title(v) {
    Log.info('setting title', v)
    this.tag('Title').patch({
      text: {
        fontSize: 56,
        fontFace: 'Regular',
        text: v
      }
    })
  }
  /**
   * Function to set the subtitle in the video control menu.
   * @param {String} subtitle sub title to be displayed.
   */
  set subtitle(v) {
    this.tag('Subtitle').patch({
      text: {
        fontSize: 28,
        fontFace: 'Medium',
        text: v
      }
    })
  }
  /**
   * Function to set the duration of the video.
   * @param {String} duration video duration to be set.
   */
  set duration(v) {
    this.videoDuration = v
    this.tag('TotalTime').patch({
      text: {
        fontSize: 24,
        textAlign: 'center',
        fontFace: 'Regular',
        text: this.SecondsTohhmmss(v)
      }
    })
  }
  /**
   * Function to set the current video time.
   * @param {String} currentTime current time to be set.
   */
  set currentTime(v) {
    this.tag('CurrentTime').patch({
      text: {
        fontSize: 24,
        textAlign: 'center',
        fontFace: 'Regular',
        text: this.SecondsTohhmmss(v)
      }
    })
    this.tag('ProgressBar').patch({
      w: (1755 * v) / this.videoDuration
    })
  }
  /**
   * Function to convert time in seconds to hh:mm:ss format.
   * @param {String} totalSeconds time in seconds.
   */
  SecondsTohhmmss(totalSeconds) {
    this.hours = Math.floor(totalSeconds / 3600)
    this.minutes = Math.floor((totalSeconds - this.hours * 3600) / 60)
    this.seconds = totalSeconds - this.hours * 3600 - this.minutes * 60
    this.seconds = Math.round(totalSeconds) - this.hours * 3600 - this.minutes * 60
    this.result = this.hours < 10 ? '0' + this.hours : this.hours
    this.result += ':' + (this.minutes < 10 ? '0' + this.minutes : this.minutes)
    this.result += ':' + (this.seconds < 10 ? '0' + this.seconds : this.seconds)
    return this.result
  }

  _active() {
    //To bring back the focus to the pause/play button whenever the control is on screen
    this.tag('ControlsList').setIndex(2)
  }
  /**
   * To reset the PlayerControls
   */
  _reset() {
    this.toggle = null
    let currentIndex = 2
    if (this.tag('ControlsList').index == 0 || this.tag('ControlsList').index == 4) {
      currentIndex = this.tag('ControlsList').index
      Log.info(this.currentIndex, 'currentIndex')
    }
    this.tag('ControlsList').setIndex(2)
    this.tag('ControlsList')
      .element.tag('Icon')
      .patch({
        src: Utils.asset(ImageConstants.PAUSEBUTTON)
      })
    this.tag('ControlsList').element.patch({
      items: {
        iconNormal: ImageConstants.PAUSEBUTTON,
        iconSelected: ImageConstants.PAUSE_SELECTED,
        HighLight: ImageConstants.PRIMARY_SELECTION
      }
    })

    this.tag('ControlsList').setIndex(currentIndex)
    this._setState('PlaybackControls')
  }
  /**
   * @static
   * @returns
   * @memberof PlayerControls
   * set Player Controls States
   */
  static _states() {
    return [
      class PlaybackControls extends this {
        $enter() {
          this.index = 0
          this.tag('ControlsList').setIndex(2)
        }
        _handleRight() {
          if (this.tag('ControlsList').length - 1 != this.tag('ControlsList').index) {
            this.tag('ControlsList').setNext()
          }
        }
        _handleLeft() {
          if (0 != this.tag('ControlsList').index) {
            this.tag('ControlsList').setPrevious()
          }
        }
        _getFocused() {
          return this.tag('ControlsList').element
        }
        _handleDown() {
          this._setState('PlaybackSettings')
        }
        _handleUp() {
          Log.info('Hide Control !!!!!!!!')
          this.fireAncestors('$exitPlayerControl', '')
        }
        _handleEnter() {
          switch (this.tag('ControlsList').index) {
            case 0:
              this.fireAncestors('$lastVideo', '')
              break
            case 1:
              this.fireAncestors('$rewind', '')
              break
            case 2:
              this.fireAncestors('$doPlayPause', '')
              if (this.toggle == 0) {
                this.tag('ControlsList').element.patch({
                  items: {
                    iconNormal: ImageConstants.PAUSEBUTTON,
                    iconSelected: ImageConstants.PAUSE_SELECTED,
                    HighLight: ImageConstants.PRIMARY_SELECTION
                  }
                })
                this.tag('ControlsList')
                  .element.tag('Icon')
                  .patch({
                    src: Utils.asset(ImageConstants.PAUSE_SELECTED)
                  })
                this.toggle = 1
              } else {
                this.tag('ControlsList').element.patch({
                  items: {
                    iconNormal: ImageConstants.PLAY,
                    iconSelected: ImageConstants.PLAY_SELECTED,
                    HighLight: ImageConstants.PRIMARY_SELECTION
                  }
                })
                this.tag('ControlsList')
                  .element.tag('Icon')
                  .patch({
                    src: Utils.asset(ImageConstants.PLAY_SELECTED)
                  })
                this.toggle = 0
              }
              break
            case 3:
              this.fireAncestors('$fastfwd', '')
              break
            case 4:
              this.fireAncestors('$nextVideo', '')
              break
          }
        }
        $exit() {
          this.tag('ControlsList').setIndex(2)
        }
      },
      class PlaybackSettings extends this {
        $enter() {
          this.tag('ControlsList').setIndex(2)
          Log.info('\n Playback setting state')
        }
        _handleRight() {
          if (this.tag('PlaybackSettings').length - 1 != this.tag('PlaybackSettings').index) {
            this.tag('PlaybackSettings').setNext()
          }
        }
        _handleLeft() {
          if (0 != this.tag('PlaybackSettings').index) {
            this.tag('PlaybackSettings').setPrevious()
          }
        }
        _handleEnter() {
          this.fireAncestors('$mediaplayerControl', '')
        }
        _getFocused() {
          return this.tag('PlaybackSettings').element
        }
        _handleUp() {
          this.visible = true
          this.alpha = 1
          this._setState('PlaybackControls')
        }
        $exit() {
          this.tag('PlaybackSettings').setIndex(0)
        }
      }
    ]
  }
}
class IconComponent extends Lightning.Component {
  static _template() {
    return {
      HighLight: {
        visible: false,
        mountX: 0.5
      },
      Icon: {
        mount: 0.5,
        zIndex: 1
      }
    }
  }
  set items(v) {
    this._iconNormal = v.iconNormal
    this._iconSelected = v.iconSelected
    this._HighLight = v.HighLight
  }
  _init() {
    this.tag('Icon').patch({
      x: this.w / 2,
      y: this.h / 2,
      src: Utils.asset(this._iconNormal)
    })
    this.tag('HighLight').patch({
      x: this.w / 2,
      src: Utils.asset(this._HighLight)
    })
  }

  _focus() {
    this.tag('HighLight').patch({ visible: true })
    this.tag('Icon').patch({ src: Utils.asset(this._iconSelected), scale: 1.1 })
  }

  _unfocus() {
    this.tag('HighLight').patch({ visible: false })
    this.tag('Icon').patch({ src: Utils.asset(this._iconNormal), scale: 1 })
  }
}
