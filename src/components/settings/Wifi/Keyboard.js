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
import { Lightning, Log } from  '@lightningjs/sdk'
import { Colors } from '../../../constants/ColorConstants'
import { KeyboardItem} from './KeyboardItem'

export class Keyboardscreen extends Lightning.Component {
 
  static _template() {
    return {
      RightBg: {
        x: 960,
        y: 610,
        rect: true,
        w: 960,
        h: 150,
        color: Colors.FLUORESCENT_GREEN,
        alpha:0.25,
      },
      Pass : {
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
            fontSize: 28
          }
        }
      },
      EnterKey:{
        rect: true,
        x: 1560,
        y: 830,
        w: 280,
        h: 60,
        color: Colors.SLATE_GREY,
        alpha:0.8,
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
            scaleX:1
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
        x: 980,
        y: 648,
        w: 960,
        h: 880,
        itemSize: 70,
        horizontal: true,
        roll: true,
        rollMin: 0,
        rollMax: 0,
        spacing: 30,
        invertDirection: false,
        viewportSize: 1000,
        clipping:true
      },
    }
  }

  _init() {
    
    this.tag('NumberList').items = [
      {
        menuName: '1'
      },
      {
        menuName: '2'
      },
      {
        menuName: '3',
      },
      {
        menuName:'4'
      },
      {
        menuName: '5'
      },
      {
        menuName: '6'
      },
      {
        menuName: '7'
      },
      {
        menuName: '8'
      },
      {
        menuName: '9'
      },
      {
        menuName: '0'
      },
      {
        menuName: 'DEL'
      }
    ].map((data, index) => {
      return {
        ref: 'CategoryItem_' + index,
        type: KeyboardItem,
        items: data
      }
    })
  }

  set items(v) {
    this._menuN0 = v.menuName
  }  
  
  _active() {
    this._setState('Keystate')
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
        if(this.tag('NumberList').element._menuName !=='DEL'){
          this.tag('Pass').tag('Text').text.text += this.tag('NumberList').element._menuName
        }
        if(this.tag('NumberList').element._menuName==='DEL')
        {
          let a = this.tag('Pass').tag('Text').text.text
          let b=a.slice(0, -1) 
          this.tag('Pass').tag('Text').text.text=b
        }
      }
      _handleDown() {
        this.tag('NumberList').element.tag('Label').text.textColor = Colors.FLUORESCENT_GREEN;
        this._setState('EnterKeystate')
        }
      },
      class EnterKeystate extends this {
        $enter() {
          this.patch({EnterKey:{color:Colors.FLUORESCENT_GREEN,Text:{text: { textColor: Colors.DARK_BLACK,scaleX:1.2}}}})
        }
        _handleEnter() {
          this.fireAncestors('$connectDesc', "Connecting...");
          this.fireAncestors('$connectWifi', this.tag('Pass').tag('Text').text.text)      
        }
        _handleUp() {
          this.tag('NumberList').element.tag('Label').text.textColor = Colors.WHITE;
          this._setState('Keystate')
        }
        _handleBack() {
          this.fireAncestors('$setWifiScreen')
        }
        $exit() {
          Log.info('EXIT EnterKeystate  ')
          this.patch({EnterKey:{color:Colors.SLATE_GREY,Text:{text: { textColor: Colors.LIGHTER_WHITE}}}})
        }
      }
    ]
  }
}
