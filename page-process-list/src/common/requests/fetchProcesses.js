
import client from '../Client';
import Url from '../Url';

function fetchProcesses({ page = 0, count = 10 } = {}, options) {

  const url = new Url('/bonita/API/bpm/process');
  url.append({
    'p': page,
    'c': count
  });

  return client.get(url.get(), options)
               .then(response => response.json(), err => console.error(err))
               .then(processes => processes.map(process => ({ ...process, categories: [] })));

}


export default fetchProcesses

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
