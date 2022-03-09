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
import { Lightning, Log, Utils, Language } from '@lightningjs/sdk'
import { ImageConstants } from '../../../constants/ImageConstants'
import { Colors } from '../../../constants/ColorConstants'
import { Resolution_Class } from './ResolutionSettings'
import { Language_Class } from './LanguageSettings'
import { Audio_Class } from './AudioSettings'
import { Video_Class } from './VideoSettings'
import { GeneralSettingsTile } from './GeneralSettingsTile'

/**
 * @export
 * @class SettingsScreen
 * @extends Lightning.Component
 * Renders the SttingsScreen
 */
/* Settings Page Component  */
export class GeneralSettings extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof SettingsScreen
   * Renders the template
   */
  static _template() {
    return {
      GeneralSettingsBg: {
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
        GeneralSettingsLabel: {
          x: 82,
          y: 113,
          text: {
            text: Language.translate('General_Settings'),
            fontSize: 36,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Medium'
          }
        },
        Divider: { rect: true, w: 959.5, h: 2, x: 0.5, y: 178, color: Colors.LIGHTER_BLACK },
        GeneralSettingsMenu: {
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
      SelectedGeneralSettings: { x: 0, y: 1080, w: 960, h: 1080, visible: false }
    }
  }

  _init() {
    let menuList = ['Resolution Settings', 'Language Settings', 'Audio Settings', 'Video Settings']
    this.tag('GeneralSettingsMenu').items = menuList.map((data, index) => {
      return {
        ref: 'GeneralSettingsMenu' + index,
        type: GeneralSettingsTile,
        items: data,
        label: data
      }
    })
    this._setState('GeneralSettingsMenuState')
  }

  $setResolutionScreen() {
    // Resolution Screen
    this.childList.remove(this.tag('ResolutionPage'))
    this._setState('ResolutionState')
  }
  $setLanguageScreen() {
    // Language Screen
    this.childList.remove(this.tag('LanguagePage'))
    this._setState('LanguageState')
  }
  $setAudioScreen() {
    // Audio Screen
    this.childList.remove(this.tag('AudioPage'))
    this._setState('AudioState')
  }

  $setVideoScreen() {
    // Video Screen
    this.childList.remove(this.tag('VideoPage'))
    this._setState('VideoState')
  }

  $setGeneralSettingsScreen() {
    // GeneralSettings Screen
    this.childList.remove(this.tag('ResolutionPage'))
    this.childList.remove(this.tag('LanguagePage'))
    this.childList.remove(this.tag('AudioPage'))
    this.childList.remove(this.tag('VideoPage'))
    this._setState('GeneralSettingsMenuState')
  }

  /**
   * @static
   * @returns
   * @memberof GeneralSettingsScreen
   * GeneralSettingsScreen States
   */
  static _states() {
    return [
      class GeneralSettingsMenuState extends this {
        $enter() {}
        _handleDown() {
          if (this.tag('GeneralSettingsMenu').length - 1 != this.tag('GeneralSettingsMenu').index) {
            this.tag('GeneralSettingsMenu').setNext()
          }
        }
        _handleUp() {
          if (0 != this.tag('GeneralSettingsMenu').index) {
            this.tag('GeneralSettingsMenu').setPrevious()
          }
        }
        _handleEnter() {
          Log.info('\n Selected Menu ----')
          if (this.tag('GeneralSettingsMenu').index == 0) {
            this.tag('SelectedGeneralSettings').visible = false
            this.$setResolutionScreen()
          } else if (this.tag('GeneralSettingsMenu').index == 1) {
            this.tag('SelectedGeneralSettings').visible = true
            this.$setLanguageScreen()
          } else if (this.tag('GeneralSettingsMenu').index == 2) {
            this.tag('SelectedGeneralSettings').visible = true
            this.$setAudioScreen()
          } else if (this.tag('GeneralSettingsMenu').index == 3) {
            this.tag('SelectedGeneralSettings').visible = true
            this.$setVideoScreen()
          }
        }
        _getFocused() {
          return this.tag('GeneralSettingsMenu').element
        }
        $exit() {}
      },
      class ResolutionState extends this {
        $enter() {
          this.childList.a({
            ref: 'ResolutionPage',
            type: Resolution_Class,
            x: 0,
            y: 0,
            w: 960,
            h: 1080,
            label: this.tag('SelectedGeneralSettings')
          })
          this._setState('ResolutionScreen')
        }
        _handleBack() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }
        _handleLeft() {}
        _handleRight() {}

        _handleUp() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedGeneralSettings').tag('ResolutionScreen')
        }
        $exit() {}
      },
      class LanguageState extends this {
        $enter() {
          this.childList.a({
            ref: 'LanguagePage',
            type: Language_Class,
            x: 0,
            y: 0,
            w: 960,
            h: 1080,
            label: this.tag('SelectedGeneralSettings')
          })
          this._setState('LanguageScreen')
        }
        _handleBack() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }
        _handleLeft() {}
        _handleRight() {}

        _handleUp() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedGeneralSettings').tag('LanguageScreen')
        }
        $exit() {}
      },
      class AudioState extends this {
        $enter() {
          this.childList.a({
            ref: 'AudioPage',
            type: Audio_Class,
            x: 0,
            y: 0,
            w: 960,
            h: 1080,
            label: this.tag('SelectedGeneralSettings')
          })
          this._setState('AudioScreen')
        }
        _handleBack() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }
        _handleLeft() {}
        _handleRight() {}

        _handleUp() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedGeneralSettings').tag('AudioScreen')
        }
        $exit() {}
      },
      class VideoState extends this {
        $enter() {
          this.childList.a({
            ref: 'VideoPage',
            type: Video_Class,
            x: 0,
            y: 0,
            w: 960,
            h: 1080,
            label: this.tag('SelectedGeneralSettings')
          })
          this._setState('VideoScreen')
        }
        _handleBack() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }
        _handleLeft() {}
        _handleRight() {}

        _handleUp() {
          this.tag('SelectedGeneralSettings').childList.clear()
          this.tag('SelectedGeneralSettings').visible = false
          this._setState('GeneralSettingsMenuState')
        }

        _handleDown() {}

        _getFocused() {
          return this.tag('SelectedGeneralSettings').tag('VideoScreen')
        }
        $exit() {}
      },

      class ResolutionScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('ResolutionPage')
        }
      },
      class LanguageScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('LanguagePage')
        }
      },
      class AudioScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('AudioPage')
        }
      },
      class VideoScreen extends this {
        $enter() {}
        _getFocused() {
          return this.tag('VideoPage')
        }
      }
    ]
  }
}
