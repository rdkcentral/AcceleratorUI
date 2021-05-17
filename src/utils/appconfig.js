import { Log,Utils } from '@lightningjs/sdk'
import { ConfigService } from '../service/serverconfig'
import ThunderJS from 'ThunderJS'

export class AppsConfiguration {

loadData(){
 const myPromise = new Promise((resolve, reject) => {
  this.data = new ConfigService()
  this.data.getserverData().then(data => {
  var  serverdata =  data[0].data
  console.log("Constructor serverdata:",serverdata)
  this.getAppConfiguration(serverdata) 
  this.getMetroApps(serverdata);
  this.recommendedDataConfig(serverdata);
  setTimeout(function() {
resolve()
}, 1000)
  })
  });
  return myPromise
}


getData(apiRequestUrl) {
  return new Promise(function (resolve, reject) { 
    var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200) {
        resolve(JSON.parse(xmlhttp.responseText));
        console.log("*******@@App-JSON",JSON.stringify(xmlhttp.responseText));                                                                               }
    }
  };
  xmlhttp.open("GET",apiRequestUrl, true);
  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlhttp.send();
  });

}

async getAppConfiguration(serverdata) {
var url = "http://"+ serverdata.Server_ip + ":" + serverdata.Server_port +"/CustomUI/getPremiumApps?customer_id="+serverdata.serial_number;
window.appdataJSON = await this.getData(url);
}
getAppStatus() {
console.log("inside getAppStatus",window.appdataJSON)
  return window.appdataJSON;
}

async getMetroApps(serverdata) {
var url = "http://"+ serverdata.Server_ip + ":" + serverdata.Server_port +"/CustomUI/getMetroApps?customer_id="+serverdata.serial_number;
window.metroAppdataJSON = await this.getData(url);
  
}

getMetroAppStatus() {
console.log("Metro App Config json",JSON.stringify(window.metroAppdataJSON));
 return window.metroAppdataJSON;
}

 recommendedDataConfig(serverdata) {
var url = "http://"+ serverdata.Server_ip + ":" + serverdata.Server_port +"/CustomUI/getRecommendedData?customer_id="+serverdata.serial_number;
this.getData(url).then(v=>{
window.recommendeddataJSON = v;
});
  
}
getRecommendedData() {
console.log("inside getRecommendedData",window.recommendeddataJSON)
  return window.recommendeddataJSON;
}



}



