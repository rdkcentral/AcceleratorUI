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
     * @class ThunderNetworkService
     * @extends Lightning.Component
     * Thunder  Network calls
     */
     
      export class ThunderNetworkService extends Lightning.Component {
      _construct() {
        this.config = {
          host: '127.0.0.1',
          port: '9998'
        }
        this.device = []
        try {
          this.thunderJS = ThunderJS(this.config)
        } catch (err) {
          Log.error(err)
        }
      }
     
   /**
       * Function to return network status 
       */
       
     getnetworkstatus(){
          let networkObj = this
          return new Promise(function (resolve, reject) {   
          networkObj.thunderJS.call('org.rdk.Network', 'getInterfaces',
           (err, result) => {
               console.log('Ntag: Enter thunder Network')
               if (err) {
               reject();
               Log.info('\n Ntag:thunder Network error')
               } else {
                 Log.info('\n Ntag:thunder Network success', result)
                 let allinterfaces = result.interfaces
      		   let allinterfaces_length = allinterfaces.length
             let wifi_connection_status,ethernet_connection_status;
      		   for (let i = 0; i < allinterfaces.length; i++) {
      			if(allinterfaces[i].interface === "WIFI")
      				{
      				      wifi_connection_status= allinterfaces[i].connected;
      					    Log.info('\n Ntag:thunder Network wifi_connection_status', wifi_connection_status);
      				}
          if(allinterfaces[i].interface === "ETHERNET")
      				{
      			         ethernet_connection_status= allinterfaces[i].connected;
      					     Log.info('\n Ntag:thunder Network ethernet_connection_status', ethernet_connection_status);
      				} 
      			}
            if(wifi_connection_status) {
            resolve("Wifi")
            } else if (ethernet_connection_status) {
            resolve("Ethernet") 
            } else {
            resolve("No_Network")
            }
          }
           })
           })
          }
          
          }