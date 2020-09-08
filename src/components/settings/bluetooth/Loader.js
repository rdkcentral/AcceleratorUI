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
import { Lightning } from 'wpe-lightning-sdk'
/**
 * @export
 * @class Loader
 * @extends {lng.Component}
 */
export class Loader extends Lightning.Component {
  
  /**
   * @static
   * @returns {object} to setup render tree
   * @memberof Loader
   */
  static _template() {
    return {
      Loader: {
        CircleWhite: {
          x: 0,
          texture: Lightning.Tools.getRoundRect(20, 20, 10)
        },
        CircleLightgrey: {
          x: 30,
          texture: Lightning.Tools.getRoundRect(20, 20, 10)
        },
        CircleGrey: {
          x: 60,
          texture: Lightning.Tools.getRoundRect(20, 20, 10)
        }
      }
    }
  }

  /**
   * @memberof Loader
   */
  _init() {
    this._stopSwitch = false
    this.circleAnimationwhite = this.tag('CircleWhite').animation(this.circleAnimation())
    this.circleAnimationligrey = this.tag('CircleLightgrey').animation(this.circleAnimation())
    this.circleAnimationgrey = this.tag('CircleGrey').animation(this.circleAnimation())
    this.circleAnimationwhite.on('finish', () => {
      if (this._stopSwitch === false) {
        this.circleAnimationligrey.start()
      }
    })
    this.circleAnimationligrey.on('finish', () => {
      if (this._stopSwitch === false) {
        this.circleAnimationgrey.start()
      }
    })
    this.circleAnimationgrey.on('finish', () => {
      if (this._stopSwitch === false) {
        this.circleAnimationwhite.start()
      }
    })
    this._animations = [
      this.circleAnimationwhite,
      this.circleAnimationligrey,
      this.circleAnimationgrey
    ]
    this.circleAnimationwhite.start()
  }

  /**
   * @returns object
   * @memberof Loader
   * Function to animate the object by scaling to larger size and rescaling back to normal size continuously.
   */
  circleAnimation() {
    return {
      repeat: 0,
      duration: 0.5,
      stopMethod: 'fade',
      actions: [
        {
          p: 'scale',
          v: {
            0: {
              v: 1,
              s: 2
            },
            1: {
              v: 1,
              s: 1
            }
          }
        }
      ]
    }
  }

  /**
   * @memberof Loader
   * Function to start animation once the loader is rendered
   */
  _active() {
    this._stopSwitch = false
    this._animations[0].start()
  }
  
  /**
   * @memberof Loader
   * Function to stop the animation when the loader is made hidden
   */
  _inactive() {
    this._stopSwitch = true
    this._animations.forEach(animation => animation.stopNow())
  }
}
