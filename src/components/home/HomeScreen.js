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
import { ImageConstants } from '../../constants/ImageConstants'
import { GalleryView } from './galleryView/GalleryView'
import { DataService } from '../../service/DataService'
import { SideNavBar } from './sideNavBar/SideNavBar'
import { VODScreen } from '../vod/VodScreen'
import { InfoBar } from '../infoBar/InfoBar'
import { SettingsScreen } from '../settings/SettingsScreen'

/**
 *
 * @export
 * @class HomeScreen
 * @extends Lightning.Component
 * RDK-M UI Home Screen.Renders HomeScreen
 */
export class HomeScreen extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof HomeScreen
   * Renders template
   */
  static _template() {
    return {
      TextureBg: {
        src: Utils.asset(ImageConstants.TEXTURE)
      },
      InfoBar: { type: InfoBar },
      Gallery: { type: GalleryView },
      SideNavBar: { type: SideNavBar },
      Guide: {
        x: 900,
        y: 500,
        text: { text: 'To be Implemented ' },
        visible: false
      },
      Vod: {
        type: VODScreen,
        visible: false
      },
      Apps: {
        x: 900,
        y: 500,
        text: { text: 'To be Implemented ' },
        visible: false
      },
      Settings: {
        type: SettingsScreen,
        visible: false
      }
    }
  }

  _init() {
    /**
     * DataService is called to add data in JSON files
     */
    this.dataObj = new DataService()
    this.dataObj.getAppData().then(data => {
      this.tag('Gallery').data = data[0]
    })
    this.dataObj.getVodData().then(data => {
      this.tag('Vod').data = data[0]
    })
    this._setState('GalleryState')
  }

  set view(currentview) {
    this.tag('Gallery').visible = false
    this.tag('Guide').visible = false
    this.tag('Vod').visible = false
    this.tag('Settings').visible = false
    this.tag('Apps').visible = false
    currentview.visible = true
  }
  /**
   * * @param {*} menu
   * To switch between different screens
   */
  $setView(menu) {
    switch (menu) {
      case 'HOME':
        this.tag('Gallery')._reset()
        this._setState('GalleryState')
        break
      case 'TV GUIDE':
        this._setState('Guide')
        break
      case 'VOD':
        this._setState('Vod')
        break
      case 'APPS':
        this._setState('Apps')
        break
      case 'SETTINGS':
        this._setState('Settings')
        break
    }
  }

  /**
   * To goto side navigation bar
   */
  $setSideNav() {
    this._setState('SideNavState')
  }

  /**
   * To change the row element according to different menus
   * @param {*} menu
   */
  $setRows(menu) {
    //TO DO - Now we use the same data, integrate APIs later
    switch (menu) {
      case 'FOR YOU':
        this.dataObj.getVodData().then(data => {
          this.tag('Vod').data = data[0]
        })
        break
      case 'MOVIES':
        this.dataObj.getVodMoviesData().then(data => {
          this.tag('Vod').data = data[0]
        })
        break
      case 'TV SHOWS':
        this.dataObj.getVodShowsData().then(data => {
          this.tag('Vod').data = data[0]
        })
        break
      case 'SPORTS':
        this.dataObj.getVodShowsData().then(data => {
          this.tag('Vod').data = data[0]
        })
        break
      case 'KIDS':
        this.dataObj.getVodShowsData().then(data => {
          this.tag('Vod').data = data[0]
        })
        break
      case 'MUSIC':
        this.dataObj.getVodShowsData().then(data => {
          this.tag('Vod').data = data[0]
        })
        break
      case 'NEWS':
        this.dataObj.getVodShowsData().then(data => {
          this.tag('Vod').data = data[0]
        })
        break
    }
  }

  /**
   * @static
   * @returns
   * @memberof HomeScreen
   * HomeScreen states
   */
  static _states() {
    return [
      class GalleryState extends this {
        $enter() {
          this.view = this.tag('Gallery')
          this.tag('SideNavBar')._highlight()
        }
        _getFocused() {
          return this.tag('Gallery')
        }
        _handleLeft() {
          this._setState('SideNavState')
        }
        $exit() {}
      },
      class SideNavState extends this {
        $enter() {
          this.tag('SideNavBar')._highlight()
          this.tag('SideNavBar')._setState('FocussedState')
        }
        _getFocused() {
          return this.tag('SideNavBar')
        }
        $exit() {
          this.tag('SideNavBar')._setState('UnFocussedState')
        }
      },
      class Guide extends this {
        $enter() {
          this.view = this.tag('Guide')
          this.tag('SideNavBar')._highlight()
        }
        /* TO DO */
        _handleLeft() {
          this._setState('SideNavState')
        }
        $exit() {
          this.tag('SideNavBar')._setState('UnFocussedState')
        }
      },
      class Vod extends this {
        $enter() {
          this.view = this.tag('Vod')
          this.tag('Vod').resetGalleryRow()
          this.tag('SideNavBar')._highlight()
        }

        _getFocused() {
          return this.tag('Vod')
        }
        _handleLeft() {
          this._setState('SideNavState')
        }
        $exit() {
          this.tag('SideNavBar')._setState('UnFocussedState')
        }
      },
      class Apps extends this {
        $enter() {
          this.view = this.tag('Apps')
          this.tag('SideNavBar')._highlight()
        }
        /* TO DO */
        _handleLeft() {
          this._setState('SideNavState')
        }
        $exit() {
          this.current = this.tag('Apps')
          this.tag('SideNavBar')._setState('UnFocussedState')
        }
      },
      class Settings extends this {
        $enter() {
          this.view = this.tag('Settings')
          this.tag('SideNavBar')._highlight()
        }

        _getFocused() {
          return this.tag('Settings')
        }

        _handleLeft() {
          this._setState('SideNavState')
        }

        $exit() {
          this.tag('SideNavBar')._setState('UnFocussedState')
        }
      }
    ]
  }
}
