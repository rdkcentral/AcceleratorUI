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
  import { Lightning, Utils, Log } from '@lightningjs/sdk'
  import { StringConstants } from '../../constants/StringConstants'
  import { ImageConstants } from '../../constants/ImageConstants'
  import { Colors } from '../../constants/ColorConstants'
  import { TimeUtils } from '../../utils/TimeUtils'
  import { ThunderBluetoothService } from '../thunder/ThunderBluetoothService'
  import { ThunderNetworkService } from '../thunder/ThunderNetworkService'
  
  
  /**
   * @export
   * @class InfoBar
   * @extends {Lightning.Component}
   * To render the InfoBar Component.
   */
  export class InfoBar extends Lightning.Component {
  
      static _template() {
  
        return {
          Logo: {
            x: 1555,
            y: 39,
            w: 272,
            h: 79,
            alpha: 0,
            flex: { direction: 'row', padding: 20, wrap: true },
            rect: true,
            color: Colors.TRANSPARENT,
            LogoflexItem: {
            src: Utils.asset(ImageConstants.LOGO)            
           }
          },
          Info: {
            x: 1550,
            y: 56,
            w: 300,
            h: 200,
            alpha: 1,
            flex: { direction: 'row-reverse',padding: 20 },
            rect: true,
            color: Colors.TRANSPARENT,
            flexItem: { margin: 30},
             children: [       
            ]         
            ,
           Time: {
             h: 38,
             text: { text: ' ', fontFace: 'Medium', fontSize: 32 },
             flexItem: {
                margin: 10,
              }
           },
             Wifi: {
           src: Utils.asset(ImageConstants.ETHERNET),
           flexItem: {
            margin: 10
           }
         },
          Bluetooth: {
           flexItem: {
            margin: 10
           }
         },
           Temperature: {
            alpha: 0,
              text: {
                text: StringConstants.TEMP,
                fontFace: 'Medium',
                fontSize: 32
              },
               flexItem: {
                 margin: 10
                 
                 
              }
            }
          },
          ThunderBluetoothService: {
          type: ThunderBluetoothService
          },
          ThunderNetworkService: {
          type: ThunderNetworkService
          }
        }
  
      }
  
    _construct() { 
        const xhr = new XMLHttpRequest();  
        xhr.open('GET', "http://"+ window.serverdata.Server_ip + ":" + window.serverdata.Server_port +"/CustomUI/getInfobarItems?customer_id="+window.serverdata.serial_number);
        xhr.responseType = 'json';
  
        xhr.onload = () => {
        const data = xhr.response;
           for (var i = 0; i < data.length; i++) {
             var   WeatherString = (JSON.stringify(data[i])).includes("weather")
             console.log('WeatherString',WeatherString)
             if(WeatherString)
            {
             this.tag('Temperature').patch({alpha:1})
            }
            this.tag("Info").childList.a( {src : Utils.asset(data[i].src)} );
            if(data[i].Logo)
            {
            this.tag('Logo').patch({ LogoflexItem: { src: Utils.asset(data[i].Logo) } });
            }
           }
        };
        xhr.send();
      }
      
      _init() {
        this.geticonstatus();
        setInterval(this.geticonstatus.bind(this), 60000);
        this.time = new TimeUtils();
        this.updateTimebar();
        setInterval(this.updateTimebar.bind(this), 30000); //Updating time in every minute
        this._setState('InfoState'); // To show infobar as default
        
      }
      
      /**
       * update infobar icons status
       */
      
   geticonstatus() {
      this.tag('ThunderNetworkService').getnetworkstatus().then(network => {
      if(network === "Wifi") {
      this.tag('Wifi').patch({ src: Utils.asset(ImageConstants.WIFI)} );
      } else if(network === "Ethernet") {
      this.tag('Wifi').patch({ src: Utils.asset(ImageConstants.ETHERNET)} );
      } else {
      this.tag('Wifi').patch({ src: Utils.asset(ImageConstants.NO_NETWORK)} );
      }   
      });
      this.tag('ThunderBluetoothService').getbluetoothstatus().then(bluetooth => {
      if(bluetooth === "true") { 
      this.tag('Bluetooth').patch({ src: Utils.asset(ImageConstants.BLUETOOTH)} );
      } else {
      this.tag('Bluetooth').patch({ src: ""} );
      }
      });    
   }
      
      /**
       * Returns the current time
       */
      async updateTimebar() {
        this.timeText = await this.time.getCurrentTime();
        this.tag('Time').patch({ text: { text: this.timeText } });
      }
  
      /**
       * Switches state to info that is to be used with set Timeout/Interval
       */
      switchtoInfo() {
        this._setState('InfoState');
      }
  
      /**
       * Switches state to logo that is to be used with set Timeout/Interval
       */
      switchtoLogo() {
        this._setState('LogoState');
      }
  
      /**
       * Function to use in other files to hide infobar
       */
      hideInfobar() {
        clearInterval(this.flag);
        clearInterval(this.flag1);
        this.visible = false;
      }
  
      /**
       * Function to use in other files to show infobar
       */
      showInfobar() {
        this.visible = true;
        this._setState('InfoState');
      }
  
  
      /**
       * @static
       * @returns
       * @memberof InfoBar
       * Infobar states
       */
      static _states() {
        return [
          class LogoState extends this {
            $enter() {
              this.tag('Logo').alpha = 1;
              this.flag = setTimeout(this.switchtoInfo.bind(this), 10000); //Switch to Info state after 10 seconds
            }
            $exit() {
              this.tag('Logo').alpha = 0;
            }
          },
          class InfoState extends this {
            $enter() {
              this.tag('Info').alpha = 1;
              this.flag1 = setTimeout(this.switchtoLogo.bind(this), 120000); // Switch to Logo state after 2 minutes
            }
            $exit() {
              this.tag('Info').alpha = 0;
            }
          }
        ]
      }
    }
