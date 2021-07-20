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
import { ImageConstants } from '../../../constants/ImageConstants'
import { Colors } from '../../../constants/ColorConstants'
/**
 * @export
 * @class Tile
 * @extends {Lightning.Component}
 * Renders the Tile Component.
 */
export class Tile extends Lightning.Component {
  static _template() {
    return {
      TileBg: {
        rect: true,
        color: Colors.TRANSPARENT,
        w: 500,
        h: 282,
        TileImage: { x: 0, y: 0, src: Utils.asset('') }
      },
      HighLight: {
        x: 0,
        y: 0,
        src: Utils.asset(ImageConstants.TILE_HIGHLIGHT),
        Title: {
          x: 28,
          y: 90,
          text: { text: ' ', fontFace: 'Medium', fontSize: 34 }
        },
        Duration: {
          x: 450,
          y: 130,
          rect: true,
          h: 29,
          w: 74,
          text: { text: ' ', fontFace: 'Regular', fontSize: 24 }
        },
        Category: {
          x: 28,
          y: 130,
          text: { text: ' ', fontFace: 'Regular', fontSize: 24 }
        },
        visible: false
      }
    }
  }
  /**
   *  Sets scale, highlight and offset in parent
   */
  super() {
    this._highlight = false
    this._scaleX = 1.5
    this._scaleY = 1.5
    this._offset = 0
  }
  /**
   * Function to set width of tile background ,tile image and highlight for focused state
   */
  set w(v) {
    this.tag('TileBg').patch({ w: v })
    this.tag('TileImage').patch({ w: v })
    this.tag('HighLight').patch({ w: 1.1 * v, x: -0.05 * v })
  }
  /**
   * Function to set height of tile background ,tile image and highlight for focussed state
   */
  set h(v) {
    this._h = v
    this.tag('TileBg').patch({ h: v })
    this.tag('TileImage').patch({ h: v })
    this.tag('HighLight').patch({ h: 0.6 * v, y: 0.45 * v })
  }
  /**
   * Function to set tile image ,title,highlight,duration,category,scale X ,scale Y
   */
  set image(v) {
    this.tag('TileImage').patch({
       texture: { src: (v.search("http") == 0) ? v : Utils.asset(v) }
    })
  }

  set title(v) {
    this.tag('Title').patch({ text: { text: v } })
  }

  set highlight(v) {
    this._highlight = v
  }

  set duration(v) {
    this.tag('Duration').patch({ text: { text: v } })
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

  set offset(v) {
    this._offset = v
  }

  /*
   * Function to set highlight visiblity and x value devaited from original x value by offset distance
   */
  showHighLight() {
    this.tag('HighLight').visible = true
    this.x = this.x - this._offset
  }
  /*
   * Function to set visibility of highlight zero
   */
  hideHighLight() {
    this.tag('HighLight').visible = false
  }

  /*
   * When the component receives focus
   */
  _focus() {
    if (this._highlight == true) {
      this.showHighLight()
    }
    this.zIndex = 1
    this.pivotX = 1
    this.tag('TileBg').scaleX = this._scaleX
    this.tag('TileBg').scaleY = this._scaleY
  }

  /**
   * When the component loses focus
   */
  _unfocus() {
    if (this._highlight == true) {
      this.hideHighLight()
    }
    this.zIndex = null
    this.pivotX = 0
    this.x = 0
    this.tag('TileBg').scaleX = 1
    this.tag('TileBg').scaleY = 1
  }
}
