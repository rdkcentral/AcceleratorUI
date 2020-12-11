/* eslint-disable no-unused-vars */
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
import { Utils, Lightning } from '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
/**
 * @export
 * @class KeyboardItem
 * @extends Lightning.Component
 * KeyboardItem
 */
export class KeyboardItem extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof export class KeyboardItem extends Lightning.Component {
   * Renders the template
   */
  static _template() {
    return {
      HighLight: {
        w: 228,
        h: 74,
        visible: false
      },
      Label: {
        x: 63,
        y: 21,
        h: 37,
        rect:true,
        text: {
          text: '',
          fontFace: 'Medium',
          fontSize: 35,
          fontStyle:'Bold',
          textColor: Colors.FLUORESCENT_GREEN
        }
      }
    }
  }

  /**
   * Sets the name of the menu
   */
  set items(v) {
    this._menuName = v.menuName
    this.patch({
      Label: {
        text: {
          text: this._menuName
        }
      }
    })
  }

  _init() {
    
    this.animation = this.tag('Label').animation({
      duration: 0.25,
      repeat: 0,
      stopMethod: 'reverse',
      actions: [
        {p: 'alpha', v: {0: 0.9, 0.25: 1, 0.5: 1}},
        {p: 'scale', v: {0: 1, 0.25: 1.2, 0.5: 1.3}}
      ]
    });
  }

  /**
   * On focus Hightlight and Label elements are patched
   */
  _focus() {
    this.patch({
      HighLight: {
        visible: true,
      },
      Label: {
        text: {
          textColor: Colors.WHITE,
        }
      }
    })
    this.animation.start();
  }

  /**
   * While not on focus
   */
  _unfocus() {
    this.patch({ 
      HighLight: { 
        visible: false 
      },
      Label: {
        text: {
          textColor: Colors.FLUORESCENT_GREEN,
         }
      }
    })
    this.animation.stop();
  }
}
