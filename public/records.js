function deleteRecord(userUID) {
  console.log('test')
  var settings = {
    url:   `/analysis/${userUID}`,
    dataType: "jsonp",
    method: 'DELETE',
    success: function displayData(data) {
      console.log(data);
      var selector = "#" + userUID;

      $(selector).remove();
    },
    error: function badData(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
}

function saveID(id) {
  sessionStorage.setItem("selectedRecord", id)
  window.location.assign('/record.html')
}

function getData() {
  function removeEmpty(array) {
    for (var i=0; i<array.length; i++) {
      //console.log(array[i])
      if (array[i]=='') {
        console.log('found it' + array[i])
        array.splice(i, 1)
      }
    }
    return array
    console.log(array)
  }
  var settings = {
    url: '/history',
    method: 'GET',
    success: function displayData(data) {
      console.log(data);
    },
    error: function badData(err) {
      console.log(err);
    }
  };
  $.ajax(settings).done(function(res) {
    var returnedArray = res;
    var htmlCode = '';
    htmlCode = '<table>'
    returnedArray.forEach(function(object){
      var objID = object.id
      var dateTime = object.created
      var tokens = object.text.sentiment.tokens
      tokens = tokens.filter(function(item) {
        return item != ''
      })
      var mid = tokens.length/2;
      var tokensSelect = tokens.slice(mid-6, mid+6).join(' ');
      var extract = '...' + tokensSelect + '...';
      var remLink = `<a onclick="deleteRecord('${objID}')" href="#">delete</a>`;
      console.log(remLink);
      var viewLink = `<a onclick="saveID('${objID}')" href="#">view</a>`;
      console.log(viewLink)
      var htmlLine = `<tr id="${objID}"><td>${dateTime}</td><td>${extract}</td><td>${viewLink}</td><td>${remLink}</td></tr>`;
      htmlCode = htmlCode + htmlLine;
    });
    htmlCode = htmlCode + '</table>';
    $(".output").html(htmlCode);
  });
}
