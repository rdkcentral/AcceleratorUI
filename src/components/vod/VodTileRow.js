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
import { Lightning } from '@lightningjs/sdk'
import { VODTile } from './VodTile'
import { ScrollableList } from '../home/galleryView/ScrollableList'
/**
 * @export
 * @class VODTileRow
 * @extends Lightning.Component
 * Renders the VODTileRow
 */
export class VODTileRow extends Lightning.Component {
  /**
   * @static
   * @returns
   * @memberof VODTileRow
   * Renders the template
   */
  static _template() {
    return {
      TileList: {
        type: ScrollableList,
        horizontal: true,
        itemSize: 400,
        rollMax: 800,
        spacing: 20
      }
    }
  }

  /**
   * Sets the Items in VODTile based on data passed here
   */
  set tileItem(tileItem) {
    this.tag('TileList').header = tileItem.data.header
    this.tag('TileList').items = tileItem.data.assets.map((data, index) => {
      return {
        ref: 'Tile_' + index,
        type: VODTile,
        w: 391,
        h: 282,
        scaleX: 1.1,
        scaleY: 1.05,
        image: data.url,
        title: data.title,
        category: data.category,
        duration: data.Duration,
        cost: data.Cost,
        descriptiontext: data.description,
        descriptiontitle: data.descriptiontitle,
        ratingone: data.Ratingone,
        ratingtwo: data.Ratingtwo,
        ratingthree: data.Ratingthree,
        ratingfour: data.Ratingfour,
        ratingfive: data.Ratingfive,
        channelnumber: data.Channelnumber,
        quality: data.Quality,
        videoData: {
          videourl:
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          category: 'Drama',
          logoPath: 'images/channels/StarMovies.png',
          name: 'Star Movies',
          number: '002',
          title: 'Black Panther'
        }
      }
    })
  }

  /**
   * Changes focus to elements in TileList
   */
  _getFocused() {
    return this.tag('TileList').element
  }
}
