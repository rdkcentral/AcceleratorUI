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
import { Lightning, Utils } from 'wpe-lightning-sdk'
import { Tile } from './GalleryTile'
import { ScrollableList } from './ScrollableList'
import { ImageConstants } from '../../../constants/ImageConstants'
import { Colors } from '../../../constants/ColorConstants'
/**
 * @export
 * @class GalleryView
 * @extends {Lightning.Component}
 * Renders the Gallery View.
 */
export class GalleryView extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof GalleryView
   * Renders the template
   */
  static _template() {
    return {
      GalleryRowList: {
        x: 232,
        y: 296,
        w: 1690,
        h: 1000,
        type: Lightning.components.ListComponent,
        horizontal: false,
        spacing: 72,
        roll: true,
        rollMin: 0,
        rollMax: 400,
        itemSize: 400,
        viewportSize: 700,
        invertDirection: true,
        clipping: true,
        rect: true,
        color: Colors.TRANSPARENT
      },
      Down: { x: 930, y: 980, src: Utils.asset(ImageConstants.DOWN), zIndex: 3 }
    }
  }

  _init() {
    this.tag('GalleryRowList').items = {
      Recommended: {
        type: ScrollableList,
        horizontal: true,
        itemSize: 520,
        spacing: 50,
        rollMax: 1400
      },
      Apps: {
        type: ScrollableList,
        horizontal: true,
        itemSize: 260,
        spacing: 20
      },
      MetroApps: {
        type: ScrollableList,
        horizontal: true,
        itemSize: 260,
        spacing: 20
      }
    }
    this.current = this.tag('GalleryRowList').element
    this._setState('GalleryViewState')
  }
  /**
   * Sets data in Tile component through data passed from JSON file
   */
  set data(v) {
    this.tag('GalleryRowList').items[0].header = v[0].data.header
    this.tag('GalleryRowList').items[0].items = v[0].data.assets.map((data, index) => {
      return {
        ref: 'Tile_' + index,
        type: Tile,
        image: data.url,
        category: data.category,
        title: data.title,
        duration: data.Duration,
        w: 500,
        h: 282,
        offset: 30,
        scaleX: 1.1,
        scaleY: 1.1,
        highlight: true,
        videoData: {
          title: data.title,
          videourl: data.videourl,
          name: data.name,
          category: data.category,
          logoPath: data.logoPath,
          number: data.number
        }
      }
    })
    this.tag('GalleryRowList').items[1].header = v[1].data.header
    if (process.env.APP_AMAZON == 'false' && process.env.APP_NETFLIX == 'false') {
      this.tag('GalleryRowList').items[1].items = [v[1].data.assets[0]].map((data, index) => {
        return {
          ref: 'Tile_' + index,
          type: Tile,
          image: data.url,
          w: 240,
          h: 135,
          scaleX: 1.2,
          scaleY: 1.2,
          appData: { url: data.appUrl, title: data.title }
        }
      })
    }
    else {
      this.tag('GalleryRowList').items[1].items = v[1].data.assets.map((data, index) => {
        return {
          ref: 'Tile_' + index,
          type: Tile,
          image: data.url,
          w: 240,
          h: 135,
          scaleX: 1.2,
          scaleY: 1.2,
          appData: { url: data.appUrl, title: data.title }
        }
      })
    }
    this.tag('GalleryRowList').items[2].patch({ y: -140, alpha: 1 })
    this.tag('GalleryRowList').items[2].header = v[2].data.header
    this.tag('GalleryRowList').items[2].items = v[2].data.assets.map((data, index) => {
      return {
        ref: 'Tile_' + index,
        type: Tile,
        image: data.url,
        w: 240,
        h: 135,
        scaleX: 1.2,
        scaleY: 1.2,
        appUrl: data.appUrl
      }
    })
  }

  _focus() {
    this.tag('GalleryRowList').x = 230
    this.tag('GalleryRowList').w = 1690
  }
  _unfocus() {
    this.tag('GalleryRowList').x = 440
    this.tag('GalleryRowList').w = 1440
  }

  /**
   * To reset the List
   */
  _reset() {
    this.tag('GalleryRowList').start()
    this.current = this.tag('GalleryRowList').element
  }

  /**
   * @static
   * @returns
   * @memberof GalleryView
   * GalleryView States
   */
  static _states() {
    return [
      class GalleryViewState extends this {
        _getFocused() {
          return this.current
        }
        /**
        * Set next gallery row if not on the last row or Remain in the same row on pressing Down Arrow
        * Reset the current row
        */
        _handleDown() {
          if (this.tag('GalleryRowList').length - 1 != this.tag('GalleryRowList').index) {
            this.tag('GalleryRowList').element._reset()
            this.tag('GalleryRowList').setNext()
          }
          this.current = this.tag('GalleryRowList').element
        }
        /**
        * Set Apps or Set Player
        */
        _handleEnter() {
          let currentTile = this.current.tag('Wrapper').element
          if (this.tag('GalleryRowList').index == 0) {
            let channelData = currentTile.videoData
            this.fireAncestors('$setPlayer', channelData)
          } else if (this.tag('GalleryRowList').index == 1) {
            let appData = this.current.tag('Wrapper').element.appData
            this.fireAncestors('$setPremiumApp', appData)
          } else if (this.tag('GalleryRowList').index == 2) {
            let url = this.current.tag('Wrapper').element.appUrl
            this.fireAncestors('$setMetroApp', url)
          }
        }
        /**
        * Set previous row and reset the gallery tiles
        */
        _handleUp() {
          if (0 != this.tag('GalleryRowList').index) {
            this.tag('GalleryRowList').element._reset()
            this.tag('GalleryRowList').setPrevious()
          }
          this.current = this.tag('GalleryRowList').element
        }
      }
    ]
  }
}
