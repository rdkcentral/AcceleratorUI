/* eslint-disable semi */
/* eslint-disable quotes */
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
import { Lightning, Log } from '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
import { StringConstants } from '../../../constants/StringConstants'
import { KeyboardItem } from './KeyboardItem'

export class Keyboardscreen extends Lightning.Component {
  static _template() {
    return {
      RightBg: {
        x: 960,
        y: 610,
        rect: true,
        w: 960,
        h: 300,
        color: Colors.FLUORESCENT_GREEN,
        alpha: 0.25,
      },
      Pass: {
        rect: true,
        x: 1041,
        y: 460,
        w: 800,
        h: 60,
        color: Colors.WHITE,
        Text: {
          x: 10,
          y: 10,
          text: {
            text: "",
            textColor: Colors.DARK_BLACK,
            fontFace: 'Medium',
            fontSize: 28,
          },
          alpha: 0,
        },
        Mask: {
          x: 10,
          y: 10,
          text: {
            text: "",
            textColor: Colors.DARK_BLACK,
            fontFace: 'Medium',
            fontSize: 28,
          },
          alpha: 1,
        }
      },
      EnterKey: {
        rect: true,
        x: 1560,
        y: 830,
        w: 280,
        h: 60,
        color: Colors.SLATE_GREY,
        alpha: 0.8,
        Text: {
          x: 90,
          y: 10,
          text: {
            text: "DONE",
            mountX: 1,
            textColor: Colors.WHITE,
            fontFace: 'Medium',
            fontSize: 28,
            textAlign: 'center',
            scaleX: 1
          }
        }
      },
      ConnectDesc: {
        x: 1041,
        y: 400,
        text: {
          text: 'Enter the wifi password here',
          fontSize: 36,
          textColor: Colors.LIGHTER_WHITE,
          fontFace: 'Regular'
        }
      },
      NumberList: {
        type: Lightning.components.ListComponent,
        x: 970,
        y: 648,
        w: 940,
        h: 880,
        itemSize: 90,
        horizontal: true,
        roll: true,
        rollMin: 0,
        rollMax: 0,
        spacing: 10,
        invertDirection: false,
        viewportSize: 1000,
        clipping: true
      },
      AlphabetList: {
        type: Lightning.components.ListComponent,
        x: 980,
        y: 700,
        w: 940,
        h: 880,
        itemSize: 100,
        horizontal: true,
        roll: true,
        rollMin: 0,
        rollMax: 0,
        spacing: 10,
        invertDirection: false,
        viewportSize: 1000,
        clipping: true
      }
    }
  }

  _init() {
    this.numberList = this.createKeyboardArray(StringConstants.DIGITS)
    this.tag('NumberList').items = this.numberList.map((i, index) => {
      return {
        ref: 'Tile_' + index,
        type: KeyboardItem,
        items: i
      }
    })
    this._alphabetList(StringConstants.LOWERCASE_ALPHABETS)
  }


  /**
   * Adds characters to list component corresponding to alphabets
   * @param {} v 
   */
  _alphabetList(v) {
    this.alphList = this.createKeyboardArray(v)
    this.tag('AlphabetList').items = this.alphList.map((i, index) => {
      return {
        ref: 'Tile_' + index,
        type: KeyboardItem,
        alphabets: i
      }
    })
  }

  _active() {
    this._setState('Keystate')
  }

  /**
   * Util method to create array of characters from the string
   * @param {} input 
   */
  createKeyboardArray(input) {
    let charactersArray = input.split(",")
    let elementArray = []
    for (let element in charactersArray) {
      elementArray.push({ menuName: charactersArray[element] })
    }
    return elementArray
  }

  _reset(list) {
    list.start()
    this.current = this.tag('NumberList').element
  }

  static _states() {
    return [
      class Keystate extends this {
        $enter() {
          Log.info(' Keystate ')
        }
        _handleLeft() {
          if (0 != this.tag('NumberList').index) {
            this.tag('NumberList').setPrevious()
          }
        }
        _handleRight() {
          if (this.tag('NumberList').length - 1 != this.tag('NumberList').index) {
            this.tag('NumberList').setNext()
          }
        }
        _getFocused() {
          return this.tag('NumberList').element
        }
        _handleEnter() {
          if (this.tag('NumberList').element._menuName !== 'Del') {
            this.tag('Pass').tag('Text').text.text += this.tag('NumberList').element._menuName
            this.tag('Pass').tag('Mask').text.text += '*'
          }
          if (this.tag('NumberList').element._menuName === 'Del') {
            this.tag('Pass').tag('Text').text.text = this.tag('Pass').tag('Text').text.text.slice(0, -1)
            this.tag('Pass').tag('Mask').text.text = this.tag('Pass').tag('Mask').text.text.slice(0, -1)
          }
        }
        _handleDown() {
          this._reset(this.tag('AlphabetList'))
          this.tag('NumberList').element.tag('Label').text.textColor = Colors.FLUORESCENT_GREEN;
          this.tag('AlphabetList').element.tag('Label').text.textColor = Colors.WHITE;
          this._setState('AlphabetRow')
        }
        $exit() {
          Log.info('EXIT KeyState')
        }
      },
      class AlphabetRow extends this {
        $enter() {
          Log.info(' AlphabetRow state entered ')
        }
        _handleLeft() {
          if (0 != this.tag('AlphabetList').index) {
            this.tag('AlphabetList').setPrevious()
          }
        }
        _getFocused() {
          return this.tag('AlphabetList').element
        }
        _handleDown() {
          this.tag('AlphabetList').element.tag('Label').text.textColor = Colors.FLUORESCENT_GREEN;
          this._setState('EnterKeyState')
        }
        _handleRight() {
          if (this.tag('AlphabetList').length - 1 != this.tag('AlphabetList').index) {
            this.tag('AlphabetList').setNext()
          }
        }
        _handleEnter() {
          if (this.tag('AlphabetList').element._menuName !== 'Caps') {
            this.tag('Pass').tag('Text').text.text += this.tag('AlphabetList').element._menuName
            this.tag('Pass').tag('Mask').text.text += '*'
          }

          if (this.tag('AlphabetList').element._menuName === 'Caps') {
            this._index = this.tag('AlphabetList').index
            this.nextElement = this.tag('AlphabetList').getElement(this._index + 1)._menuName
            if (this.nextElement === 'a') {
              this._alphabetList(StringConstants.UPPERCASE_ALPHABETS)
            }
            else if (this.nextElement === 'A') {
              this._alphabetList(StringConstants.LOWERCASE_ALPHABETS)
            }
          }
        }
        _handleUp() {
          this._reset(this.tag('NumberList'))
          this.tag('NumberList').element.tag('Label').text.textColor = Colors.WHITE;
          this.tag('AlphabetList').element.tag('Label').text.textColor = Colors.FLUORESCENT_GREEN;
          this._setState('Keystate')
        }
        _handleBack() {
          this.fireAncestors('$setWifiScreen')
        }
        $exit() {
          Log.info('EXIT AlphabetRow state  ')
        }
      },

      class EnterKeyState extends this {
        $enter() {
          Log.info('EXIT EnterKeyState state  ')
          this.patch({ EnterKey: { color: Colors.FLUORESCENT_GREEN, Text: { text: { textColor: Colors.DARK_BLACK, scaleX: 1.2 } } } })
        }
        _handleEnter() {
          this.fireAncestors('$connectDesc', "Connecting...");
          this.fireAncestors('$connectWifi', this.tag('Pass').tag('Text').text.text)
          Log.info(this.tag('Pass').tag('Text').text.text)
        }
        _handleUp() {
          this.tag('AlphabetList').element.tag('Label').text.textColor = Colors.WHITE;
          this._setState('AlphabetRow')
        }
        _handleBack() {
          this.fireAncestors('$setWifiScreen')
        }
        $exit() {
          Log.info('EXIT EnterKeyState  ')
          this.patch({ EnterKey: { color: Colors.SLATE_GREY, Text: { text: { textColor: Colors.LIGHTER_WHITE } } } })
        }
      }
    ]
  }
}
