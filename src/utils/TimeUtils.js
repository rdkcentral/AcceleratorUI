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
import moment from 'moment'
import ThunderJS from 'ThunderJS'

export class TimeUtils{
  /**
   * The function returns the current time
   */

  constructor() {
    Log.info('Aatag: Time Component ')
      this.config = {
        host: '127.0.0.1'
      }
    this.device = []
      try {
        this.thunderJS = ThunderJS(this.config)
      } catch (err) {
        Log.error(err)
      }
    //  this.getCurrentTime()
  }
  
//  getCurrentTimewithdate() {
//    let date = new Date()
//    let time =
//      (date.getHours() % 12 == 0 ? '12' : date.getHours() % 12) +
//      ':' +
//      (date.getMinutes() + '').padStart(2, '0') +
//      (date.getHours() >= 12 ? ' PM' : ' AM')
//    return time
//  }
  
  async getCurrentTime() {
    console.log("Aatag: Inside getCurrentTime")
      let utctime=await this.getUTCTime() || 0
      // let utctime= '10:38'
       console.log("Aatag: utctime =",utctime)
      Log.info('Aatag: Time util init')
     // this._activate('LocationSync')
      //  let offsettime = -(new Date().getTimezoneOffset());
          let offsettime=await this.getOffsetTime() || 0
          console.log("Aatag: offsettime =",offsettime)
          let localtime=this.addTime(utctime,offsettime)
          console.log("Aatag: localtime =",localtime)
          const t = localtime.split(':')
          let time =
          (t[0] % 12 == 0 ? '12' : t[0] % 12) +
          ':' +
          t[1] +
          (t[0] >= 12 ? ' PM' : ' AM')
          console.log("Aatag: time =",time)
          return time
  /*let date = new Date()
    let time =
    (date.getHours() % 12 == 0 ? '12' : date.getHours() % 12) +
    ':' +
    (date.getMinutes() + '').padStart(2, '0') +
    (date.getHours() >= 12 ? ' PM' : ' AM')
    return time*/
}

addTime(utcTime,offset) {
  console.log("Aatag: Inside addTime utcTime and offset",utcTime,offset)
    if(utcTime && offset) {
      const utcArray = utcTime.split(':')
        console.log('Aatag: utc time Array',utcArray)
        
        const offsetArray = offset.split(':')
        console.log('Aatag: offset Array',offsetArray)
        const addedTime = moment().hour(utcArray[0]).minute(utcArray[1]).add(offsetArray[0], 'hours').add(offsetArray[1], 'minutes').format('HH:mm');
    /*   var m = offset % 60;
        var h = (offset-m)/60;
       console.log('Aatag:offset by 60 and ofset mod 60',h,m)
       const addedTime = moment().hour(utcArray[0]).minute(utcArray[1]).add(h,'hours').add(m, 'minutes').format('HH:mm');*/
      console.log('Aatag: addedTime',addedTime)
        return addedTime
    }

}

getUTCTime()
{
  console.log("Aatag: Inside getUTCTime")
    let timeObj = this
    return new Promise(function (resolve, reject) { 
      let timenum
        timeObj.thunderJS.call('DeviceInfo', 'systeminfo',
            (err, result) => {
              console.log('Aatag: Enter UTC time')
                if (err) {
                  Log.info('\n Aatag: UTC time error')
                    reject()
                } else {
                  Log.info('\n Aatag: UTC time success', result.time)
                    let timevar=result.time
                    console.log('\n Aatag: timevarprint', timevar)
                    timenum = timevar.substr(timevar.length - 9)
                    resolve(timenum);
                  Log.info('Aatag: Infobar UTC time: Printing result.time and substr of same', timevar ,timenum)

                }
            }
            )
    })
}

getOffsetTime()
{   
  let offsetObj = this
    console.log("Aatag: Inside getOffsetTime") 
   // setTimeout(()=>{
    return new Promise(function (resolve, reject) {   
      let timenum1
      offsetObj.thunderJS.call('LocationSync', 'sync')
      // Log.info('\n Aatag: .sync error')
        offsetObj.thunderJS.call('LocationSync', 'location',
            (err, result) => {
              console.log('Aatag: Enter timezone')
                if (err) {
                  Log.info('\n Aatag: timezone error')
                    resolve("0")
                } else {
                  Log.info('\n Aatag: timezone success', result.timezone)
                    let timevar1 = result.timezone
                    let timenum1 = timevar1.substr(4)
                    resolve(timenum1)
                    Log.info('Aatag: Infobar timezone: Printing result.timezone and substr of same', timevar1 ,timenum1)
                }
            }
            )
            })
    }
 //   }, 1000)

/*_activate(callSign) {
  console.log("Aatag: inside Activate location") 
  this.thunderJS.Controller.activate({ callsign: callSign }, (err, result) => {
    console.log("Aatag: inside activate location thundercall")
    if (err) {
      Log.error('Aatag: Failed to activate ' + callSign)
    } else {
      Log.info('Aatag: Successfully activated ' + callSign)
    }
  })
}*/
}
