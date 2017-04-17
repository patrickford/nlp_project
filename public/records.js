function deleteRecord(userUID) {
  var settings = {
    url:   `/analysis/${userUID}`,
    dataType: "jsonp",
    method: 'DELETE',
    success: function displayData(data) {
      var selector = "#" + userUID;
      $(selector).remove();
    },
    error: function badData(err) {
    }
  };
  $.ajax(settings);
}

function saveID(id) {
  sessionStorage.setItem("selectedRecord", id)
  window.location.assign('/record.html')
}

function removeEmpty(array) {
  for (var i=0; i<array.length; i++) {
    if (array[i]=='') {
      array.splice(i, 1);
    }
  }
  return array;
}

function getData() {
  var settings = {
    url: '/history',
    method: 'GET',
    success: function displayData(data) {
    },
    error: function badData(err) {
    }
  };
  $.ajax(settings).done(function(res) {
    var returnedArray = res;
    var htmlCode = '';
    htmlCode = '<table>'
    returnedArray.forEach(function(object){
      var objID = object.id
      var dateTime = object.created
      var time = dateTime.slice(11, -5)
      var date = dateTime.slice(0, 10)
      var tokens = object.text.sentiment.tokens
      tokens = tokens.filter(function(item) {
        return item != ''
      })
      var description;
      if (object.text.description) {
        description = object.text.description;
      }
      else {
        description = 'no description'
      }
      var remLink = `<a onclick="deleteRecord('${objID}')" href="#">delete</a>`;
      var viewLink = `<a onclick="saveID('${objID}')" href="#">view</a>`;
      var htmlLine = `<tr id="${objID}"><td>${date}</td><td>${time}</td><td>${description}</td><td>${viewLink}</td><td>${remLink}</td></tr>`;
      htmlCode = htmlCode + htmlLine;
    });
    htmlCode = htmlCode + '</table>';
    $(".output").html(htmlCode);
  });
}
