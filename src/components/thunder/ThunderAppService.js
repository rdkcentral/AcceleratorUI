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
import { Lightning, Log } from '@lightningjs/sdk'
import ThunderJS from 'ThunderJS'

/**
 * @export
 * @class ThunderAppService
 * @extends Lightning.Component
 * Thunder  App calls
 */
export class ThunderAppService extends Lightning.Component {
  _construct() {
    Log.info('Thunder Service Constructor Called')
    this.config = {
      host: '127.0.0.1',
      port: '9998'
    }
    this.activeApp = ''
    try {
      this.thunderJS = ThunderJS(this.config)
    } catch (err) {
      Log.error('Error in initialising the Thunder JS', err)
    }

    //Activating these plugins from here to activate it in the startup itself
    //If called from wifi or diagnostic service, the delay in activation can affect app function
    this._activate('org.rdk.Wifi')
    this._activate('org.rdk.System')


    // Adding key intercept for 'Home Key' , as a work around for exit from metro apps
    this.thunderJS
      .call('org.rdk.RDKShell', 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: 36,
        modifiers: []
      })
      .then(result => {
        Log.info('Adding KeyIntercept success for Keycode 36', result)
      })
      .catch(err => {
        Log.error('Error in adding Key Intercept', err)
      })

    //Event listener for all the controller events
    this.thunderJS.on('Controller', 'all', data => {
      let _data = data.data ? data.data : {}
      Log.info('Controller event >>>:', JSON.stringify(data))
      if (data.callsign == 'Cobalt') {
        Log.info('Cobalt Event !!! ')
        //When cobalt is activated , then 'activated' event is obtained and then Cobalt plugin is resumed
        if (_data.state == 'activated') {
          this.launchYoutube()
        }
        // When the app is deactivated via Controller, 'deactivated' event is received
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

  /**
   * This method is to launch metro apps
   * @param {*} appURL 
   */
  launchMetroApp(appURL) {
    Log.info('Going to launch metro apps !!!!!!!!!!!!!')
    let appPlugin = 'LightningApp'
    this.thunderJS
      .call('org.rdk.RDKShell', 'launch', {
        callsign: appPlugin,
        type: appPlugin,
        uri: appURL,
      })
      .then(() => {
        Log.info('Launch successful for MetroApps')
        this.moveAppToFrontAndFocus(appPlugin)
      })
      .catch(err => {
        Log.info('Error in launching  ' + JSON.stringify(err))
      })
    this.setVisibility('ResidentApp', false)
    //Flag to be set on enabling metro App
    window.metroAppEnabled = true
  }

  /**
   * This method is for launching premium apps
   * @param {*} data 
   */
  launchPremiumApp(data) {
    /**Launching Youtube via Controller , because on launching youtube via RDK services we are getting resolution issues
     To be modified later*/
    if (data.title == 'Youtube') {
      Log.info('Inside Youtube')
      this.activeApp = 'Cobalt'
      let response = ''
      var request = new XMLHttpRequest()
      //This is to get the state of a plugin, if activated already then proceed to resume. If not then activate
      request.open('GET', 'http://' + this.config.host + ':' + this.config.port + '/Service/Controller/Plugin/Cobalt', false) //makes synchronous request
      request.send(null)
      if (request.status === 200) {
        response = request.responseText
        Log.info("State of cobalt plugin is", response)
      }
      if (
        response.includes('"state":"deactivation"') ||
        response.includes('"state":"deactivated"')
      ) {
        Log.info('Cobalt State is deactivated, going to activate ')
        this.thunderJS.Controller.activate({ callsign: 'Cobalt' }, (err, result) => {
          if (err) {
            Log.error('Failed to activate cobalt')
          } else {
            Log.info('Successfully activated  cobalt')
          }
        })
      } else {
        Log.info('Cobalt State is already activated, going to continue with resume ')
        this.launchYoutube()
      }
    }
  }


  /**
   * This method is called from keyhandler to deactivateMetroPlugin
   */
  deactivateMetroPlugin() {
    //Deactivating via RDK shell
    this.thunderJS.call('org.rdk.RDKShell', 'destroy', { callsign: 'LightningApp' })
    this.closePlugin()
  }


  /**
   * Move the focus to Accelerator UI/Browser on exiting from an App
   */
  closePlugin() {
    this.moveAppToFrontAndFocus('ResidentApp')
    this.setVisibility('ResidentApp', true)
    this.fireAncestors('$setHomeScreenState')
  }


  /**
   * This method resumes Cobalt plugin and move Cobalt to the front
   */
  launchYoutube() {
    this.thunderJS.call('Cobalt', 'state', 'resumed', (err, result) => {
      if (err) {
        Log.warn('Cobalt Error Resumed')
      } else {
        setTimeout(() => {
          this.setVisibility("ResidentApp", false)
          this.moveAppToFrontAndFocus('Cobalt')
        }, 5000)
      }
    })
  }

  /**
   * Utility function for setting visibility via RDK shell
   * @param {*} client say 'Lightning App', 'Resident App' etc
   * @param {*} visible Boolean - true or false
   */
  setVisibility(client, visible) {
    this.thunderJS.call('org.rdk.RDKShell', 'setVisibility', { client: client, visible: visible }).then(() => {
      Log.info("Visibility set to" + visible)
    }).catch(err => {
      Log.info('Error on setting visibility ' + JSON.stringify(err))
    })
  }

  /**
   * Utility method to move a given app to front and set focus
   * @param {*} clientName clientName say -ResidentApp, WebKitbrowser etc
   */
  moveAppToFrontAndFocus(clientName) {
    this.thunderJS.call('org.rdk.RDKShell', 'moveToFront', { client: clientName }).then(result => {
      Log.info(clientName + ' moveToFront Success', JSON.stringify(result))
    }).catch(err => {
      Log.error('Error in moving the app' + clientName + ' to front', err)
    })
    this.thunderJS.call('org.rdk.RDKShell', 'setFocus', { client: clientName }).then(result => {
      Log.info(clientName + ' setting Focus Success', JSON.stringify(result))
    }).catch(err => {
      Log.error('Error in setting focus of the app' + clientName + ' to front', err)
    })
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

}
