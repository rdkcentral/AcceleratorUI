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
import { Lightning, Log, Utils } from 'wpe-lightning-sdk'
import MediaPlayerExtended from './MediaPlayerExtended'
import { PlayerUI } from './PlayerUI'
import { ImageConstants } from '../../constants/ImageConstants'
/**
 * @export
 * @class GalleryView
 * @extends {Lightning.Component}
 * Render mediaplayer for the playback of clear contents
 */
export class Player extends Lightning.Component {
  static _template() {
    return {
      MediaPlayer: { type: MediaPlayerExtended },
      PlayerUI: { type: PlayerUI, visible: false },
      DownArrow: { x: 930, y: 980, src: Utils.asset(ImageConstants.DOWN), zIndex: 3 }
    }
  }
  /**
   * Function to set the speed of playback.
   * Initial playback speed set to 1 and speed increases to 2,4,16 on fastforward.
   */
  _init() {
    this._previousChannel = null
    this._nextChannel = null
    this.playbackSpeeds = [1, 2, 4, 16]
    this.playbackRateIndex = this.playbackSpeeds.indexOf(1)
    this.tag('MediaPlayer').videoEl.setAttribute('crossOrigin', 'anonymous')
    this.tag('MediaPlayer').updateSettings({ consumer: this, videoPos: [0, 0, 1920, 1080] })
    this.tag('MediaPlayer').videoEl.autoplay = true
  }

  /**
   * Function to hide the PlayerUI
   */
  hide() {
    this.tag('DownArrow').visible = true
    this.tag('PlayerUI').hidePlayerUI()
    this._setState('PlaybackState')
  }

  setPlayerControls() {
    this._setState('PlayerControlState')
  }

  $exitPlayerControl() {
    this.tag('DownArrow').visible = true
    this._setState('PlaybackState')
  }

  reset() {
    this.tag('PlayerUI').resetPlayerControls()
  }

  set previousChannel(v) {
    this._previousChannel = v
  }

  set nextChannel(v) {
    this._nextChannel = v
  }

  /* Loads the player with video URL.
   * @param {JSON} videoInfo the url and the info regarding the video like title.
   */
  load(videoInfo) {
    this._videoInfo = videoInfo
    Log.info(videoInfo, 'videoInfo')
    if (videoInfo.videourl.includes('.mp4') || videoInfo.videourl.includes('.webm')) {
      this.tag('MediaPlayer').open(videoInfo.videourl)
    } else if (videoInfo.videourl.includes('.m3u8')) {
      this.tag('MediaPlayer').openHls(videoInfo.videourl)
    } else if (videoInfo.videourl.includes('.mpd')) {
      this.tag('MediaPlayer').openDash(videoInfo.videourl)
    }
    this.tag('PlayerUI').channelData = videoInfo
  }

  /**
   * Function to load Previous video
   */
  $lastVideo() {
    this.$stop()
    this.reset()
    this.load(this._previousChannel)
  }

  /**
   * Function to load next video
   */
  $nextVideo() {
    this.$stop()
    this.reset()
    this.load(this._nextChannel)
  }

  /**
   * Function to stop the video playback.
   */
  $stop() {
    this.tag('MediaPlayer').close()
  }

  /**
   * Function to start the video playback.
   */
  $doPlayPause() {
    this.tag('MediaPlayer').playPause()
  }

  /**
   * Function to start the video playback.
   */
  doPlay() {
    this.tag('MediaPlayer').doPlay()
  }

  /**
   * Function to pause the video playback.
   */
  doPause() {
    this.tag('MediaPlayer').doPause()
  }

  /**
   * Function to perform fast forward of the video content.
   */
  $fastfwd() {
    if (this.playbackRateIndex < this.playbackSpeeds.length - 1) {
      this.playbackRateIndex++
    }
    this.rate = this.playbackSpeeds[this.playbackRateIndex]
    this.tag('MediaPlayer').videoEl.playbackRate = this.rate
  }

  /**
   * Function to perform fast rewind of the video content.
   */
  $rewind() {
    if (this.playbackRateIndex > 0) {
      this.playbackRateIndex--
    }
    this.rate = this.playbackSpeeds[this.playbackRateIndex]
    this.tag('MediaPlayer').videoEl.playbackRate = this.rate
  }

  /**
   * Event handler that gets fired when the media content ends.
   */
  $mediaplayerEnded() {
    if (this._videoInfo.loop == true) {
      this.doPlay()
    }
    Log.info('End of Playback')
  }

  /**
   * Event handler that gets fired when the media content is in progress.
   */
  $mediaplayerProgress({ currentTime, duration }) {
    this.tag('PlayerUI').mediaplayerProgress(currentTime, duration)
  }

  /**
   * @static
   * @returns
   * @member Player
   * Player States
   */
  static _states() {
    return [
      class PlayerControlState extends this {
        $enter() {
          Log.info('\n Player Control state  ')
          this.tag('PlayerUI').showPlayerUI()
          this.tag('DownArrow').visible = false
        }
        _getFocused() {
          Log.info('Player UI Focus')
          return this.tag('PlayerUI')
        }

        $exit() {
          this.tag('PlayerUI').hidePlayerUI()
        }
      },
      class PlaybackState extends this {
        $enter() {
          this.tag('PlayerUI').hidePlayerUI()
        }
      }
    ]
  }
}
