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
import { Utils, Lightning } from '@lightningjs/sdk'
import { ImageConstants } from '../../constants/ImageConstants'
import { Colors } from '../../constants/ColorConstants'
/**
 * @export
 * @class SettingsMenuItem
 * @extends Lightning.Component
 * Renders SettingsMenuItem
 */
export class SettingsMenuItem extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof SettingsMenuItem
   * Renders template
   */
  static _template() {
    return {
      TileBg: {
        rect: true,
        x: 9,
        y: 1,
        w: 300,
        h: 286,
        color: Colors.LIGHT_PURPLE
      },
      Icon: {
        x: 102,
        y: 65
      },
      Label: {
        x: 42,
        y: 213,
        h: 64,
        w: 234,
        text: {
          text: '',
          fontFace: 'Medium',
          fontSize: 26,
          lineHeight: 25,
          textColor: Colors.LIGHTER_WHITE,
          textAlign: 'center'
        }
      },
      HighLight: {
        x: 0,
        y: 0,
        w: 318,
        h: 310,
        src: Utils.asset(ImageConstants.SETTINGS_MENU_HIGHLIGHT),
        visible: false
      }
    }
  }
  set items(v) {
    this._menuName = v.menuName
    this._menuIcon = v.menuIcon
  }

  _init() {
    this.patch({
      Label: {
        text: {
          text: this._menuName
        }
      }
    })
    this.patch({ Icon: { src: Utils.asset(this._menuIcon) } })
  }

  /**
   * To highlight the selected Item
   */
  _highlight() {
    this.patch({
      TileBg: {
        color: Colors.DIM_BLACK,
        scaleX: 1.06,
        scaleY: 1.085
      }
    })
    this.patch({ HighLight: { visible: true } })
  }

  /**
   * While on focus , call Highlight function
   */
  _focus() {
    this._highlight()
  }

  /**
   * while not in focus, patch the tile color, x and y scale
   */
  _unfocus() {
    this.patch({
      TileBg: {
        color: Colors.LIGHT_PURPLE,
        scaleX: 1,
        scaleY: 1
      }
    })
    this.patch({ HighLight: { visible: false } })
  }
}
