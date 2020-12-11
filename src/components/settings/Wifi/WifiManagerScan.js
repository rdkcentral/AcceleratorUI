  let ws;
  let wsResps = [];
  const connect = () => {
    return new Promise( (resolve, reject) => {
      ws = new WebSocket('ws://localhost:9998/jsonrpc', 'notification');
      ws.onopen = () => { resolve(ws); };
      ws.onerror = error => { reject(error); };
      ws.onmessage = e => { wsResps.push(e.data); }
    });
  };

  let responseId = 0;
  let pluginName = '';
  let pluginVersion = '';
  const responseTimeout = 10000;
  const checkPeriod = 500;
  let ssids = [];

/**
   * Invoke a method and process response.
   *
   * @param {*} method  The name of the method.
   * @param {*} params  Any parameters as object of names and values.
   * @param {*} timeout Optional timeout to wait for response (defaults to 10s).
   * @param {*} check   Optional function used to check response.
   */
const invoke = (method, params, timeout, check) => {
    return new Promise( (resolve, reject) => {
      const cmd = JSON.stringify({ jsonrpc: '2.0', id: ++responseId, method: pluginName + '.' + pluginVersion + '.' + method, params: params === undefined ? {} : params } );
      ws.send(cmd);
      let interval;
      const checkInputResponses = () => {
        for (let i = 0; i < wsResps.length; i++) {
          const e = wsResps[i];
          const resp = JSON.parse(e);
          if (resp.id !== undefined && resp.id === responseId) {
            if (interval !== undefined) clearInterval(interval);
            wsResps.splice(i, 1);

            if (check !== undefined)
              check(resp.result);
            resolve(resp);
          }
        }
      };
      if (timeout === undefined) timeout = responseTimeout;
      checkInputResponses();
      interval = setInterval(() => {
        checkInputResponses();
        timeout -= checkPeriod;
        if (timeout <= 0) {
          clearInterval(interval);
          reject();
        }
      }, checkPeriod);
    });
  };


/**
   * Wait for an event from Thunder.
   *
   * @param {*} name    The name of the event.
   * @param {*} id      The id of the request associated with the event.
   * @param {*} timeout An optional timeout to override the default one.
   * @param {*} check   Optional function used to check event. Return true if more events in this sequence are expected.
   */
  const waitEvent = (name, id, timeout, check) => {
    return new Promise( (resolve, reject) => {
      // Returns true if the response has been found
      const checkInputResponses = () => {
        for (let i = 0; i < wsResps.length; i++) {
          const resp = JSON.parse(wsResps[i]);
          if (resp.method !== undefined && resp.method === id + '.' + name) {
            console.log('waitEvent ' , id , '.' , name, ' received: ', JSON.stringify(resp.params));
			      ssids = JSON.stringify(resp.params.ssids);
            wsResps.splice(i, 1);

            // Is the response to be checked?
            let finished = true;
            if (check !== undefined) {
              // By returning true it implies that more events of this time are expected
              let moreData = check(resp.params)
              if ((moreData !== undefined) && (moreData === true))
              {
                finished = false;
                console.log('waitEvent expecting more results...');
              }
            }

            if (finished) {
              resolve(resp);
              return true;
            }
          }
        }

        // Haven't found the event
        return false;
      };
      if (timeout === undefined) timeout = responseTimeout;
      if (checkInputResponses())
        return;
      let interval = setInterval(() => {
        // Have we found the response?
        if (checkInputResponses()) {
          clearInterval(interval);
          return;
        }

        // Have we timed out?
        timeout -= checkPeriod;
        if (timeout <= 0) {
          clearInterval(interval);
          reject();
        }
      }, checkPeriod);
    });
  };

pluginName = 'org.rdk.Wifi';
pluginVersion = '1';

export function getAvailableSSIDs() {
  connect()
    .catch( error => { console.log('web socket can\'t be opened: ' + error);})
      .then( () => {
        return invoke('register', { event: 'onAvailableSSIDs', id: 1}, undefined, (result) => {
        });
      })
      .then( () => {
        return invoke('startScan', {incremental: false}, undefined, (result) => {
        });
      })
      .then( () => {
        return waitEvent('onAvailableSSIDs', 1, (params) => {
        });
      });
      setTimeout(setSSIDList(ssids), 8000);
}

export function getSSIDList() {
  return ssids;
}

function setSSIDList(_ssids) {
  ssids=_ssids;
}

//getAvailableSSIDs();
//setTimeout(function() {getSSIDList}()}, 8000)





