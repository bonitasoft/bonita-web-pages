
import fetchApi from './fetchApi';

export default (processId) => fetchApi.get(
  '/bonita/API/bpm/category',
  {
    'p': 0,
    'c': Number.MAX_SAFE_INTEGER
  }
)

/* A category looks like that :
{
  "createdBy":"4",
  "displayName":"azdfesfe",
  "name":"azdfesfe",
  "description":"",
  "creation_date":"2018-03-02 11:05:39.490",
  "id":"101"
}
*/