function countNgrams(arr, n) {
  var reduced = {};
  for (var i=0; i<arr.length; i++) {
    var key = arr[i].join('-');
    if (reduced[key]) {
      reduced[key][n]++;
    }
    else {
      arr[i][n] = 1;
      reduced[key] = arr[i];
    }
  }
  return reduced;
}

function filterObject(obj, n) {
  freqList = []
  for (var prop in obj) {
    var freqCount = obj[prop][n]
    if (freqCount > 2) {
      freqList.push(obj[prop]);
    }
  }
  return freqList;
}

function sortArray(arr) {
  arr.sort(function(a, b) {
    return a - b;
  })
}

module.exports {countNgrams, filterObject, sortArray}