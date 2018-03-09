
import fetchApi from './fetchApi';

export default function({ category, order = 'ASC', search = '', page = 0, count = 10 }) {
  return fetchApi.get(
    '/bonita/API/bpm/process',
    {
      'p': page,
      'c': count,
      'o': 'displayName ' + order,
      's': search,
      'f': (category.id) ? { 'categoryId': category.id } : { 'activationState': 'ENABLED' }
    }
  )
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
