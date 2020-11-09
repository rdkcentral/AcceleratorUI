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
import { Colors } from '../../constants/ColorConstants'
/**
 * @export
 * @class VODDescription
 * @extends Lightning.Component
 * Renders the VODDescrption
 */
export class VODDescription extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof VODDescription
   * Renders the template
   */
  static _template() {
    return {
      DescriptionBg: {
        x: 50,
        y: 399,
        rect: true,
        w: 1688,
        h: 147,
        color: Colors.DARK_BLACK,
        DescriptionTitle: {
          x: 157,
          y: 29,
          rect: true,
          w: 203,
          h: 37,
          text: {
            text: '',
            textColor: Colors.WHITE,
            fontFace: 'Medium',
            fontSize: 30
          }
        },
        DescriptionText: {
          x: 157,
          y: 67,
          rect: true,
          w: 904,
          h: 59,
          text: {
            text: '',
            textColor: Colors.MEDIUM_GREY,
            fontFace: 'Regular',
            fontSize: 24
          }
        },
        Divider: {
          x: 1205,
          y: 33,
          rect: true,
          w: 2,
          h: 86,
          color: Colors.SLATE_GREY
        },
        Rating: {
          x: 1358,
          y: 43,
          w: 200,
          rect: true,
          color: Colors.DARK_BLACK,
          flex: {
            direction: 'row',
            wrap: true
          },
          Star1: {
            flexItem: {}
          },
          Star2: {
            flexItem: { marginLeft: 10 }
          },
          Star3: {
            flexItem: { marginLeft: 10 }
          },
          Star4: {
            flexItem: { marginLeft: 10 }
          },
          Star5: {
            flexItem: { marginLeft: 10 }
          }
        },
        Quality: {
          x: 1358,
          y: 88,
          src: ''
        },
        ChannelNumber: {
          x: 1400,
          y: 88,
          src: ''
        }
      }
    }
  }

  /**
   * Sets the elements in Template using data
   */
  set descriptiondata(data) {
    this.data = data
    this.tag('DescriptionTitle').patch({ text: this.data.descriptiontitle })
    this.tag('DescriptionText').patch({ text: this.data.descriptiontext })
    this.tag('Star1').patch({ src: Utils.asset(this.data.ratingone) })
    this.tag('Star2').patch({ src: Utils.asset(this.data.ratingtwo) })
    this.tag('Star3').patch({ src: Utils.asset(this.data.ratingthree) })
    this.tag('Star4').patch({ src: Utils.asset(this.data.ratingfour) })
    this.tag('Star5').patch({ src: Utils.asset(this.data.ratingfive) })
    this.tag('Quality').patch({ src: Utils.asset(this.data.quality) })
    this.tag('ChannelNumber').patch({
      src: Utils.asset(this.data.channelnumber)
    })
  }
}
