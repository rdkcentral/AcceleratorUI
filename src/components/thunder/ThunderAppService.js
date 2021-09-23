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
import { Lightning, Log ,Storage} from '@lightningjs/sdk'
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
    this.currentApp = ''
    try {
      this.thunderJS = ThunderJS(this.config)
    } catch (err) {
      Log.error('Error in initialising the Thunder JS', err)
    }

    //Activating these plugins from here to activate it in the startup itself
    //If called from wifi or diagnostic service, the delay in activation can affect app function
    this._activate('org.rdk.Wifi')
    this._activate('org.rdk.System')

    this.thunderJS.call('Netflix', 'state', 'suspended', () => {
      Log.info('Netflix Suspended');
    });
    this.thunderJS.call('Amazon', 'state', 'suspended', () => {
      Log.info('Amazon Suspended');
    });

    // Adding key intercept for 'Xfinity button' ,for exit from apps (for XR remote)
    this.thunderJS
      .call('org.rdk.RDKShell', 'addKeyIntercept', {
        client: 'ResidentApp',
        keyCode: 77,
        modifiers: ["ctrl"]
      })
      .then(result => {
        Log.info('Adding KeyIntercept success for Keycode 77', result)
      })
      .catch(err => {
        Log.error('Error in adding Key Intercept', err)
      })

     // Adding key intercept for 'Guide Key' , for exit from all apps(for BT RCU)
     this.thunderJS
        .call('org.rdk.RDKShell', 'addKeyIntercept', {
          client: 'ResidentApp',
          keyCode: 114,
          modifiers: []
        })
        .then(result => {
          Log.info('Adding KeyIntercept success for Keycodee 114', result)
        })
        .catch(err => {
          Log.error('Error in adding Key Intercept', err)
        })


    // Adding key intercept for 'Home Key' , for exit from all apps(for keyboard)
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
    // Adding key intercept for 'Vol Key' , for exit from all apps(for keyboard)
     this.thunderJS
     .call('org.rdk.RDKShell', 'addKeyIntercept', {
     client: 'ResidentApp',
     keyCode: 173,
     modifiers: []
     })
     .then(result => {
     Log.info('Adding KeyIntercept success for Keycode 173', result);
     })
     .catch(err => {
     Log.error('Error in adding Key Intercept', err);
     });
     
      
     // Adding key intercept for 'Vol Key' , for exit from all apps(for keyboard)
     this.thunderJS
     .call('org.rdk.RDKShell', 'addKeyIntercept', {
     client: 'ResidentApp',
     keyCode: 174,
     modifiers: []
     })
     .then(result => {
     Log.info('Adding KeyIntercept success for Keycode 174', result);
     })
     .catch(err => {
     Log.error('Error in adding Key Intercept', err);
     });
    
     
    
    
    // Adding key intercept for 'Vol Key' , for exit from all apps(for keyboard)
    this.thunderJS
    .call('org.rdk.RDKShell', 'addKeyIntercept', {
    client: 'ResidentApp',
    keyCode: 175,
    modifiers: []
    })
    .then(result => {
    Log.info('Adding KeyIntercept success for Keycode 175', result);
    })
    .catch(err => {
    Log.error('Error in adding Key Intercept', err);
    });

    //Event listener for all the controller events
    this.thunderJS.on('Controller', 'all', data => {
      let _data = data.data ? data.data : {}
      Log.info('Controller event >>>:', JSON.stringify(data))
      //For Youtube launch and exit
      if (data.callsign == 'Cobalt') {
        Log.info('Cobalt Event !!! ')
        //When cobalt is activated , then 'activated' event is obtained and then Cobalt plugin is resumed
        if (_data.state == 'activated') {
          this.launchApp('Cobalt')
          //Flag to be set on enabling Youtube
          window.cobaltAppEnabled = true
        }
        // When the app is deactivated via Controller, 'deactivated' event is received
        if (_data.suspended == true || _data.state == 'deactivated') {
          Log.info('Close Cobalt plugin success')
          this.exitPlugin()
        }
      }
      //For Netflix launch and exit
      else if(data.callsign == 'Netflix'){
        Log.info('Netflix Event >>>>>' + JSON.stringify(data));
        if (_data.suspended == true || _data.state == 'deactivated') {
          Log.info('Netflix close plugin >>>>>>');
          this.exitPlugin();
        }
        if (_data.state == 'activated') {
         this.launchApp('Netflix');
         //Flag to be set on enabling Netflix
         window.netflixAppEnabled = true
        }
      }
      else if(data.callsign == 'Amazon'){
        Log.info('Amazon Event >>>>>' + JSON.stringify(data));
        if (_data.suspended == true || _data.state == 'deactivated') {
          Log.info('Amazon close plugin >>>>>>');
          this.exitPlugin();
        }
        if (_data.state == 'activated') {
         this.launchApp('Amazon');
         //Flag to be set on enabling Amazon
         window.amazonAppEnabled = true
        }
      }
    })
  }

  //Init method
  _init() {
    Log.info('Thunder Service init')
    this._activate('org.rdk.DisplaySettings')
    setTimeout(()=>{this._setresolution()},1000)  
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
        this.currentApp = appPlugin
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
      this.currentApp = 'Cobalt'
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
        this.thunderJS
          .call('org.rdk.RDKShell', 'launch', {
            callsign: 'Cobalt',
            type: 'Cobalt',
          })
        .then(() => {
          Log.info('Launch successful for Cobalt')
        })
        .catch(err => {
          Log.info('Error in launching  ' + JSON.stringify(err))
        })
        //Flag to be set on enabling Youtube
        window.cobaltAppEnabled = true
      } else {
        Log.info('Cobalt State is already activated, going to continue with resume ')
          this.launchApp('Cobalt')
          //Flag to be set on enabling Youtube
          window.cobaltAppEnabled = true
      }

    }
    if (data.title == 'Netflix') {
        this.activeApp = 'Netflix';
        this.currentApp = 'Netflix';
      Log.info('Launch Netflix !!!!');
      this.thunderJS
        .call('org.rdk.RDKShell', 'launch', {
          callsign: 'Netflix',
          type: 'Netflix',
        })
      .then(() => {
        Log.info('Launch successful for Netflix')
      })
      .catch(err => {
        Log.info('Error in launching  ' + JSON.stringify(err))
      })
      //Flag to be set on enabling Netflix
      window.netflixAppEnabled = true

    }
    if (data.title == 'Amazon') {
      this.activeApp = 'Amazon';
      this.currentApp = 'Amazon';
      Log.info('Launch Amazon !!!!');
      
      /*this.thunderJS.Controller.activate({ callsign: 'Amazon' }, (err, result) => {
        if (err) {
          Log.error('Failed to activate Amazon');
        } else {
          Log.info('Successfully activated Amazon', result);
        }
      })*/
      this.thunderJS
        .call('org.rdk.RDKShell', 'launch', {
          callsign: 'Amazon',
          type: 'Amazon',
        })
      .then(() => {
        Log.info('Launch successful for Amazon')
      })
      .catch(err => {
        Log.info('Error in launching  ' + JSON.stringify(err))
      })
      //Flag to be set on enabling Netflix
      window.amazonAppEnabled = true
    }
  }


  /**
   * Method to launch an application
   * @param {*} plugin 
   */
  launchApp(plugin){
    this.thunderJS.call(plugin, 'state', 'resumed', (err, result) => {
      if (err) {
        Log.warn(plugin +'Error Resumed');
      } else {
        setTimeout(() => {
          this.setVisibility("ResidentApp", false);
          this.moveAppToFrontAndFocus(plugin);
          Log.info('Resuming the apps and setting the visibility true !!!!');
          Log.info('Plugin Value is  ' + plugin);
          this.setVisibility(plugin, true);
          this.activeApp = plugin;
          this.currentApp = plugin;
        }, 5000);
      }
    });
  }

  /**
   * This method is called from keyhandler to deactivateMetroPlugin
   */
  deactivateMetroPlugin() {
    //Deactivating via RDK shell
    this.thunderJS.call('org.rdk.RDKShell', 'destroy', { callsign: 'LightningApp' })
    this.currentApp = ''
    this.exitPlugin()
  }


  /**
   * Move the focus to Accelerator UI/Browser on exiting from an App
   */
  closePlugin() {
    if (this.activeApp == 'Cobalt') {
      Log.info('Suspending Cobalt app !!!!');
      this.thunderJS.call('org.rdk.RDKShell', 'suspend', { callsign: 'Cobalt' })
      .then(() => {
        Log.info('suspend successful for Cobalt ')
      })
      .catch(err => {
        Log.info('Error in suspending Cobalt  ' + JSON.stringify(err))
      })
      Log.info('Setting Cobalt visibility false !!!!');
      this.setVisibility('Cobalt', false)
      this.activeApp = '';
      this.currentApp = '';
    }
    if (this.activeApp == 'Netflix') {
      Log.info('Suspending Netflix app !!!!');
      this.thunderJS.call('org.rdk.RDKShell', 'suspend', { callsign: 'Netflix' })
      .then(() => {
        Log.info('suspend successful for Netflix ')
      })
      .catch(err => {
        Log.info('Error in suspending Netflix ' + JSON.stringify(err))
      })
      Log.info('Setting Netflix visibility false !!!!');
      this.setVisibility('Netflix', false)
      this.activeApp = '';
      this.currentApp = '';
    }
    if (this.activeApp == 'Amazon') {
      Log.info('Suspending Amazon app !!!!');
      this.thunderJS.call('org.rdk.RDKShell', 'suspend', { callsign: 'Amazon' })
      .then(() => {
        Log.info('suspend successful for Amazon ')
      })
      .catch(err => {
        Log.info('Error in suspending Amazon ' + JSON.stringify(err))
      })
      Log.info('Setting Amazon visibility false !!!!');
      this.setVisibility('Amazon', false)
      this.activeApp = '';
      this.currentApp = '';
    }
  }

  /**
   * Move the focus to Accelerator UI/Browser on exiting from an App
   */
  exitPlugin() {
    this.fireAncestors('$setHomeScreenState')
    this.moveAppToFrontAndFocus('ResidentApp')
    this.setVisibility('ResidentApp', true)
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
//To set best resolution
   _setresolution(){
     console.log("Display settings inside set resolution")
     this.thunderJS.call('org.rdk.DisplaySettings','getSupportedResolutions',{"videoDisplay":"HDMI0"},
         (err, result) => {
           if (err) {
             Log.info('\n Display settings get error')
           } else {
             Log.info('\n Display settings get success', result.supportedResolutions)
               let display_array=result.supportedResolutions.slice()
               Log.info('\n Display settings get display_array', display_array)
               let display_array_length=display_array.length
               let highest_resolution= Storage.get('lastsetresolution') || display_array[display_array_length-1]
               Log.info('\n Display settings get result length' + display_array_length)
               Log.info('\n Display settings get highest resolution' + highest_resolution)
               this.thunderJS.call('org.rdk.DisplaySettings','setCurrentResolution',{"videoDisplay":"HDMI0", "resolution":highest_resolution,"persist":true},
                   (err, result) => {
                     if (err) {
                       Log.info('\n Display settings set error')
                         this.thunderJS.call('org.rdk.DisplaySettings','setCurrentResolution',{"videoDisplay":"HDMI0", "resolution":"    1080p60"    , "persist":true})
                         Log.info('Resolution set on default to: 1080p')
                     } else {
                       Log.info('\n Display settings set success to:' + highest_resolution )
                     }
                   }
                   )
           }
         } )
   }
   
     setViewResidentApp()
   {
    this.setVisibility('ResidentApp', true)
    this.moveAppToFrontAndFocus('ResidentApp') 
   }
   setBacktoAppState()
   {
   Log.info('Vtag:current App',this.currentApp)
   this.moveAppToFrontAndFocus(this.currentApp)
    this.setVisibility('ResidentApp', false)
   }
     moveToBack(clientName) {
    this.thunderJS.call('org.rdk.RDKShell', 'moveToBack', { client: clientName }).then(result => {
      Log.info(clientName + ' moveToBack Success', JSON.stringify(result))
    }).catch(err => {
      Log.error('Error in moving the app' + clientName + ' to back', err)
    })
  }
}
