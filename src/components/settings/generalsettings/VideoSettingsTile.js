/* eslint-disable semi */
/* eslint-disable prettier/prettier */
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
import { Lightning, Utils, Language} from '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
import { ImageConstants } from '../../../constants/ImageConstants'

/**
 * @export
 * @class ResolutionTile
 * @extends Lightning.Component
 * Renders the ResolutionTile
 */
export class VideoSettingsTile extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof ResolutionTile
   * Renders the template
   */
  static _template() {
    return {
      TileBg: {
        rect: true,
        w: 800,
        h: 90,
        color: Colors.SETTINGS_GREY,
        Higlight: {
          x: -3,
          y: -3,
          src: Utils.asset(ImageConstants.SETTINGS_HIGHLIGHT),
          visible: false
        },
        Label: {
          x: 30,
          y: 28,
          text: { text: '', fontSize: 32, textColor: Colors.LIGHTER_WHITE, fontFace: 'Medium' }
        },
      Switch: {
        x: 603,
        y: 25,
        /*Shadow: {
          alpha: 0,
          x: -15,
          y: 0,
          color: 0x66000000,
          texture: lng.Tools.getShadowRect(205, 60, 50, 10, 20),
        },*/
        Button: {
          h: 50,
          w: 150,
          src: Utils.asset(ImageConstants.SWITCH_OFF),
        }

      },
        Marked: { x: 650, y: 29, src: Utils.asset(ImageConstants.BLUETOOTH_READY), visible: false }
      }
    }
  }

$buttonenable(){
this.toggleBtnAnimationX()
this.tag('Button').patch({
        src: Utils.asset(ImageConstants.SWITCH_ON)
      })
}

$buttondisable(){
this.toggleBtnAnimationY()
      this.tag('Button').patch({
        src: Utils.asset(ImageConstants.SWITCH_OFF)
      })
}

$focusbutton(){
this.tag('Button').patch({
            h: 60,
            w: 180
          })
          this.tag('Shadow').patch({
            smooth: {
              alpha: 1
            }
          });
}
$unfocusbutton(){
this.tag('Button').patch({
            h: 50,
            w: 170
          })
          this.tag('Shadow').patch({
            smooth: {
              alpha: 0
            }
          });
          }
$exitbutton(){
this.tag('Button').patch({
            h: 50,
            w: 150
          })
}
toggleBtnAnimationX() {
    const lilLightningAnimation = this.tag('Button').animation({
      duration: 1,
      repeat: 0,
      actions: [
        { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
      ]
    });
    lilLightningAnimation.start();
  }
  
toggleBtnAnimationY() {
    const lilLightningAnimation = this.tag('Button').animation({
      duration: 1,
      repeat: 0,
      actions: [
        { p: 'x', v: { 0: 0, 0.5: 0, 1: 0 } }
      ]
    });
    lilLightningAnimation.start();
  }
  
  set label(v) {
    this.tag('Label').text.text = Language.translate(v)
  }

  get label() {
    return this.tag('Label').text.text
  }

  set setswitch(v) {
    if(v == true){
    this.tag('Button').patch({
        src: Utils.asset(ImageConstants.SWITCH_ON)
      })
    }else
    {
    this.tag('Button').patch({
        src: Utils.asset(ImageConstants.SWITCH_OFF)
      })
    }
  }
  
  set security (v) {
    this._security = v;
  }
  
  get security () {
    return this._security;
  }
  
  set w(v) {}

  set ready(v) {
    if (v == true) {
      this.tag('Marked').visible = true
    } else {
      this.tag('Marked').visible = false
    }
  }
  set h(v) {}

  _focus() {
    this.tag('Higlight').visible = true
  }

  _unfocus() {
    this.tag('Higlight').visible = false
  }
}
