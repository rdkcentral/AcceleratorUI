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
import { VODCategory } from './VodCategory'
import { Colors } from '../../constants/ColorConstants'
import { VODDescription } from './VodDescription'
import { VODTileRow } from './VodTileRow'
import { ImageConstants } from '../../constants/ImageConstants'
import { TimeUtils } from '../../utils/TimeUtils'

/**
 * @export
 * @class VODScreen
 * @extends Lightning.Component
 * Renders VOD Screen
 */
export class VODScreen extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof VODScreen
   * Renders the template
   */
  static _template() {
    return {
      VODCategoryBg: {
        /*rect: true,
        w: 1740,
        h: 230,
        x: 182,
        color: Colors.GREY,*/
        src: Utils.asset(ImageConstants.VOD_TEXTURE),
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        alpha: 0.56,
        /*Time: {
          x: 1515,
          y: 61,
          text: {
            text: {
              text: ' ',
              fontFace: 'Medium',
              fontSize: 32,
              textColor: Colors.LIGHTER_WHITE
            }
          }
        },*/
        Down: { x: 930, y: 980, src: Utils.asset(ImageConstants.DOWN), zIndex: 3, visible: true },
        VODCategory: { type: VODCategory }
      },
      VODBg: {
        rect: true,
        h: 867,
        w: 1740,
        x: 182,
        y: 230,
        color: Colors.BLACK,
        SeeAllComponent: {
          rect: true,
          w: 160,
          h: 282,
          x: 52,
          y: 112,
          color: Colors.LIGHTER_GREY,
          SeeAllBorder: {
            src: Utils.asset(ImageConstants.SEE_ALL_SELECTION),
            visible: false
          },
          SeeAllIcon: {
            x: 60.5,
            y: 106.5,
            src: Utils.asset(ImageConstants.SEE_ALL)
          },
          SeeAllText: {
            x: 43.5,
            y: 146.5,
            text: {
              text: 'See All',
              fontSize: 24,
              fontFace: 'Regular',
              textColor: Colors.TRANSPARENT_GREY
            }
          }
        },
        GalleryRowList: {
          x: 68,
          y: 50,
          w: 1740,
          h: 1000,
          type: Lightning.components.ListComponent,
          horizontal: false,
          spacing: 72,
          roll: true,
          rollMin: 0,
          rollMax: 600,
          itemSize: 400,
          viewportSize: 700,
          invertDirection: true,
          clipping: true,
          rect: true,
          color: Colors.TRANSPARENT
        },
        Description: { type: VODDescription, visible: false }
      }
    }
  }

  _init() {
    /**
     * Gets and sets time in Time element
     * Sets state to VODCategoryState
     * Sets previous index as -1
     */
    //this.updateTimebar()
    //this.time = new TimeUtils()
    //setInterval(this.updateTimebar.bind(this), 30000)
    this._setState('VODCategoryState')
    this.prevIndex = -1
    //flag to indicate that a VOD content is played just before entering the VOD screen
    this.videoPlayedFlag = false
  }

  /**
   * Returns the current time
   */
  /*async updateTimebar() {
    this.timeText = await this.time.getCurrentTime()
    this.tag('Time').patch({ text: { text: this.timeText } })
  }*/

  /**
   * While on screen and active sets to VODCategoryState
   * if the view is active after exiting from VOD, then set the state to Gallery View State
   */
  _active() {
    if (this.videoPlayedFlag == true) {
      this._setState('GalleryViewState')
      this.videoPlayedFlag = false
    } else {
      this._setState('VODCategoryState')
    }
  }

  /**
   * Sets Row data
   */
  set data(v) {
    this._rows = v
    this.tag('GalleryRowList').items = this._rows.map((i, index) => {
      return {
        ref: 'Row_' + index,
        type: VODTileRow,
        tileItem: i,
        debugId: 'tile_' + index
      }
    })
    this.tag('GalleryRowList').items[0].patch({ x: 207 })
    this.tag('GalleryRowList').items[0].patch({ y: 3 })
  }

  /**
   * Fire ancestor to call when individual tiles are on focus
   */
  $TileFocus() {
    this.tag('Description').patch({ visible: true })
    this.tag('Description').descriptiondata = {
      descriptiontext: this.current.tag('TileList').element.descriptiontext,
      descriptiontitle: this.current.tag('TileList').element.descriptiontitle,
      ratingone: this.current.tag('TileList').element.ratingone,
      ratingtwo: this.current.tag('TileList').element.ratingtwo,
      ratingthree: this.current.tag('TileList').element.ratingthree,
      ratingfour: this.current.tag('TileList').element.ratingfour,
      ratingfive: this.current.tag('TileList').element.ratingfive,
      channelnumber: this.current.tag('TileList').element.channelnumber,
      quality: this.current.tag('TileList').element.quality
    }
  }

  /**
   * While on Focus
   */
  _focus() {
    this.tag('VODCategoryBg').x = 182
    this.tag('VODCategoryBg').w = 1740
    this.tag('VODBg').x = 182
    this.tag('VODBg').w = 1740
  }

  /**
   * While not on focus
   */
  _unfocus() {
    this.tag('VODCategoryBg').x = 400
    this.tag('VODCategoryBg').w = 1520
    this.tag('VODBg').x = 400
    this.tag('VODBg').w = 1520
  }

  /**
   * Function to rest the row
   */
  _reset() {
    this.tag('GalleryRowList').start()
    this.current = this.tag('GalleryRowList').element
  }

  $setSeeAllState(){
    this._setState('SeeAllState')
  }

  /**
   * Resets the gallery view  on reentering VOD screen
   */
  resetGalleryRow() {
    for (let j in this.tag('GalleryRowList').items) {
      if (j == 0) {
        this.tag('GalleryRowList').items[j].patch({ x: 207 })
        this.tag('GalleryRowList').items[j].patch({ y: 3 })
      } else if (j > 0) {
        this.tag('GalleryRowList').items[j].patch({ x: 5 })
      }
    }
    this.tag('VODCategory')._reset()
    this.tag('GalleryRowList').setIndex(0)
    this.fireAncestors('$setRows', this.tag('VODCategory').setRows())
  }

  /**
   * @static
   * @returns
   * @memberof VODScreen
   * VODScreen States
   */
  static _states() {
    return [
      class VODCategoryState extends this {
        $enter() {}

        _getFocused() {
          return this.tag('VODCategory')
        }

        /**
         * On pressing the down key , sets state to SeeAllState
         */
        _handleDown() {
          this._setState('SeeAllState')   
        }
      },
      class SeeAllState extends this {
        $enter() {
          /**
           * On entering this state , the border is made visible
           */
          this.tag('SeeAllBorder').patch({ visible: true })
        }

        _handleUp() {
          /**
           * On pressing the up arrow , sets state to VODCategoryState
           */
          this._setState('VODCategoryState')
        }

        _handleRight() {
          /**
           * On pressing the right arrow sets state to galleryViewState
           */
          this._setState('GalleryViewState')
        }

        _handleLeft() {
          /**
           * On pressing the left arrow sets state to SideNavState
           */
          this.fireAncestors('$setSideNav')
          this.tag('SeeAllBorder').patch({ visible: false })
        }

        $exit() {
          /**
           * On exiting the state the border is hidden
           */
          this.tag('SeeAllBorder').patch({ visible: false })
        }
      },
      class GalleryViewState extends this {
        _getFocused() {
          if (this.prevIndex != -1) {
            this.tag('GalleryRowList').items[this.prevIndex].patch({ x: 5 })
          }
          this.prevIndex = this.tag('GalleryRowList').index
          this.nextIndex = this.prevIndex + 1
          if (this.nextIndex != 0 && this.nextIndex != this.tag('GalleryRowList').length) {
            this.tag('GalleryRowList').items[this.nextIndex].patch({ y: 100 })
          }
          this.current = this.tag('GalleryRowList').element
          this.current.patch({ y: 3 })
          this.current.patch({ x: 207 })
          return this.current
        }

        _handleDown() {
          //To reset the focus when traversing through the rows
          this.tag('GalleryRowList')
            .element.tag('TileList')
            ._reset()
          if (this.tag('GalleryRowList').length - 1 != this.tag('GalleryRowList').index) {
            this.tag('GalleryRowList').setNext()
          }
          //Make the down arrow invisible when we scroll to last row
          if (this.tag('GalleryRowList').length - 1 == this.tag('GalleryRowList').index) {
            this.tag('Down').visible = false
          }
        }

        _handleEnter() {
          /**
           * On pressing enter on a tile , the player is started
           */
          let currentTile = this.current.tag('TileList').element
          this.videoPlayedFlag = true
          this.fireAncestors('$setPlayer', currentTile.videoData)
        }

        _handleUp() {
          //To reset the focus when traversing through the rows
          this.tag('GalleryRowList')
            .element.tag('TileList')
            ._reset()
          if (0 != this.tag('GalleryRowList').index) {
            this.tag('GalleryRowList').setPrevious()
          } else {
            this._setState('VODCategoryState')
          }
          //Make the down arrow visible on all other cases other than at the last row
          if (this.tag('GalleryRowList').length - 1 != this.tag('GalleryRowList').index) {
            this.tag('Down').visible = true
          }
        }

        _handleLeft() {
          this._setState('SeeAllState')
        }

        $exit() {
          this.tag('Description').patch({ visible: false })
        }
      }
    ]
  }
}
