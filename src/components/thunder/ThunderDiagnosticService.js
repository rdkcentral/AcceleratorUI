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
   * Thunder  Diagnostic calls
   */
  export class ThunderDiagnosticService extends Lightning.Component {
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
      * Function to call device Info thunder call 
      */
    
    _diagnostic() {
        let diagObj = this;
        console.log('Enter diagnostics');
        return new Promise(function (resolve, reject) {
        diagObj.thunderJS.call('DeviceInfo', 'systeminfo',
          (err, result) => {
            if (err) {
              Log.info('\n Diagnostic error');
              reject();
            } else {
            Log.info('Diagnostic success', result)
            Log.info('Diagnostic success', result.version)
            let totalram=diagObj._bytesToSize(result.totalram);
            let freeram=diagObj._bytesToSize(result.freeram);
            let serialnumber=diagObj._ConvertStringToHex(result.serialnumber);
            let diagInfo = "Serial No : \n" + serialnumber + "\n " + "\nTime : " + result.time
          + "\n " + "\nUp Time : " + result.uptime + "Sec\n"+ "\nTotal RAM : \t" + totalram + "\n " + "\nFree RAM : " + freeram + "\n " + " \nDevice Name : " + result.devicename + "\n " + "\nCPU Load : " + result.cpuload + " %"
            console.log("@@@inside_dignostic",diagInfo)
            resolve(diagInfo)
          }
          }
        );
        })  
      }
      
       _diagnosticVersion() {
       let diagObj = this;
       return new Promise(function (resolve, reject) {
        diagObj.thunderJS.call('org.rdk.System', 'getSystemVersions',
      (err,result)=>{
       if(err){
          Log.info('\n Dtag: getSystemVersions Version error', err)
          reject()
            }else{
          Log.info('Dtag: getSystemVersions Version success',result)
          Log.info('Dtag: getSystemVersions Version success',result.stbVersion)
          Log.info('Dtag: getSystemVersions Version success',result.stbTimestamp)
             let diagVers1="\n" + result.stbVersion + " \n" + result.stbTimestamp + " \n\n"
             Log.info('Dtag: getSystemVersions VersionLabel obtained : ', diagVers1)
             resolve(diagVers1)
            }
           }
       )
       })
       }
       
       _diagnosticResolution() {
       let diagObj = this;
       return new Promise(function (resolve, reject) {
       diagObj.thunderJS.call('org.rdk.DisplaySettings','getCurrentResolution',{"videoDisplay":"HDMI0"},
    (err, result) => {
     if (err) {
      Log.info('\n Dtag: Display settings getCurrentResolution error')
      reject()
     } else {
        let current_resolution=result.resolution
        let diagResl="\n Current Resolution : \t" + current_resolution
        Log.info('\n Dtag: Display settings getCurrentResolution(result.resolution) DiagnosticResolutionLabel',diagResl)
        resolve(diagResl)
 }
 })
 })
       }
  
    
    /**
     * function to convert bytes to GB
     */
  
  _bytesToSize(bytes) {
     var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
     if (bytes == 0) return '0 Byte';
     var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
     return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }
  
  /**
     * function to convert string to hexa-dec
     */
  _ConvertStringToHex(str) {
      var arrayy = [];
      for (var i = 0; i < str.length; i++) {
             arrayy[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
      }
      return arrayy.join(" ");
   }


    
    
  }
