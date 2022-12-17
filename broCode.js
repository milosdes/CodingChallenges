/**
 * @param {Object} query - each key has value of a query string
 * @param {Object} ref - each key has value of a ref string
 * @param {Boolean} log - optional logging of search
 *
 * This method searches through query strings finding all matches of each ref string (with no overlapping)
 * Returns an object containing an array of found matches for each query string. This array is stored as a value under the same key as the original query string.
 */

let extractSearch = function (query, ref, log = false) {
  let result = {};

  //loop through all query strings
  for (let qKey in query) {
    let queryString = query[qKey];

    //for each query string, loop through all refs
    for (let rKey in ref) {
      let refString = ref[rKey];
      if (log) console.log(`Searching for ${refString} in ${queryString}`);

      //helper function to search each query for multiple matches
      let recursiveSearch = (startIndex) => {
        //if a match is found
        if (queryString.indexOf(refString, startIndex) >= 0) {
          //and if the current results object doesn't have the query key
          if (!(qKey in result)) {
            //initialize results object with query key and store first result
            result[qKey] = [
              {
                qKey: query[qKey],
                rKey: ref[rKey],
                start: queryString.indexOf(refString) + startIndex,
                stop:
                  queryString.indexOf(refString) +
                  refString.length +
                  startIndex,
              },
            ];

            //optional log
            if (log)
              console.log(`===== found ${ref[rKey]} in ${query[qKey]} =====`);

            //call recursive search function beginning at end of last result
            let nextIndex = queryString.indexOf(refString) + refString.length;
            recursiveSearch(nextIndex);

            //if there is already a key in the results object that matches query key
          } else {
            //push new result onto array (a list in python)
            result[qKey].push({
              qKey: query[qKey],
              rKey: ref[rKey],
              start: queryString.indexOf(refString, startIndex),
              stop:
                queryString.indexOf(refString, startIndex) + refString.length,
            });
            if (log)
              console.log(`===== found ${ref[rKey]} in ${query[qKey]} =====`);

            //if the end of the string has not been reached, call recursive search function again beginning at end of last result
            let nextIndex =
              queryString.indexOf(refString, startIndex) + refString.length;
            recursiveSearch(nextIndex);
          }
        }
      };

      //start helper function at index of 0
      //iterates through query strings, and each time a match is found it recursively
      //looks for more matches in the same string
      recursiveSearch(0);
    }
  }
  return result;
};

//example
//run with nodejs or by copy and pasting this entire script into browser console or chrome snippets

let Queries = {
  q1: 'string one one',
  q2: 'string two',
  q3: 'stavffring three',
  q4: 'eaffjo/13:"afej',
  q4: 'aaaaaaAAAaaaa',
};

let References = {
  r1: 'one',
  r2: 'two',
  r3: 'three',
  r4: 'string',
  r5: 'avff',
  r6: '/13:"',
  r7: 'a',
  //an example of no-overlapping
  r8: 'aaa',
};

console.log(extractSearch(Queries, References, true));
