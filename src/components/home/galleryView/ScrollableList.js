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
import { Lightning } from '@lightningjs/sdk'
/**
 * @export
 * @class ScrollableList
 * @extends {Lightning.Component}
 * Renders the ScrollableList.
 */

export class ScrollableList extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof ScrollableList
   * Renders the template
   */
  super() {
    this._spacing = 0
  }

  static _template() {
    return {
      Header: {
        x: 0,
        y: 0,
        text: { text: '', fontFace: 'Regular', fontSize: 30 }
      },
      Wrapper: {
        type: Lightning.components.ListComponent,
        y: 60,
        w: 1920,
        h: 350,
        itemSize: 500,
        horizontal: true,
        roll: true,
        rollMin: 0,
        rollMax: 400,
        invertDirection: false,
        viewportSize: 1400
      }
    }
  }

  _init() {
    this._setState('Filled')
  }

  set rollMax(v) {
    this.tag('Wrapper').rollMax = v
  }

  set rollMin(v) {
    this.tag('Wrapper').rollMin = v
  }

  set roll(v) {
    this.tag('Wrapper').roll = v
  }

  set headerpos(v) {
    this.tag('Wrapper').patch({ x: v.x, y: v.y })
  }

  set itemSize(v) {
    this.tag('Wrapper').itemSize = v
  }

  set horizontal(v) {
    this.tag('Wrapper').horizontal = v
  }

  set header(v) {
    this.tag('Header').text.text = v
  }

  set items(v) {
    this.tag('Wrapper').items = v
    this._setState('Filled')
  }

  set spacing(v) {
    this._spacing = v
  }

  _reset() {
    this.tag('Wrapper').setIndex(0)
  }

  _getFocused() {
    return this.tag('Wrapper').element
  }

  _focus() {
    this.tag('Wrapper').x = this._spacing
  }

  _unfocus() {
    this.tag('Wrapper').x = 0
  }

  get element() {
    return this.tag('Wrapper').element
  }
  /**
   * @static
   * @returns
   * @memberof ScrollableList
   * set scrollableList States
   */
  static _states() {
    return [
      class Empty extends this {},
      class Filled extends this {
        _handleRight() {
          /**
           * Set next tile if not on last tile
           */
          if (
            this.tag('Wrapper').length - 1 != this.tag('Wrapper').index &&
            this.tag('Wrapper').horizontal == true
          ) {
            this.tag('Wrapper').setNext()
            return this.tag('Wrapper').element
          } else {
            return false
          }
        }

        _handleLeft() {
          /**
           * Set previous tile if not on first tile of row
           */
          if (0 != this.tag('Wrapper').index && this.tag('Wrapper').horizontal == true) {
            this.tag('Wrapper').setPrevious()
            return this.tag('Wrapper').element
          } else {
            return false
          }
        }

        _handleUp() {
          if (
            /**
             * Set next row if not on last row
             */
            this.tag('Wrapper').length - 1 != this.tag('Wrapper').index &&
            this.tag('Wrapper').horizontal == false
          ) {
            this.tag('Wrapper').setNext()
            return this.tag('Wrapper').element
          } else {
            return false
          }
        }

        _handleDown() {
          /**
           *Set previous row if not on first row
           */
          if (0 != this.tag('Wrapper').index && this.tag('Wrapper').horizontal == false) {
            this.tag('Wrapper').setPrevious()
            return this.tag('Wrapper').element
          } else {
            return false
          }
        }

        _getFocused() {
          /**
           * Set focus on scrollable List
           */
          return this.tag('Wrapper').element
        }
      }
    ]
  }
}
