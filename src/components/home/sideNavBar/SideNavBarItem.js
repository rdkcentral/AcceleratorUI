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
import { ImageConstants } from '../../../constants/ImageConstants'
import { Colors } from '../../../constants/ColorConstants'
/**
 * @export
 * @class SideNavBarItem
 * @extends {Lightning.Component}
 * Renders SideNavBarItem Component
 */
export class SideNavBarItem extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof SideNavBarItem
   * Renders the template
   */
  static _template() {
    return {
      HighLight: {
        w: 400,
        h: 80,
        src: Utils.asset(ImageConstants.SIDEBAR_SELECTION_GRADIENT),
        visible: false
      },
      Icon: {
        x: 83,
        y: 15
      },
      Label: {
        x: 180,
        y: 25
      }
    }
  }
  /**
   * Set icons for respective menu item
   */
  set items(v) {
    this._menuName = v.menuName
    this._iconNormal = v.iconNormal
    this._iconSelected = v.iconSelected
    this._iconSelection = v.iconSelection
  }
  _init() {
    this.patch({
      Label: {
        text: {
          text: this._menuName,
          fontSize: 24,
          textColor: Colors.LIGHT_WHITE,
          fontFace: 'Medium'
        }
      }
    })
    this.patch({ Icon: { src: Utils.asset(this._iconNormal) } })
  }

  /**
   * Focus on sidenavbar with expanded icon and highlight visible
   */
  _focus() {
    this.patch({ Icon: { src: Utils.asset(this._iconSelection), alpha: 1 } })
    this.patch({ HighLight: { visible: true } })
  }

  /**
   * Focus out of sidenavbar
   */
  _unfocus() {
    this.patch({ Icon: { src: Utils.asset(this._iconNormal) } })
    this.patch({ HighLight: { visible: false } })
  }
}
