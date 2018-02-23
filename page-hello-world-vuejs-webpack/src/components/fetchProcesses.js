
const options = {
  method: 'GET',
  credentials: 'same-origin', // automatically send cookies for the current domain
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'Cookie': document.cookie,
    'Access-Control-Allow-Origin': '*'
  },
  mode: 'cors',
  cache: 'default'
}

const url = '/bonita/API/bpm/process?p=0&c=10&o=displayName ASC&f=activationState=ENABLED'

// return a promise with processes as the first parameter
export default function () {
  return fetch(url, options)
    .then(function (response) {
      if (response.ok) {
        return Promise.resolve(response.json())
      }
      return Promise.reject(response.error())
    })
}

/* A process looks like that :
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
