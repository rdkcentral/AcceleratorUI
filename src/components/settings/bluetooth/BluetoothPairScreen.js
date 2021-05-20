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
import { BluetoothTile } from './BluetoothTile'

/**
 * @export
 * @class BluetoothPairScreen
 * @extends Lightning.Component
 * Renders BluetoothPair Screen
 */

export class BluetoothPairScreen extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof BluetoothPairScreen
   * Renders the template
   */
  static _template() {
    return {
      LeftBg: {
        x: 0,
        y: 0,
        rect: true,
        color: Colors.DIM_BLACK,
        w: 960,
        h: 1080,
        PairHeader: {
          x: 160,
          y: 430,
          text: {
            text: 'Pair and Connect',
            fontSize: 58,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Regular'
          }
        },
        PairDesc: {
          x: 160,
          y: 518,
          text: {
            text: 'To pair and connect your BT RCU \n \n1.Press and hold "OK" and "VOL UP" keys in RCU \n \n2. Select "Pair and Connect" option. \n \n3. Release the keys',
            fontSize: 21,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Regular'
          }
        }
      },
      RightBg: {
        x: 960,
        y: 0,
        rect: true,
        w: 960,
        h: 1080,
        color: Colors.BG_GREY
      },
      PairButton: { x: 1041, y: 434, type: BluetoothTile, label: 'Pair and Connect' },
      DontConnectButton: { x: 1041, y: 556, type: BluetoothTile, label: 'Disconnect' }
    }
  }

  /**
   * Sets state to PairAndConnect while active
   */
  _active() {
    this._setState('PairAndConnect')
  }

  /**
   * @static
   * @returns
   * @memberof BluetoothPairScreen
   * BlueToothPairScreen states
   */
  static _states() {
    return [
      class PairAndConnect extends this {
        $enter() {
          Log.info('Enter')
        }
        _handleEnter() {
          this.fireAncestors('$pairConnect')
        }
        _getFocused() {
          return this.tag('PairButton')
        }
        _handleDown() {
          this._setState('DontConnect')
        }
      },
      class DontConnect extends this {
        $enter() {
          Log.info('Enter')
        }
        _handleEnter() {
          this.fireAncestors('$disconnectRemote')
          this.fireAncestors('$setBluetoothScreen')
        }
        _getFocused() {
          return this.tag('DontConnectButton')
        }
        _handleUp() {
          this._setState('PairAndConnect')
        }
      }
    ]
  }
}
