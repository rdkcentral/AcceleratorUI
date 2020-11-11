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
/* eslint-disable no-undef */
import { Lightning, Log } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'

/**
 * @export
 * @class ThunderAppService
 * @extends Lightning.Component
 * Thunder  App calls
 */
let browser = 'UX'
let browserVisibility = 'visiblity@UX'
export class ThunderAppService extends Lightning.Component {
  _construct() {
    Log.info('Thunder Service Constructor Called')
    this.config = {
      host: '127.0.0.1'
    }
    this.activeApp = ''
    try {
      this.thunderJS = ThunderJS(this.config)
    } catch (err) {
      Log.error(err)
    }
    //To verify if the application is loaded in UX or Webkitbrowser, in the assumption that if UX is loaded
    // there will be only 'UX' in the compositor client list. If Webkit is loaded, there will be 'UX' and 'WebKitBrowser'
    this.thunderJS.call('Compositor', 'clients', (err, result) => {
      if (err) {
        Log.warn('Error while getting clients ', JSON.stringify(err))
      } else {
        Log.info('\n Compositor Clients ', JSON.stringify(result))
        if (result.includes('UX')) {
          this.thunderJS.call('UX', 'state', (err, result) => {
            if (err) {
              Log.error(' Error fetching UX state')
            } else {
              Log.info('UX State is ', result)
              if (result.includes('resumed') || result.includes('activated')) {
                browser = 'UX'
                browserVisibility = 'visiblity@UX'
              }
            }
          })
        } else if (result.includes('WebKitBrowser')) {
          this.thunderJS.call('WebKitBrowser', 'state', (err, result) => {
            if (err) {
              Log.error(' Error fetching WebKitBrowser state')
            } else {
              Log.info('WebKitBrowser State is ', result)
              if (result.includes('resumed') || result.includes('activated')) {
                browser = 'WebKitBrowser'
                browserVisibility = 'visiblity@WebKitBrowser'
              }
            }
          })
        }
      }
    })
    this.tempClient = ''
    this.appData = ''
    this.netflixActivated = false
    this.amazonActivated = false
    this._activate('Compositor')
    this._activate('Apps')
    this._deactivate('Monitor')
    this.thunderJS.call('Apps', 'state', 'suspended', () => {
      Log.info('App Suspended')
    })
    this.thunderJS.call('Netflix', 'state', 'suspended', () => {
      Log.info('Netflix Suspended')
    })
    this.thunderJS.call('Amazon', 'state', 'suspended', () => {
      Log.info('Amazon Suspended')
    })
    this.thunderJS
      .call('Compositor', 'putbelow', { client: 'Apps', relative: browser })
      .catch(msg => {
        Log.info(msg)
      })
    this.thunderJS.call('Compositor', 'select', { client: browser }).catch(msg => {
      Log.info(msg)
    })

    //** TO_DO-Optimization */
    this.thunderJS.on('Controller', 'all', data => {
      let _data = data.data ? data.data : {}
      console.log('Controller event >>>:', JSON.stringify(data))
      if (data.callsign == 'Apps') {
        Log.info(_data.url)
        if (_data.url !== undefined && _data.url.includes('boot')) {
          Log.info('< App Exit >')
          this.exitAllApps()
        }
      } else if (data.callsign == 'Netflix') {
        Log.info('Netflix Exit >>>>>' + JSON.stringify(data))
        if (_data.suspended == true || _data.state == 'deactivated') {
          Log.info('Netflix plugin >>>>>>>>>>>>>>>>>>')
          this.closePlugin()
        }
        if (_data.state == 'activated') {
          Log.info('Netflix activated!!!!!!!#####', this.netflixActivated)
          this.netflixActivated = true
          setTimeout(() => {
            Log.info('Timeout 6 sec')
            this.thunderJS.call('Compositor', 'clients', (err, result) => {
              if (err) {
                Log.warn('Error while getting clients ')
              } else {
                Log.info('\n Compositor Clients ', JSON.stringify(result))
                this.tempClient = result.find(item => item.includes('essos-app'))
                Log.info('\n Netflix Compositor item - Activate >>> ', this.tempClient)

                Log.info(' Select Netflix focus' + this.tempClient)
                this.thunderJS
                  .call('Compositor', 'select', { client: this.tempClient })
                  .catch(msg => {
                    Log.info(' Select Netflix' + msg)
                    Log.info('Successfully set focus Netflix')
                  })
                this.thunderJS.call('Netflix', 'putontop', { client: browser }, () => {
                  Log.info('Netflix putontop')
                })
                this.thunderJS.call('Compositor', browserVisibility, 'hidden').catch(msg => {
                  Log.info(msg)
                })
                this.thunderJS
                  .call('Compositor', 'visiblity@' + this.tempClient, 'visible')
                  .catch(msg => {
                    Log.info(msg)
                  })
              }
            })
          }, 6000)
        }
      } else if (data.callsign == 'Amazon') {
        Log.info('Amazon Exit >>>>>' + JSON.stringify(data))
        if (_data.suspended == true || _data.state == 'deactivated') {
          Log.info('Amazon close plugin >>>>>>')
          this.closePlugin()
        }

        if (_data.state == 'activated') {
          setTimeout(() => {
            this.thunderJS.call('Compositor', 'clients', (err, result) => {
              if (err) {
                Log.warn('Error while getting clients ')
              } else {
                Log.info('\n Compositor Clients ', JSON.stringify(result))
                this.tempClient = result.find(item => item.includes('essos-app'))
                Log.info('\n Amazon Compositor item - Activate >>> ', this.tempClient)

                Log.info(' Select Amazon focus' + this.tempClient)
                this.thunderJS
                  .call('Compositor', 'select', { client: this.tempClient })
                  .catch(msg => {
                    Log.info(' Select Amazon' + msg)
                    Log.info('Successfully set focus Amazon')
                  })
                this.thunderJS.call('Amazon', 'putontop', { client: browser }, () => {
                  Log.info('Amazon putontop')
                })
                this.thunderJS.call('Compositor', browserVisibility, 'hidden').catch(msg => {
                  Log.info(msg)
                })
                this.thunderJS
                  .call('Compositor', 'visiblity@' + this.tempClient, 'visible')
                  .catch(msg => {
                    Log.info(msg)
                  })
              }
            })
          }, 6000)
        }
      } else if (data.callsign == 'Cobalt') {
        Log.info('Cobalt Event !!! ')
        if (_data.state == 'activated') {
          this.launchYoutube()
        }
        if (_data.suspended == true || _data.state == 'deactivated') {
          Log.info('Close Cobalt plugin success')
          this.closePlugin()
        }
      }
    })
  }

  //Init method
  _init() {
    Log.info('Thunder Service init')
  }

  // Method to activate a plugin
  _activate(callSign) {
    this.thunderJS.Controller.activate({ callsign: callSign }, (err, result) => {
      if (err) {
        Log.error('Failed to activate ' + callSign)
      } else {
        Log.info('Successfully activated ' + callSign)
      }
    })
  }

  // Method to deactivate plugin
  _deactivate(callSign) {
    this.thunderJS.Controller.deactivate({ callsign: callSign }, (err, result) => {
      if (err) {
        Log.error('Failed to activate ' + callSign)
      } else {
        Log.info('Successfully activated ' + callSign)
      }
    })
  }

  // To launch Metro App
  launchMetroApp(app) {
    Log.info('\n PREM APPS !!!!!!!!!!!!!')
    this.thunderJS.call('Apps', 'state', 'resumed')
    this.thunderJS.call('Apps', 'url', app, () => {
      Log.info('\n Url for App set ')
      this.thunderJS.call('Apps', 'putontop', { client: browser }, () => {
        Log.info(browser + ' putontop')
      })
      this.thunderJS.call('Compositor', browserVisibility, 'hidden').catch(msg => {
        Log.info(msg)
      })
      this.thunderJS.call('Compositor', 'visiblity@Apps', 'visible').catch(msg => {
        Log.info(msg)
      })
      this.thunderJS.call('Compositor', 'select', { client: 'Apps' }).catch(msg => {
        Log.info(msg)
      })
    })
  }

  // To launch Premium App
  launchPremiumApp(data) {
    this.exit = false
    let thunder = this
    window.cobaltFlag = null
    this.appData = data
    if (data.title == 'Netflix') {
      Log.info('Launch Netflix !!!!')
      this.activeApp = 'Netflix'
      if (!this.netflixActivated) {
        this.thunderJS.Controller.activate({ callsign: 'Netflix' }, (err, result) => {
          Log.info('Netflix Activate Result - ', result)
          if (err) {
            Log.error('Failed to activate Netflix')
          } else {
            Log.info('Successfully activated Netflix')
          }
        })
      } else {
        thunder.thunderJS.call('Netflix', 'state', 'resumed', (err, result) => {
          if (err) {
            Log.error('Error in netflix resume ')
          } else {
            Log.info('\n Netflix Resumed Successfully' + result)

            setTimeout(() => {
              this.thunderJS.call('Compositor', 'clients', (err, result) => {
                if (err) {
                  Log.error('Error while getting clients ')
                } else {
                  Log.info('\n Compositor Clients ', JSON.stringify(result))
                  this.tempClient = result.find(item => item.includes('essos-app'))
                  Log.info('\n Netflix Compositor item - Resume >>> ', this.tempClient)
                  this.thunderJS.call('Compositor', browserVisibility, 'hidden').catch(msg => {
                    Log.info(msg)
                  })
                  this.thunderJS
                    .call('Compositor', 'select', { client: this.tempClient })
                    .catch(msg => {
                      Log.info(' Select Netflix' + msg)
                      Log.info('Successfully set focus Netflix')
                    })
                }
              })
            }, 5000)
          }
        })
      }
    }
    if (data.title == 'Amazon') {
      this.activeApp = 'Amazon'
      Log.info('Launch Amazon !!!!')
      this.thunderJS.Controller.activate({ callsign: 'Amazon' }, (err, result) => {
        if (err) {
          Log.error('Failed to activate Amazon')
        } else {
          Log.info('Successfully activated Amazon', result)
        }
      })
    }
    if (data.title == 'Youtube') {
      Log.info('Inside Youtube')
      this.activeApp = 'Cobalt'
      let response = ''
      var request = new XMLHttpRequest()
      request.open('GET', 'http://' + this.config.host + '/Service/Controller/Plugin/Cobalt', false) //makes synchronous request
      request.send(null)
      if (request.status === 200) {
        console.log(request.responseText)
        response = request.responseText
      }
      if (
        response.includes('"state":"deactivation"') ||
        response.includes('"state":"deactivated"')
      ) {
        Log.info('Cobalt State is deactivated, going to activate ')
        this.thunderJS.Controller.activate({ callsign: 'Cobalt' }, (err, result) => {})
      } else {
        Log.info('Cobalt State is activated, going to continue with resume ')
        this.launchYoutube()
      }
    }
  }

  closePlugin() {
    let thunder = this
    if (this.activeApp == 'Netflix') {
      Log.info('deactivate Netflix')
      this.thunderJS.Controller.deactivate({ callSign: 'Netflix' })
      thunder.activeApp = ''
    } else if (this.activeApp == 'Amazon') {
      Log.info('deactivate Amazon !!!!')
      this.thunderJS.Controller.deactivate({ callSign: 'Amazon' })
      thunder.activeApp = ''
    }

    this.thunderJS.call('Compositor', browserVisibility, 'visible').catch(msg => {
      Log.info(msg)
    })

    this.thunderJS.call('Compositor', 'select', { client: browser }, (err, result) => {
      if (err) {
        Log.error(' Failed to select ' + browser)
      } else {
        Log.info(browser + ' Selected')
        thunder.parent._setState('HomeScreen')
      }
    })
  }

  exitAllApps() {
    let thunder = this
    Log.info('\n Exit called ')

    this.thunderJS.call('Apps', 'state', 'suspended', () => {
      Log.info('App suspended')
      this.thunderJS.call('Compositor', 'visiblity@Apps', 'hidden').catch(msg => {
        Log.info(msg)
      })
      this.thunderJS.call('Compositor', browserVisibility, 'visible').catch(msg => {
        Log.info(msg)
      })

      this.thunderJS
        .call('Compositor', 'putbelow', { client: 'Apps', relative: browser })
        .catch(msg => {
          Log.info(msg)
        })
      this.thunderJS.call('Compositor', 'select', { client: browser }, () => {
        Log.info(browser + ' Selected')
        thunder.parent._setState('HomeScreen')
      })
    })
  }

  launchYoutube() {
    this.thunderJS.call('Cobalt', 'state', 'resumed', (err, result) => {
      if (err) {
        Log.warn('Cobalt Error Resumed')
      } else {
        Log.info('cobalt resumed !!!!!!!!!!')
        setTimeout(() => {
          this.thunderJS.call('Compositor', browserVisibility, 'hidden').catch(msg => {
            Log.info(browser + ' hidden')
          })
          this.thunderJS.call('Cobalt', 'visiblity', 'visible').catch(msg => {
            Log.info('Cobalt visible')
          })

          this.thunderJS.call('Cobalt', 'putontop', { client: browser }, () => {
            Log.info('Cobalt putontop - ' + browser)
          })
          this.thunderJS.call('Compositor', 'select', { client: 'Cobalt' }).catch(msg => {
            Log.info(' Select Cobalt ' + msg)
            Log.info('Successfully set focus Cobalt')
          })
        }, 5000)
      }
    })
  }
}
