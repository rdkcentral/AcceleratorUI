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
import { Lightning, Utils } from '@lightningjs/sdk'
import { Tile } from './GalleryTile'
import { ScrollableList } from './ScrollableList'
import { ImageConstants } from '../../../constants/ImageConstants'
import { Colors } from '../../../constants/ColorConstants'
var List = [];
var header_Font="";
var header_fontColor='0xfff1f1f1';
/**
 * @export
 * @class GalleryView
 * @extends {Lightning.Component}
 * Renders the Gallery View.
 */
export class GalleryView extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof GalleryView
   * Renders the template
   */
  static _template() {
    return {
      GalleryRowList: {
        x: 232,
        y: 296,
        w: 1690,
        h: 1000,
        type: Lightning.components.ListComponent,
        horizontal: false,
        spacing: 72,
        roll: true,
        rollMin: 0,
        rollMax: 400,
        itemSize: 250,
        viewportSize: 700,
        invertDirection: true,
        clipping: true,
        rect: true,
        color: Colors.TRANSPARENT
      },
      Down: { x: 930, y: 980, src: Utils.asset(ImageConstants.DOWN), zIndex: 3, visible: true }
    }
  }

    _init() {
     const xhr = new XMLHttpRequest();    
           xhr.open('GET', "http://"+ window.serverdata.Server_ip + ":" + window.serverdata.Server_port +"/CustomUI/getPosition?customer_id="+window.serverdata.serial_number);
           xhr.responseType = 'json';
           xhr.onload = () => {
             if(xhr.status === 200) {
              List = xhr.response;
              this.getData()             
             }  
           };
           xhr.send();
           this.current = this.tag('GalleryRowList').element
       this._setState('GalleryViewState') 
      }

  getData() {
      for (var i = 0; i < List.length; i++) {
        if (List[i] == "Recommended for you") {
          this.tag('GalleryRowList').items = {
            Recommended: {
              type: ScrollableList,
              horizontal: true,
              itemSize: 520,
              spacing: 70,
              rollMax: 1400,
              headerFont:header_Font,
              headerfontColor:header_fontColor
            }
          }
        }
        else if (List[i] == "premium Apps") {
          this.tag('GalleryRowList').items = {
            Apps: {
              type: ScrollableList,
              horizontal: true,
              itemSize: 260,
              spacing: 20,
              headerFont:header_Font,
             headerfontColor:header_fontColor
            }
          }
        }
        else if (List[i] == "metro Apps") {
          this.tag('GalleryRowList').items = {
            MetroApps: {
              type: ScrollableList,
              horizontal: true,
              itemSize: 260,
              spacing: 20,
              headerFont:header_Font,
              headerfontColor:header_fontColor
            }
          }
        }
      }
      if(List.indexOf("Recommended for you") == 0) {
        this.tag('GalleryRowList').itemSize = 400;
        this.tag('GalleryRowList').items[2].patch({ y: -140, alpha: 1 })
      } else if(List.indexOf("Recommended for you") == 1) {
        this.tag('GalleryRowList').itemSize = 250;
        this.tag('GalleryRowList').items[2].patch({ y: 140, alpha: 1 })
      }      
  }
  
  set theme(v)
  {
  console.log(v["home"].bg_image)
 
   header_Font= v["home"].fontFace;
   header_fontColor =v["home"].text_fontColor
  }
  /**
   * Sets data in Tile component through data passed from JSON file
   */
   
  set data(v) {
    if(List.length == 0) {
      List = ["Recommended for you","premium Apps","metro Apps"]
      this.getData()
    }
    for(var i=0;i<v.length;i++)
  {
  if(v[i].ref == "Recommended for you ")
  {
    this.tag('GalleryRowList').items[List.indexOf("Recommended for you")].header = v[i].data.header|| ""
    this.tag('GalleryRowList').items[List.indexOf("Recommended for you")].items = (v[i].data.assets || []).map((data, index) => {
      return {
        ref: 'Tile_' + index,
        type: Tile,
        image: data.url,
        category: data.category,
        title: data.title,
        duration: data.Duration,
        w: 500,
        h: 282,
        offset: 30,
        scaleX: 1.1,
        scaleY: 1.1,
        highlight: true,
        videoData: {
          title: data.title,
          videourl: data.videourl,
          name: data.name,
          category: data.category,
          logoPath: data.logoPath,
          number: data.number
        }
      }
    })
  }
  if(v[i].ref == "Premium Apps")
    {
    this.tag('GalleryRowList').items[List.indexOf("premium Apps")].header = v[i].data.header|| ""
    this.tag('GalleryRowList').items[List.indexOf("premium Apps")].items = (v[i].data.assets || []).map((data, index) => {
      return {
        ref: 'Tile_' + index,
        type: Tile,
        image: data.url,
        w: 240,
        h: 135,
        scaleX: 1.2,
        scaleY: 1.2,
        appData: { url: data.appUrl, title: data.title }
      }
    })
  }
  if(v[i].ref == "Metrological Appstore Experience")
    {
   //this.tag('GalleryRowList').items[List.indexOf("metro Apps")].patch({ y: 140, alpha: 1 })
    this.tag('GalleryRowList').items[List.indexOf("metro Apps")].header = v[i].data.header|| ""
    this.tag('GalleryRowList').items[List.indexOf("metro Apps")].items = (v[i].data.assets || []).map((data, index) => {
      return {
        ref: 'Tile_' + index,
        type: Tile,
        image: data.url,
        w: 240,
        h: 135,
        scaleX: 1.2,
        scaleY: 1.2,
        appUrl: data.appUrl
      }
    })
  }
  }
  }

  _focus() {
    this.tag('GalleryRowList').x = 230
    this.tag('GalleryRowList').w = 1690
  }
  _unfocus() {
    this.tag('GalleryRowList').x = 440
    this.tag('GalleryRowList').w = 1440
  }

  /**
   * To reset the List
   */
  _reset() {
    this.tag('GalleryRowList').start()
    this.current = this.tag('GalleryRowList').element
  }

  /**
   * @static
   * @returns
   * @memberof GalleryView
   * GalleryView States
   */
  static _states() {
    return [
      class GalleryViewState extends this {
        _getFocused() {
          return this.current
        }
        /**
         * Set next gallery row if not on the last row or Remain in the same row on pressing Down Arrow
         * Reset the current row
         */
        _handleDown() {
          if (this.tag('GalleryRowList').length - 1 != this.tag('GalleryRowList').index) {
            this.tag('GalleryRowList').element._reset()
            this.tag('GalleryRowList').setNext()
          }
          this.current = this.tag('GalleryRowList').element
          //Make the down arrow invisible when we scroll to last row
          if (this.tag('GalleryRowList').length - 1 == this.tag('GalleryRowList').index) {
            this.tag('Down').visible = false
          }
        }
        /**
         * Set Apps or Set Player
         */
        _handleEnter() {
          let currentTile = this.current.tag('Wrapper').element
          if (currentTile.videoData) {
            let channelData = currentTile.videoData
            this.fireAncestors('$setPlayer', channelData)
          } else if (this.current.tag('Wrapper').element.appData) {
            let appData = this.current.tag('Wrapper').element.appData
            this.fireAncestors('$setPremiumApp', appData)
          } else if (this.current.tag('Wrapper').element.appUrl) {
            let url = this.current.tag('Wrapper').element.appUrl
            this.fireAncestors('$setMetroApp', url)
          }
        }
        /**
         * Set previous row and reset the gallery tiles
         */
        _handleUp() {
          if (0 != this.tag('GalleryRowList').index) {
            this.tag('GalleryRowList').element._reset()
            this.tag('GalleryRowList').setPrevious()
          }
          this.current = this.tag('GalleryRowList').element
          //Make the down arrow visible on all other cases other than at the last row
          if (this.tag('GalleryRowList').length - 1 != this.tag('GalleryRowList').index) {
            this.tag('Down').visible = true
          }
        }
      }
    ]
  }
}
