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
 * @class VODCategoryItem
 * @extends Lightning.Component
 * Renders the VODCategoryItem
 */
export class VODCategoryItem extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof VODCategoryItem
   * Renders the template
   */
  static _template() {
    return {
      HighLight: {
        w: 228,
        h: 74,
        visible: false
      },
      Label: {
        x: 63,
        y: 21,
        h: 34,
        text: {
          text: '',
          fontFace: 'Medium',
          fontSize: 28,
          textColor: Colors.DIM_GREY
        }
      }
    }
  }

  /**
   * Sets the name of the menu
   */
  set items(v) {
    this._menuName = v.menuName
  }

  _init() {
    this.patch({
      Label: {
        text: {
          text: this._menuName
        }
      }
    })
  }

  /**
   * Function to update the highlight element of template
   */
  _highlight() {
    this.tag('HighLight').patch({
      src: Utils.asset(ImageConstants.COLLAPSED_BACKGROUND),
      visible: true
    })
    this.tag('Label').patch({
      text: { textColor: Colors.FLUORESCENT_GREEN }
    })
  }

  /**
   * On focus Hightlight and Label elements are patched
   */
  _focus() {
    this.patch({
      HighLight: {
        src: Utils.asset(ImageConstants.CATEGORY_SELECTION),
        visible: true
      }
    })
    this.patch({
      Label: {
        text: {
          textColor: Colors.LIGHTER_WHITE
        }
      }
    })
  }

  /**
   * While not on focus
   */
  _unfocus() {
    this.patch({ HighLight: { visible: false } })
    this.patch({
      Label: {
        text: {
          textColor: Colors.DIM_GREY
        }
      }
    })
  }
}
