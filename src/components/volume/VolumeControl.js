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
import { Lightning, Utils, Log, Storage} from '@lightningjs/sdk'
import { ImageConstants } from '../../constants/ImageConstants'
import { ThunderVolumeService } from '../thunder/ThunderVolumeService'
/**
 * @export
 * @class VolumeControl
 * @extends {Lightning.Component}
 * To render the VolumeControlUI
 */

/**
 * Variables made global to ensure accessibility across all classes
 */
var endAngle = 273.6
 let percentage

export class VolumeControl extends Lightning.Component {
  static _template() {
    return {
      x: 1610,
      y: 770,
      Base: {
        src: Utils.asset(ImageConstants.BASE),
        zIndex: 1
      },
      VolumeBar: {
        x: 46,
        y: 46,
        zIndex: 2,
        src: Utils.asset(ImageConstants.EMPTY_VOLUME_BAR)
      },
      VolumeBarGradient: {
        x: 46,
        y: 46,
        zIndex: 3,
        texture: Lightning.Tools.getCanvasTexture(VolumeControl._gradient)
      },
      VolumeIcon: {
        x: 110,
        y: 95,
        zIndex: 2,
        src: Utils.asset(ImageConstants.VOLUME_ICON)
      },
      VolumeMarker: {
        zIndex: 4,
        src: Utils.asset(ImageConstants.VOLUME_MARKER)
      },
      Volumepercentage: {
        x: 110,
        y: 150,
        zIndex: 2
      },
      ThunderVolumeService: { type: ThunderVolumeService }
    }
  }

  _init() {
    
    this.x0 = 115
    this.y0 = 115
    this.radius = 90
    this.toggle = 0
    this.timeoutToggle = 0
    this.muteStateIdentifier = 0
    this.novolume = Storage.get("lastsetnovolume") || 0
    if (this.novolume != 0 && Storage.get("lastsetindex") == 0)
     {
     this.index = 0
     percentage = 0
     }else{
    this.index=Storage.get("lastsetindex") || 100
    percentage = Storage.get("lastsetvolume") || 100
    }
    this.coordinates(percentage)
    this._setState('VolumeState')
    this.tag('ThunderVolumeService')._volumeUp(percentage)
  }

  /**
   * For dynamically drawing the circular colored bar as the volume marker moves
   */
  static _gradient(cb, stage) {
    let canvas = stage.platform.getDrawingCanvas()
    canvas.width = 500
    canvas.height = 500
    let ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.beginPath()
    ctx.lineWidth = 7
    ctx.strokeStyle = '#0FD1AA'
    Log.info(endAngle, 'endAngle')
    ctx.arc(94, 94, 90, 270 * (Math.PI / 180), endAngle * (Math.PI / 180))
    ctx.stroke()
    cb(null, canvas)
  }

  /**
   * For showing the VolumeControl
   */
  showVolumeControl() {
    this.visible = true
  }

  /**
   * For hiding the volume control
   */
  hideVolumeControl() {
    this.visible = false
  }

  /**
   * Functions required for timeout
   */
  timeout() {
    this.showVolumeControl()
    Log.info('timeout called')
    clearInterval(this.flag)
    this.flag = setTimeout(this.hideVolume.bind(this), 3000)
  }

  hideVolume() {
    Log.info('toggleChange called')
    this.hideVolumeControl()
    clearInterval(this.flag)
  }

 displayvolume()
  {
 Storage.set("lastsetindex", this.index)
 Storage.set("lastsetnovolume", this.novolume)
   if (percentage < 10) {
          this.tag('Volumepercentage').patch({
            text: { fontSize: 32, text: percentage + '%' },
            x: 120
          })
        } 
   else {
          this.tag('Volumepercentage').patch({
            text: { fontSize: 32, text: percentage + '%' },
            x: 110
          })
        }
  }
  /**
   * For calculating the the coordinates of the point on the circle to which the marker should move upon keypress
   * @param {*} percentage
   * Based on the percentage value passed
   */

  coordinates(percentage) {
    Log.info(percentage)
    if(percentage == 100)
      percentage = 99.99
    this.angle = 360 * (percentage / 100)
    if (percentage == 0) {
      endAngle = -86.4
    } else {
      endAngle = this.angle - 90
    }
    
    this.radian = this.angle * (Math.PI / 180) - 0.5 * Math.PI
    this.x1 = this.x0 + this.radius * Math.cos(this.radian)
    this.y1 = this.y0 + this.radius * Math.sin(this.radian)
    this.tag('VolumeMarker').patch({ x: this.x1, y: this.y1 })
    this.tag('VolumeBarGradient').patch({
      texture: Lightning.Tools.getCanvasTexture(VolumeControl._gradient)
    })
  }

  /**
   *Function to increase volume and update UI according to that
   */
  increaseVolume() {
  console.log("Inside increase volume")
  this.novolume=0
    this.timeout()
    if (this.index < 100) {
      //this.timeout()
      /**
       *  added to get back to volume state if volume increase key is pressed while in mute state
       * won't execute if already in volume state
       */
      if (this.index >= 0) {
        console.log("Inside increase volume setting to volume state")
        this._setState('VolumeState')
        this.tag('ThunderVolumeService')._volumeMute(false)
      }
      if (this.index <= 100) {
        this.index += 1
        percentage += 1
        console.log("Inside increase volume this.index=",this.index)
        this.coordinates(percentage)
        this.tag('ThunderVolumeService')._volumeUp(percentage)
      }

      if (percentage <= 100) {
       //percentage += 1
        this.displayvolume()
      }
    }
    Storage.set("lastsetnovolume", this.novolume)
  }

  /**
   *Function to decrease volume , goto mute if reduced below 1% and update UI accordingly
   */
  decreaseVolume() {
    this.timeout()
    if (this.toggle == 0) {
      //this.timeout()
      this.novolume = 0
      if (this.index > 0) {
        this.index -= 1
        console.log("Inside decrease volume this.index=",this.index)
        if (percentage > 0) {
          percentage -= 1
          this.displayvolume()
        }
        this.coordinates(percentage)
        this.tag('ThunderVolumeService')._volumeUp(percentage)
      }
      if (this.index == 0 || percentage == 0) {
    
        this._setState('MuteState')
        this.tag('ThunderVolumeService')._volumeMute(true)
        this.index = 0
        percentage = 0
        this.novolume = 1
        Storage.set("lastsetindex", this.index)
        Storage.set("lastsetvolume", percentage)
     
      }
    }
    Storage.set("lastsetnovolume", this.novolume)
  }

  /**
   * Function to mute/unmute volume at any point
   */
  muteVolume() {
    Log.info('mute function entered')
    Log.info(this.muteStateIdentifier, 'identifier')
    this.timeout()
    Log.info(this.toggle)
    if (this.toggle == 0) {
      this._setState('MuteState')
      this.tag('ThunderVolumeService')._volumeMute(true)
      this.novolume = 1
    } else {
      this._setState('VolumeState')
      this.tag('ThunderVolumeService')._volumeMute(false)
    }

    if (this.muteStateIdentifier == 0) {
      this.timeout()
      this._setState('VolumeState')
      this.tag('ThunderVolumeService')._volumeMute(false)
      if (this.index == 0) {
        this.index = 1 // to set volume marker to 1 % volume after mute instead of 0 %
        console.log("Inside mute volume",this.index)
        percentage = 1
        this.displayvolume()
        this.coordinates(percentage)
        this.tag('ThunderVolumeService')._volumeUp(percentage)
      }
    }
    Storage.set("lastsetindex", this.index)
    Storage.set("lastsetvolume", percentage)
    Storage.set("lastsetnovolume", this.novolume)
  }
  
 

  /**
   * @static
   * @returns
   * @memberof VolumeControl
   * VolumeControl States
   */
  static _states() {
    return [
      class VolumeState extends this {
        $enter() {
          Log.info('VolumeState')
          this.toggle = 0
          this.muteStateIdentifier = 0
          this.tag('Base').patch({ src: Utils.asset(ImageConstants.BASE), x: 0, y: 0 })
          this.tag('VolumeBar').patch({ src: Utils.asset(ImageConstants.EMPTY_VOLUME_BAR) })
          this.tag('VolumeIcon').patch({ src: Utils.asset(ImageConstants.VOLUME_ICON) })
          this.tag('VolumeMarker').visible = true
          this.tag('VolumeBarGradient').visible = true
          this.displayvolume()
        }

        $exit() {
          this.toggle = 1
        }
      },
      class MuteState extends this {
        $enter() {
          Log.info('MuteState')
          this.toggle = 1
          this.muteStateIdentifier = 1
          this.tag('Base').patch({ src: Utils.asset(ImageConstants.MUTE_BASE), x: 7, y: 9 })
          this.tag('VolumeBar').patch({ src: Utils.asset(ImageConstants.MUTE_VOLUME_BAR) })
          this.tag('VolumeIcon').patch({ src: Utils.asset(ImageConstants.MUTE_ICON) })
          this.tag('VolumeMarker').visible = false
          this.tag('VolumeBarGradient').visible = false
          
          this.tag('Volumepercentage').patch({ text: { fontSize: 32, text: 'MUTE' }, x: 100 })
        }
        $exit() {
          this.toggle = 0
        }
      }
    ]
  }
}
