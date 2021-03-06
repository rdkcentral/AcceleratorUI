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
export class TimeUtils {
  /**
   * The function returns the current time
   */
  getCurrentTime() {
    let date = new Date()
    let time =
      (date.getHours() % 12 == 0 ? '12' : date.getHours() % 12) +
      ':' +
      (date.getMinutes() + '').padStart(2, '0') +
      (date.getHours() >= 12 ? ' PM' : ' AM')
    return time
  }
}
