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
import { ConfigService } from '../service/serverconfig'

export class AppsConfiguration {
  loadData() {
    const myPromise = new Promise(resolve => {
      this.data = new ConfigService()
      this.data.getserverData().then(data => {
        var serverdata = data[0].data
        this.getAppConfiguration(serverdata)
        this.getMetroApps(serverdata)
        this.recommendedDataConfig(serverdata)
        setTimeout(function() {
          resolve()
        }, 1000)
      })
    })
    return myPromise
  }

  getData(apiRequestUrl) {
    return new Promise(function(resolve) {
      var xmlhttp
      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest()
      } else {
        xmlhttp = new window.ActiveXObject('Microsoft.XMLHTTP')
      }
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            resolve(JSON.parse(xmlhttp.responseText))
          }
        }
      }
      xmlhttp.open('GET', apiRequestUrl, true)
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xmlhttp.send()
    })
  }

  async getAppConfiguration(serverdata) {
    var url = serverdata.SERVER_URL + 'PremiumAppsConfig?operator_id=' + serverdata.OPERATOR_ID
    window.appdataJSON = await this.getData(url)
  }
  getAppStatus() {
    return window.appdataJSON
  }

  async getMetroApps(serverdata) {
    var url = serverdata.SERVER_URL + 'MetroAppsConfig?operator_id=' + serverdata.OPERATOR_ID
    window.metroAppdataJSON = await this.getData(url)
  }

  getMetroAppStatus() {
    return window.metroAppdataJSON
  }

  recommendedDataConfig(serverdata) {
    var url =
      serverdata.SERVER_URL + 'RecommendedVideosConfig?operator_id=' + serverdata.OPERATOR_ID
    this.getData(url).then(v => {
      window.recommendeddataJSON = v
    })
  }
  getRecommendedData() {
    return window.recommendeddataJSON
  }
}
