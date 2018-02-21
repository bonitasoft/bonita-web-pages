
const headers = new Headers();
headers.append("Cookie", "bonita.tenant=1; JSESSIONID=733080364D74D5E1DAA92A1CD5226ADB; BOS_Locale=en; X-Bonita-API-Token=a167bce7-6cd5-4e8c-9f63-f2c731d6d161");
headers.append("Access-Control-Allow-Origin", "*"); //to allow cross-origin requests

const myInit = {
    method: 'GET',
    headers,
    mode: 'cors',
    cache: 'default'
};

const url = 'http://localhost:8080/bonita/API/bpm/process?p=0&c=10&o=displayName ASC&f=activationState=ENABLED';


//return a promise with processes as the first parameter
export default function() {
   return fetch(url, myInit)
       .then(function(response) {
           if (response.ok) {
               return response.blob();
           } else {
               console.log('error while fetching processes');
           }
       });
}



// A process looks like that :
/*
{
    "displayDescription": "",
    "deploymentDate": "2018-02-14 12:18:34.254",
    "displayName": "Pool",
    "name": "Pool",
    "description": "",
    "deployedBy": "4",
    "id": "7544905540282516773",
    "activationState": "ENABLED",
    "version": "1.0",
    "configurationState": "RESOLVED",
    "last_update_date": "2018-02-14 12:18:34.723",
    "actorinitiatorid": "1"
}
*/