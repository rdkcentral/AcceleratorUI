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
import { Utils } from '@lightningjs/sdk'
/**
 * @export
 * @class DataService
 * Data Service Class.
 */
export class DataService {
  //TODO : All these function implementations need to be revisited, once service APIs are integrated
  getAppData() {
    const promises = [this._getGalleryData()]
    return Promise.all(promises)
  }
  getChannelData() {
    const promises = [this._getChannelData()]
    return Promise.all(promises)
  }
  getVodData() {
    const promises = [this._getVodData()]
    return Promise.all(promises)
  }
  getVodMoviesData() {
    const promises = [this._getVodMoviesData()]
    return Promise.all(promises)
  }
  getVodShowsData() {
    const promises = [this._getVodShowsData()]
    return Promise.all(promises)
  }

  /**
   *
   * @returns {Object}
   * @memberof DataService
   * Method to return the GalleryView Data.
   */
  async _getGalleryData() {
    const recommended = await fetch(Utils.asset('data/Recommended.json'))
    const recommendedData = await recommended.json()
    const apps = await fetch(Utils.asset('data/Apps.json'))
    const appsData = await apps.json()
    const metroapps = await fetch(Utils.asset('data/MetroApps.json'))
    const metroappsData = await metroapps.json()
    return [
      { ref: 'Recommended for you ', data: recommendedData },
      { ref: 'Premium Apps', data: appsData },
      { ref: 'Metrological Appstore Experience', data: metroappsData }
    ]
  }

  /**
   *
   * @returns {Object}
   * @memberof DataService
   * Method to return the Channel Data.
   */
  async _getChannelData() {
    const ChannelList = await fetch(Utils.asset('data/Channels.json'))
    const channel = await ChannelList.json()
    return { data: channel }
  }

  /**
   *
   * @returns {Object}
   * @memberof DataService
   * Method to return the Vod Data.
   */
  async _getVodData() {
    const newmovies = await fetch(Utils.asset('data/NewMovies.json'))
    const newmoviesData = await newmovies.json()
    const newtvshows = await fetch(Utils.asset('data/NewTVShows.json'))
    const newtvshowsData = await newtvshows.json()
    const continuewatching = await fetch(Utils.asset('data/ContinueWatching.json'))
    const continuewatchingData = await continuewatching.json()

    return [
      { ref: 'New Movies ', data: newmoviesData },
      { ref: 'New TV Shows', data: newtvshowsData },
      { ref: 'Continue Watching', data: continuewatchingData }
    ]
  }

  /**
   *
   * @returns {Object}
   * @memberof DataService
   * Method to return the Movies Data.
   */
  async _getVodMoviesData() {
    const recommendedmovies = await fetch(Utils.asset('data/RecommendedMovies.json'))
    const recommendedmoviesData = await recommendedmovies.json()
    const freemovies = await fetch(Utils.asset('data/FreeMovies.json'))
    const freemoviesData = await freemovies.json()
    const paidmovies = await fetch(Utils.asset('data/PaidMovies.json'))
    const paidmoviesData = await paidmovies.json()

    return [
      { ref: 'Recommended Movies', data: recommendedmoviesData },
      { ref: 'Free Movies', data: freemoviesData },
      { ref: 'Paid Movies', data: paidmoviesData }
    ]
  }

  /**
   *
   * @returns {Object}
   * @memberof DataService
   * Method to return the VodShows Data.
   */
  async _getVodShowsData() {
    const recommendedshows = await fetch(Utils.asset('data/RecommendedShows.json'))
    const recommendedshowsData = await recommendedshows.json()
    const freeshows = await fetch(Utils.asset('data/FreeShows.json'))
    const freeshowsData = await freeshows.json()
    const paidshows = await fetch(Utils.asset('data/PaidShows.json'))
    const paidshowsData = await paidshows.json()

    return [
      { ref: 'RecommendedShows', data: recommendedshowsData },
      { ref: 'Free Shows', data: freeshowsData },
      { ref: 'Paid Shows', data: paidshowsData }
    ]
  }
}
