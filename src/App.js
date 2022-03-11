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
import { Lightning, Utils, Log, Storage } from '@lightningjs/sdk'
import { HomeScreen } from './components/home/HomeScreen'
import { Player } from './components/player/Player'
import { ThunderAppService } from './components/thunder/ThunderAppService'
import { DataService } from './service/DataService'
import { VolumeControl } from './components/volume/VolumeControl'
import { AppsConfiguration } from './utils/appconfig'
import XcastApi from './service/XcastApi'

export default class App extends Lightning.Component {
  /**
   * Fonts to be used in accelerator UI
   */
  static getFonts() {
    return [
      { family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') },
      { family: 'Medium', url: Utils.asset('fonts/Roboto-Medium.ttf') },
      { family: 'Bold', url: Utils.asset('fonts/Roboto-bold.ttf') }
    ]
  }

  /**
   * Language Support.
   * Define language specific string in locale/locale.json
   */
  static language() {
    return {
      file: Utils.asset('locale/locale.json'),
      language: Storage.get('selectedLanguage') || 'en'
    }
  }

  static _template() {
    return {
      LivePlayback: { type: Player },
      HomeScreen: { type: HomeScreen, visible: false },
      Apps: { type: ThunderAppService },
      VolumeControl: { type: VolumeControl, visible: false, zIndex: 1 }
    }
  }

  _construct() {
    const xhr = new XMLHttpRequest()
    xhr.open(
      'GET',
      window.serverdata.SERVER_URL + 'ThemeConfig?operator_id=' + window.serverdata.OPERATOR_ID
    )
    xhr.responseType = 'json'
    xhr.onload = () => {
      window.themejson = xhr.response
      this.tag('HomeScreen').theme = window.themejson
    }
    xhr.send()
    Log.info('App Constructor Called')
  }

  _init() {
    new AppsConfiguration().loadData().then(() => {
      this.dataObj = new DataService()
      this.dataObj.getAppData().then(data => {
        this.tag('HomeScreen').items = data
      })
    })
    this.dataObj = new DataService()
    Log.info('Start up ', 'App Started !!')
    this.dataObj.getChannelData().then(data => {
      this.channelIndex = 1
      this.channelData = data[0].data.assets
      Log.info('\n Channel data is ----' + this.channelData)
      this.channelDataLength = this.channelData.length
      this.tag('LivePlayback').load({
        ...this.channelData[this.channelIndex],
        loop: true
      })
    })
    this._setState('LivePlayback')
  }

  _active() {
    //xcast_new
    this.xcastApi = new XcastApi()
    this.xcastApi.activate().then(result => {
      if (result) {
        this.registerXcastListeners()
      }
    })
  }

  /**
   * Function to load Previous video
   */
  $lastVideo() {
    this.tag('LivePlayback').$stop()
    this.tag('LivePlayback').reset()
    this.channelIndex = this.channelIndex - 1
    Log.info('channel index' + this.channelIndex)
    if (this.channelIndex == -1) {
      this.channelIndex = this.channelDataLength - 1
    }
    this.tag('LivePlayback').load({
      ...this.channelData[this.channelIndex],
      loop: true
    })
  }

  /**
   * Function to load next video
   */
  $nextVideo() {
    this.tag('LivePlayback').$stop()
    this.tag('LivePlayback').reset()
    this.channelIndex = this.channelIndex + 1
    if (this.channelIndex == this.channelDataLength) {
      this.channelIndex = 0
    }
    Log.info('channel index' + this.channelIndex)
    this.tag('LivePlayback').load({
      ...this.channelData[this.channelIndex],
      loop: true
    })
  }

  /*  * Fire ancestor method
   * Used to load different channel data on changing channels
   * Upon executed stops the current video , resets the playercontrol UI and channelData is loaded
   */
  $setPlayer(channelData) {
    Log.info('Channel Data ' + JSON.stringify(channelData))
    this.tag('LivePlayback').$stop()
    this.tag('LivePlayback').reset()
    this.tag('LivePlayback').load({
      ...channelData,
      loop: true
    })
    this._setState('LivePlayback')
  }

  $setHomeScreenState() {
    this._setState('HomeScreen')
  }

  $setMetroApp(appurl) {
    Log.info('\n In set app ' + appurl)
    this.tag('Apps').launchMetroApp(appurl)
    this._setState('AppsState')
  }

  $setPremiumApp(data) {
    Log.info('In set Premium app -------' + data.title + '-----' + data.url)
    this.tag('Apps').launchPremiumApp(data)
    this._setState('AppsState')
  }

  $setExit() {
    Log.info('Exit of Metroapps -------')
    this.tag('Apps').deactivateMetroPlugin()
  }

  $setAppExit() {
    Log.info('Exit of OTTapps -------')
    this.tag('Apps').closePlugin()
  }

  xcastApps(app) {
    if (Object.keys(XcastApi.supportedApps()).includes(app)) {
      return XcastApi.supportedApps()[app]
    } else return false
  }

  /**
   * Function to register event listeners for Xcast plugin.
   */

  registerXcastListeners() {
    //onApplicationLaunchRequest
    this.xcastApi.registerEvent('onApplicationLaunchRequest', notification => {
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName)
        if (applicationName == 'Amazon') {
          if (this.tag('Apps').getActiveApp() != 'Amazon' || !this.xcastApi.getAppState('Amazon')) {
            this.$setAppExit()
            this.$setExit()
            let appurl = notification.parameters.pluginUrl
            let appData = { title: 'Amazon', url: appurl, type: 'dial' }
            this.$setPremiumApp(appData)
            Storage.set('applicationType', 'Amazon')
            this.tag('Apps').setVisibility('ResidentApp', false)
            let params = { applicationName: notification.applicationName, state: 'running' }
            this.xcastApi.onApplicationStateChanged(params)
          }
        } else if (applicationName == 'Netflix') {
          if (
            this.tag('Apps').getActiveApp() != 'Netflix' ||
            !this.xcastApi.getAppState('Netflix')
          ) {
            this.$setAppExit()
            this.$setExit()
            let appurl = notification.parameters.pluginUrl
            let appData = { title: 'Netflix', url: appurl, type: 'dial' }
            this.$setPremiumApp(appData)
            Storage.set('applicationType', 'Netflix')
            this.tag('Apps').setVisibility('ResidentApp', false)
          }
        } else if (applicationName == 'Cobalt') {
          if (
            this.tag('Apps').getActiveApp() != 'Cobalt' ||
            !this.xcastApi.getAppState(applicationName)
          ) {
            this.$setAppExit()
            this.tag('Apps').configureApplication(applicationName, notification.parameters)
            this.$setExit()
            let appData = { title: 'Youtube', type: 'dial' }
            this.$setPremiumApp(appData)
            Storage.set('applicationType', 'Cobalt')
            this.tag('Apps').setVisibility('ResidentApp', false)
          }
        }
      }
    })
    //onApplicationHideRequest
    this.xcastApi.registerEvent('onApplicationHideRequest', notification => {
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName)
        if (Storage.get('applicationType') === applicationName) {
          this.$setAppExit()
          let params = { applicationName: notification.applicationName, state: 'suspended' }
          this.xcastApi.onApplicationStateChanged(params)
          this.tag('Apps').exitPlugin()
        }
      }
    })
    //onApplicationResumeRequest
    this.xcastApi.registerEvent('onApplicationResumeRequest', notification => {
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName)
        if (Storage.get('applicationType') != applicationName) {
          this.$setAppExit()
          let appData = { title: applicationName, type: 'dial' }
          this.$setPremiumApp(appData)
          Storage.set('applicationType', applicationName)
          this.tag('Apps').setVisibility('ResidentApp', false)
          let params = { applicationName: notification.applicationName, state: 'running' }
          this.xcastApi.onApplicationStateChanged(params)
        }
      }
    })
    //onApplicationStopRequest
    this.xcastApi.registerEvent('onApplicationStopRequest', notification => {
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName)
        if (Storage.get('applicationType') === applicationName) {
          this.xcastApi._deactivateApp(applicationName)
          this.tag('Apps').exitPlugin()
          let params = { applicationName: notification.applicationName, state: 'stopped' }
          this.xcastApi.onApplicationStateChanged(params)
        }
      }
    })

    //onApplicationStateRequest
    this.xcastApi.registerEvent('onApplicationStateRequest', notification => {
      if (this.xcastApps(notification.applicationName)) {
        let applicationName = this.xcastApps(notification.applicationName)
        this.xcastApi
          .getAppState(applicationName)
          .then(response => {
            let params = { applicationName: notification.applicationName, state: '' }
            if (response == 'resumed') {
              params = { applicationName: notification.applicationName, state: 'running' }
            } else if (response == 'suspended') {
              params = { applicationName: notification.applicationName, state: 'suspended' }
            } else {
              params = { applicationName: notification.applicationName, state: 'stopped' }
            }
            this.xcastApi.onApplicationStateChanged(params)
          })
          .catch(err => {
            let params = { applicationName: notification.applicationName, state: 'stopped' }
            this.xcastApi.onApplicationStateChanged(params)
          })
      }
    })
  }

  _handleBack() {
    // Empty handle back to remove exit of Application
  }

  loadPlayer() {
    Log.info('\n In Load Player ----------')
    this.tag('LivePlayback').visible = true
    this.tag('LivePlayback').load({
      ...this.channelData[this.channelIndex],
      loop: true
    })
  }

  _handleKey(event) {
    Log.info(event.code, 'for key name')
    Log.info(event.keyCode, 'for key code')

    if (event.keyCode == 48) {
      Log.info('YouTube pressed', event.keyCode)
      let appData = { url: 'https://www.youtube.com/tv', title: 'Youtube' }
      this.$setPremiumApp(appData)
    } else if (event.keyCode == 50) {
      Log.info('Netflix pressed', event.keyCode)
      let appData = { url: 'https://www.netflix.com/', title: 'Netflix' }
      this.$setPremiumApp(appData)
    }

    if (
      (event.keyCode === 77 || event.keyCode === 36 || event.keyCode === 114) &&
      window.metroAppEnabled
    ) {
      Log.info('Metro App is enabled')
      this.$setExit()
      window.metroAppEnabled = false
    } else if (
      (event.keyCode === 77 || event.keyCode === 36 || event.keyCode === 114) &&
      !window.metroAppEnabled
    ) {
      Log.info('Metro App is disabled')
      this._setState('HomeScreen')
    }
    if (
      (event.keyCode === 77 || event.keyCode === 36 || event.keyCode === 114) &&
      window.cobaltAppEnabled
    ) {
      Log.info('Cobalt App is enabled')
      this.$setAppExit()
      window.cobaltAppEnabled = false
    } else if (
      (event.keyCode === 77 || event.keyCode === 36 || event.keyCode === 114) &&
      !window.cobaltAppEnabled
    ) {
      Log.info('Cobalt App is disabled')
      this._setState('HomeScreen')
    }

    if (
      (event.keyCode === 77 || event.keyCode === 36 || event.keyCode === 114) &&
      window.netflixAppEnabled
    ) {
      Log.info('Netflix App is enabled')
      this.$setAppExit()
      window.netflixAppEnabled = false
    } else if (
      (event.keyCode === 77 || event.keyCode === 36 || event.keyCode === 114) &&
      !window.netflixAppEnabled
    ) {
      Log.info('Netflix App is disabled')
      this._setState('HomeScreen')
    }
    if (event.keyCode == 175) {
      if (this._getState() == 'AppsState') {
        this.tag('Apps').setViewResidentApp()
        this.tag('VolumeControl').increaseVolume()
        setTimeout(() => {
          this.tag('Apps').setBacktoAppState()
          this._setState('AppsState')
        }, 3000)
      } else {
        this.tag('VolumeControl').increaseVolume()
      }
    } else if (event.keyCode == 174) {
      if (this._getState() == 'AppsState') {
        this.tag('Apps').setViewResidentApp()
        this.tag('VolumeControl').decreaseVolume()
        setTimeout(() => {
          this.tag('Apps').setBacktoAppState()
          this._setState('AppsState')
        }, 3000)
      } else {
        this.tag('VolumeControl').decreaseVolume()
      }
    } else if (event.keyCode == 173) {
      if (this._getState() == 'AppsState') {
        this.tag('Apps').setViewResidentApp()
        this.tag('VolumeControl').muteVolume()
        setTimeout(() => {
          this.tag('Apps').setBacktoAppState()
          this._setState('AppsState')
        }, 3000)
      } else {
        this.tag('VolumeControl').muteVolume()
      }
    } else {
      this.tag('VolumeControl').hideVolumeControl()
      return false
    }
  }

  /**
   * Function to define the different states of the Accelerator App.
   */
  static _states() {
    return [
      class LivePlayback extends this {
        $enter() {
          this.tag('LivePlayback').visible = true
          this.tag('LivePlayback').tag('DownArrow').visible = true
        }
        _getFocused() {
          Log.info('Focus Live playback !!')
          return this.tag('LivePlayback')
        }
        _handleBack() {
          this._setState('HomeScreen')
        }
        _handleDown() {
          this.tag('LivePlayback').setPlayerControls()
        }
        _handleMenu() {
          this._setState('HomeScreen')
        }
        $exit() {
          this.tag('LivePlayback').hide()
        }
      },
      class HomeScreen extends this {
        $enter() {
          Log.info('HomeScreen State')
          this.visible = true
          this.tag('HomeScreen').visible = true
        }
        _getFocused() {
          return this.tag('HomeScreen')
        }
        _handleBack() {
          this._setState('LivePlayback')
        }
        _handleMenu() {
          this._setState('LivePlayback')
        }
        $exit() {
          this.tag('HomeScreen').visible = false
        }
      },
      class AppsState extends this {
        $enter() {
          Log.info('\n In App State ')
          this.tag('LivePlayback').$stop()
          this.visible = true
        }

        $exit() {
          this.tag('LivePlayback').load({
            ...this.channelData[this.channelIndex],
            loop: true
          })
          this.visible = true
        }
      }
    ]
  }
}
