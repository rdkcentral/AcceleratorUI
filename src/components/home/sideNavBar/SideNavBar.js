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
import { SideNavBarItem } from './SideNavBarItem'
import { ImageConstants } from '../../../constants/ImageConstants'
import { Colors } from '../../../constants/ColorConstants'
import { StringConstants } from '../../../constants/StringConstants'
/**
 * @export
 * @class SideNavBar
 * @extends {Lightning.Component}
 * Renders SideNavBar Component
 */
export class SideNavBar extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof SideNavBar
   * Renders the template
   */
  static _template() {
    return {
      SideNavBg: {
        w: 180,
        h: 1080,
        rect: true,
        color: Colors.TRANSPARENT_BLACK,
        clipping: true,
        VoiceButtonBg: {
          w: 54,
          h: 54,
          x: 75,
          y: 53,
          VoiceButton: {
            x: 11.65,
            y: 5,
            w: 31.29,
            h: 44,
            src: Utils.asset(ImageConstants.VOICE_ICON)
          }
        },
        MenuList: {
          y: 296,
          itemSize: 100,
          w: 400,
          h: 500,
          type: Lightning.components.ListComponent,
          roll: true,
          rollMax: 0,
          rollMin: 0,
          horizontal: false,
          invertDirection: true
        }
      }
    }
  }
  _init() {
    this.tag('MenuList').items = [
      {
        /**
         * Setting Icons for HOME,TV GUIDE,VOD,APPS,SETTINGS
         */
        menuName: StringConstants.HOME,
        iconNormal: ImageConstants.HOME_ICON_NORMAL,
        iconSelected: ImageConstants.HOME_ICON_SELECTED,
        iconSelection: ImageConstants.HOME_ICON_SELECTION
      },
      {
        menuName: StringConstants.TV_GUIDE,
        iconNormal: ImageConstants.TV_GUIDE_ICON_NORMAL,
        iconSelected: ImageConstants.TV_GUIDE_ICON_SELECTED,
        iconSelection: ImageConstants.TV_GUIDE_ICON_SELECTION
      },
      {
        menuName: StringConstants.VOD,
        iconNormal: ImageConstants.VOD_ICON_NORMAL,
        iconSelected: ImageConstants.VOD_ICON_SELECTED,
        iconSelection: ImageConstants.VOD_ICON_SELECTION
      },
      {
        menuName: StringConstants.APPS,
        iconNormal: ImageConstants.APPS_ICON_NORMAL,
        iconSelected: ImageConstants.APPS_ICON_SELECTED,
        iconSelection: ImageConstants.APPS_ICON_SELECTION
      },
      {
        menuName: StringConstants.SETTINGS,
        iconNormal: ImageConstants.SETTINGS_ICON_NORMAL,
        iconSelected: ImageConstants.SETTINGS_ICON_SELECTED,
        iconSelection: ImageConstants.SETTINGS_ICON_SELECTION
      }
    ].map((data, index) => {
      return {
        ref: 'SideNavBarItem_' + index,
        type: SideNavBarItem,
        items: data
      }
    })
    this._setState('UnFocussedState')
  }
  /**
   * Sidenavbar Items under Highlight
   * Set selected icon and background
   */
  _highlight() {
    this.tag('MenuList')
      .element.tag('Icon')
      .patch({
        src: Utils.asset(this.tag('MenuList').element._iconSelected)
      })
    this.tag('MenuList')
      .element.tag('HighLight')
      .patch({
        src: Utils.asset(ImageConstants.COLLAPSED_BACKGROUND),
        visible: true,
        alpha: 1
      })
  }
  /**
   * Setting reduced width and background clipping for shrinked state
   */
  _shrinkedState() {
    this._highlight()
    this.tag('SideNavBg').w = 180
    this.tag('SideNavBg').clipping = true
  }
  /**
   * Setting expanded width ,removing clipping ,highlight on item for expanded state of sidenavbar
   */
  _expandedState() {
    this.tag('SideNavBg').w = 400
    this.tag('SideNavBg').clipping = false
    this.tag('MenuList')
      .element.tag('HighLight')
      .patch({
        src: Utils.asset(ImageConstants.SIDEBAR_SELECTION_GRADIENT)
      })
  }
  /**
   * @static
   * @returns
   * @memberof sidenavbar
   * Set Sidenavbar States
   */
  static _states() {
    return [
      class VoiceState extends this {
        $enter() {
          /** TO DO **/
        }
      },
      class FocussedState extends this {
        $enter() {
          /**
           * Sets expanded state of sidenavbar on pressing enter key
           */
          this._expandedState()
        }
        $exit() {}
        /**
         * Directs to corresponding page on pressing enter on sidenavbar item
         */
        _handleEnter() {
          this.fireAncestors('$setView', this.tag('MenuList').element._menuName)
        }
        /**
         * Navigate to next sidenavbar item on pressing down arrow key
         */
        _handleDown() {
          if (this.tag('MenuList').length - 1 != this.tag('MenuList').index) {
            this.tag('MenuList').setNext()
          }
        }
        /**
         * navigate to previous sidenavbar item on pressing up arrow key
         */
        _handleUp() {
          if (0 != this.tag('MenuList').index) {
            this.tag('MenuList').setPrevious()
          }
        }
        _getFocused() {
          return this.tag('MenuList').element
        }
      },
      class UnFocussedState extends this {
        $enter() {
          this._shrinkedState()
        }
        $exit() {}
      }
    ]
  }
}
