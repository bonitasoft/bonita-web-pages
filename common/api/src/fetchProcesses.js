
import fetchApi from './fetchApi';
import fetchCategoriesByProcess from "./fetchCategoriesByProcess";

import concat from 'async/concat';


export default function({ category, order = 'ASC', search = '', page = 0, count = 10 }) {
  var promise = fetchApi.get(
    '/bonita/API/bpm/process',
    {
      'p': page,
      'c': count,
      'o': 'displayName ' + order,
      's': search,
      'f': (category.id) ? { 'categoryId': category.id } : { 'activationState': 'ENABLED' }
    }
  );


  // rewrite then to be able to chain then and populateCategories,i.e. promise.then(thenCallback).populateCategories(populateCallback);
  promise._then = promise.then;
  promise.then = (thenCallback) => { // no need to pass errCallback because fetchApi already handle network errors
    const promise2 = new Promise((resolve) => {
      promise._then(({ data: processes, pagination }) => {
        processes.forEach((process) => process.categories = []);

        thenCallback({ data: processes, pagination });
        resolve(processes);
      });
    });

    return {
      populateCategories: (populateCallback) => promise2.then((processes) => concat( // get processes then concat fetches
        processes, // pass each process to the following function (that is the next argument passed to concat)
        (process, cb) => fetchCategoriesByProcess(process.id) // fetch categories for each process
          .then(({ data: categories }) => { process.categories = categories; cb(null, process); }),
        (err, processes) => populateCallback(processes) // get all processes with categories populated
      ))
    }
  };

  return promise;
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
