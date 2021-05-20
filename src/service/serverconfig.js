

import { Utils } from '@lightningjs/sdk'


export class ConfigService {

  getserverData() {
    const promises = [this._getserverData()]
      return Promise.all(promises)
  }


  async _getserverData() {
    console.log('inside getserverData');
    //   const recommended = await fetch(Utils.asset('server/Serverconfig.json'));

    const recommended = await fetch('static/server/Serverconfig.json');
    console.log('serverconfig', recommended);
    var serverdata = await recommended.json();
    console.log(serverdata);
    return {data : serverdata}
      //await this.getAppConfiguration();
  }
}
