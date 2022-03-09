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
import { Lightning, Log, Utils, Language, Storage } from '@lightningjs/sdk'
import { ImageConstants } from '../../../constants/ImageConstants'
import { Colors } from '../../../constants/ColorConstants'
import { ResetSettingsTile } from './ResetSettingsTile'
import { ResetAppsPairScreen } from './ResetAppsPairScreen'

/**
 * @export
 * @class SettingsScreen
 * @extends Lightning.Component
 * Renders the SttingsScreen
 */
/* Settings Page Component  */
export class ResetSettings extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof SettingsScreen
   * Renders the template
   */
  static _template() {
    return {
      ResetSettingsBg: {
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
            text: Language.translate('Settings'),
            fontSize: 28,
            textColor: Colors.TRANSPARENT_GREY,
            fontFace: 'Regular'
          }
        },
        ResetSettingsLabel: {
          x: 82,
          y: 113,
          text: {
            text: Language.translate('Reset_Settings'),
            fontSize: 36,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Medium'
          }
        },
        Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
        ResetSettingsMenu: {
          type: Lightning.components.ListComponent,
          x: 81,
          y: 209,
          w: 800,
          h: 1080,
          visible: true,
          itemSize: 120,
          horizontal: false,
          invertDirection: true,
          roll: true,
          rollMax: 0,
          rollMin: 0,
          spacing: 30,
          viewportSize: 1300,
          clipping: true
        }
      },
      SelectedResetSettings: { x: 0, y: 1080, w: 960, h: 1080, visible: false }
    }
  }

  _construct() {
    this.pairedDevices = []
  }

  _init() {
    this.tag('ResetSettingsMenu').items = ['Reset Device'].map((data, index) => {
      return {
        ref: 'ResetSettingsMenu' + index,
        type: ResetSettingsTile,
        items: data,
        label: data
      }
    })
    this._setState('ResetSettingsMenuState')
  }

  $setResetDeviceScreen() {
    this.childList.remove(this.tag('ResetDevicePage'))
    this._setState('ResetDeviceState')
  }

  $setResetSettingsScreen() {
    this.childList.remove(this.tag('ResetAppsPairingPage'))
    this._setState('ResetSettingsMenuState')
  }

  /**
   * @static
   * @returns
   * @memberof GeneralSettingsScreen
   * GeneralSettingsScreen States
   */
  static _states() {
    return [
      class ResetSettingsMenuState extends this {
        $enter() {}
        _handleDown() {
          if (this.tag('ResetSettingsMenu').length - 1 != this.tag('ResetSettingsMenu').index) {
            this.tag('ResetSettingsMenu').setNext()
          }
        }
        _handleUp() {
          if (0 != this.tag('ResetSettingsMenu').index) {
            this.tag('ResetSettingsMenu').setPrevious()
          }
        }
        _handleEnter() {
          Log.info('\n Selected Menu ----')
          if (this.tag('ResetSettingsMenu').index == 0) {
            this.tag('SelectedResetSettings').visible = true
            this.$setResetDeviceScreen()
          }
        }
        _getFocused() {
          return this.tag('ResetSettingsMenu').element
        }
        $exit() {}
      },

      class ResetDeviceState extends this {
        $enter() {
          Storage.set('setCurrentresetApp', 'Device')
          this.childList.a({ ref: 'ResetAppsPairingPage', type: ResetAppsPairScreen, x: -960 })
          this._setState('ResetDeviceScreen')
        }
        _handleBack() {
          this.tag('SelectedResetSettings').childList.clear()
          this.tag('SelectedResetSettings').visible = false
          this._setState('ResetSettingsMenuState')
        }
        _handleLeft() {}
        _handleRight() {}

        _handleUp() {
          this.tag('SelectedResetSettings').childList.clear()
          this.tag('SelectedResetSettings').visible = false
          this._setState('ResetSettingsMenuState')
        }

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedResetSettings').tag('ResetDeviceScreen')
        }
        $exit() {}
      },

      class ResetDeviceScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('ResetAppsPairingPage')
        }
      }
    ]
  }
}
