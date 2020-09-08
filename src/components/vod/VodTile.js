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
import { Utils, Lightning } from 'wpe-lightning-sdk'
import { Colors } from '../../constants/ColorConstants'
import { ImageConstants } from '../../constants/ImageConstants'
/**
 * @export
 * @class VODTile
 * @extends Lightning.Component
 * Renders the VODTile
 */
export class VODTile extends Lightning.Component {
  
  /**
   * @static
   * @returns
   * @memberof VODTile
   * Renders the template
   */
  static _template() {
    return {
      TileBg: {
        rect: true,
        w: 391,
        h: 282,
        color: Colors.TRANSPARENT,
        TileImage: {
          x: 0,
          y: 0,
          src: ''
        }
      },
      HighLight: {
        x: 0,
        y: 0,
        src: Utils.asset(ImageConstants.VOD_TILE_SELECTION),
        Title: {
          x: 28,
          y: 55,
          text: {
            text: '',
            fontFace: 'Medium',
            fontSize: 34,
            textColor: Colors.WHITE
          }
        },
        Category: {
          x: 28,
          y: 105,
          text: {
            text: '',
            fontFace: 'Regular',
            fontSize: 24,
            textColor: Colors.WHITE
          }
        },
        Pointer: {
          x: 220,
          y: 140,
          src: Utils.asset(ImageConstants.VOD_POINTER),
          zIndex: 1
        },
        Duration: {
          x: 340,
          y: 105,
          text: {
            text: '',
            fontFace: 'Regular',
            fontSize: 24,
            textColor: Colors.WHITE
          }
        },
        CostBg: {
          rect: true,
          w: 128,
          h: 48,
          x: 300,
          y: -175,
          color: Colors.LIGHT_BLACK,
          CostText: {
            x: 24,
            y: 10,
            text: {
              text: '',
              fontFace: 'Medium',
              fontSize: 24,
              textColor: Colors.YELLOW
            }
          }
        },
        visible: false
      }
    }
  }

  /**
   * Sets elements in Template
   */
  set w(v) {
    this.tag('HighLight').patch({ w: 1.21 * v, x: -0.105 * v })
  }

  set h(v) {
    this.tag('HighLight').patch({ h: 0.5 * v, y: 0.61 * v })
  }

  set image(v) {
    this.tag('TileImage').patch({ src: Utils.asset(v), w: 391, h: 282 })
  }

  set title(v) {
    this.tag('Title').patch({ text: { text: v } })
  }

  set duration(v) {
    this.tag('Duration').patch({ text: { text: v } })
  }

  set cost(v) {
    this.tag('CostText').patch({ text: { text: v } })
  }

  set category(v) {
    this.tag('Category').patch({ text: { text: v } })
  }

  set scaleX(v) {
    this._scaleX = v
  }

  set scaleY(v) {
    this._scaleY = v
  }

  /**
   * Functions to show and hide highlight
   */
  showHighLight() {
    this.tag('HighLight').visible = true
  }

  hideHighLight() {
    this.tag('HighLight').visible = false
  }

  /**
   * On focus $TileFocus fireacncestor is called
   * hightlight is made visible
   * elemnets sizes are updated
   */
  _focus() {
    this.fireAncestors('$TileFocus', '')
    this.showHighLight()
    this.zIndex = 1
    this.tag('TileBg').scaleX = this._scaleX
    this.tag('TileBg').scaleY = this._scaleY
    this.tag('TileImage').scaleX = this._scaleX
    this.tag('TileImage').scaleY = this._scaleY
  }
  
  /**
   * On out of focus , highlight is hidden
   * elemnets are scaled back to normal size
   */
  _unfocus() {
    this.hideHighLight()
    this.zIndex = null
    this.tag('TileBg').scaleX = 1
    this.tag('TileBg').scaleY = 1
    this.tag('TileImage').scaleX = 1
    this.tag('TileImage').scaleY = 1
  }
}
