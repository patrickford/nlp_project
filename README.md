NLP project
==========================

function findEntities(array) {
  temp = []
  for (var i=0; i<array.length; i++) {
    if (array[i][1] == 'NNP' || array[i][1] == 'NNPS') {
      console.log(array[i])
      temp.push(array[i])
    }
  }
  return temp
}
function sortObject(obj) {
  var sortable = [];
  for (var token in obj)
      sortable.push([token, obj[token]])
      sortable.sort(function(a, b) {
      return b[1] - a[1];
  })
  return sortable;
}

function sortArray(oldArray) {
  var newArray = [];
  for (i=0; i<oldArray.length; i++) {
    newArray.sort(function(a,b) {
      return b[2] - a[2];
    })
  }
  return newArray;
}

const findSyns  = function(word) {
  var synset = [];
  wordnet.lookup(word, function(results) {
    results.forEach(function(result) {
      synset.push(result.synsetOffset);
      console.log(result.synsetOffset);
      synset.push(result.pos);
      synset.push(result.lemma);
      console.log(result.lemma);
      synset.push(result.synonyms);
      synset.push(result.pos);
      synset.push(result.gloss);
    })
  })
  return synset;
}
