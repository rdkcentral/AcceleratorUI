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
import { Lightning, Log, Language, Storage } from '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
import { PowerSettingsTile } from './PowerSettingsTile'
import { ThunderPowerService } from '../../thunder/ThunderPowerService'

/**
 * @export
 * @class BluetoothPairScreen
 * @extends Lightning.Component
 * Renders BluetoothPair Screen
 */

export class PowerSettingsParingScreen extends Lightning.Component {
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
          x: 260,
          y: 430,
          text: {
            text: Language.translate('Power Mode'),
            fontSize: 58,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Regular'
          }
        },
        PairSubHeader: {
          x: 260,
          y: 518,
          text: {
            text: Language.translate('STANDBY'),
            fontSize: 32,
            textColor: Colors.LIGHTER_WHITE,
            fontFace: 'Regular'
          }
        },
        PairDesc: {
          x: 260,
          y: 606,
          text: {
            text: Language.translate('Do you really want to proceed?'),
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
      PowerButton: {
        x: 1041,
        y: 434,
        type: PowerSettingsTile,
        label: Language.translate('Proceed')
      },
      CancelButton: {
        x: 1041,
        y: 556,
        type: PowerSettingsTile,
        label: Language.translate('Cancel')
      },
      ThunderPowerService: {
        type: ThunderPowerService
      }
    }
  }

  /**
   * Sets state to PairAndConnect while active
   */
  _active() {
    this.tag('LeftBg').patch({
      PairSubHeader: { text: { text: Storage.get('selectedPowerState') } }
    })
    this._setState('Power')
  }

  /**
   * @static
   * @returns
   * @memberof BluetoothPairScreen
   * BlueToothPairScreen states
   */
  static _states() {
    return [
      class Power extends this {
        $enter() {
          Log.info('Enter')
        }
        _handleEnter() {
          console.log(
            'Ptag: In PowerSettingsPairpage handle enter..........',
            Storage.get('selectedPowerState')
          )
          this.tag('ThunderPowerService').setPowerState(Storage.get('selectedPowerState'))
        }
        _getFocused() {
          return this.tag('PowerButton')
        }
        _handleDown() {
          this._setState('Cancel')
        }
      },
      class Cancel extends this {
        $enter() {
          Log.info('Enter')
        }
        _handleEnter() {
          this.fireAncestors('$PowerSettingsScreen')
        }
        _getFocused() {
          return this.tag('CancelButton')
        }
        _handleUp() {
          this._setState('Power')
        }
      }
    ]
  }
}
