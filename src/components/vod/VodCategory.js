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
import { Lightning } from 'wpe-lightning-sdk'
import { VODCategoryItem } from './VodCategoryItem'
import { Colors } from '../../constants/ColorConstants'
import { StringConstants } from '../../constants/StringConstants'
/**
 * @export
 * @class VODCategory
 * @extends Lightning.Component
 * Renders the VOD category
 */
export class VODCategory extends Lightning.Component {
  
  /**
   * @static
   * @return
   * @memberof VODCategory
   * Renders the template
   */
  static _template() {
    return {
      VODText: {
        x: 52,
        y: 59,
        w: 237,
        h: 37,
        text: {
          text: 'Video on Demand',
          fontFace: 'Regular',
          textColor: Colors.MIXED_GREY,
          fontSize: 30
        }
      },
      VODCategoryList: {
        type: Lightning.components.ListComponent,
        x: 50,
        y: 150,
        w: 1920,
        h: 74,
        itemSize: 228,
        horizontal: true,
        roll: true,
        rollMin: 0,
        rollMax: 400,
        spacing: 64,
        invertDirection: false,
        viewportSize: 1200
      }
    }
  }

  _init() {
    /**
     * Add items to the VODCategoryList element as an array
     */
    this.tag('VODCategoryList').items = [
      {
        menuName: StringConstants.FOR_YOU
      },
      {
        menuName: StringConstants.MOVIES
      },
      {
        menuName: StringConstants.TV_SHOWS
      },
      {
        menuName: StringConstants.SPORTS
      },
      {
        menuName: StringConstants.KIDS
      },
      {
        menuName: StringConstants.MUSIC
      },
      {
        menuName: StringConstants.NEWS
      }
    ].map((data, index) => {
      return {
        ref: 'VODCategoryItem_' + index,
        type: VODCategoryItem,
        items: data
      }
    })
  }

  /**
   * On pressing right arrow , sets to next element
   */
  _handleRight() {
    
    if (this.tag('VODCategoryList').length - 1 != this.tag('VODCategoryList').index) {
      this.tag('VODCategoryList').setNext()
    }
  }

  /**
   * On pressing left arrow
   * If the index is greater than zero sets to previous element
   * or show the side navigation bar
   */
  _handleLeft() {    
    if (0 != this.tag('VODCategoryList').index) {
      this.tag('VODCategoryList').setPrevious()
    } else {
      this.fireAncestors('$setSideNav')
    }
  }

  _getFocused() {
    return this.tag('VODCategoryList').element
  }

  _unfocus() {
    this.tag('VODCategoryList').element._highlight()
  }

  _handleEnter() {
    this.fireAncestors('$setRows', this.tag('VODCategoryList').element._menuName)
  }
}
