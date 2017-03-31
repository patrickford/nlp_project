function putData(userUID) {
  var settings = {
    url: `/blogs/${userUID}`,
    dataType: "json",
    data: {'author': 'new name',
            'content': 'new content',
            'title' : 'new title'
            },
    method: 'PUT',
    success: function displayData(data) {
      console.log(data);
    },
    error: function badData(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
}

function deleteData(userUID) {
  var settings = {
    url:   `/blogs/${userUID}`,
    dataType: "jsonp",
    method: 'DELETE',
    success: function displayData(data) {
      console.log(data);
    },
    error: function badData(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
}

function getData() {
  var results = '';
  var settings = {
    url: '/auth',
    data: JSON.stringify({
      username: 'yuriyerastov',
      password: 'password%@#@'
   }),
    dataType: "json",
    contentType: "application/json",
    processData: "false",
    method: 'GET',
    success: function displayData(data) {
      console.log(data);
    },
    error: function badData(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
}

function postData(url) {
  var settings = {
    url: '/posts',
    data: JSON.stringify({
     username : "yuri",
     text: url
   }),
    contentType: "application/json",
    processData: "false",
    method: 'POST',

    success: function displayData(data) {
      var bigramArray = data.bigrams
      bigramArray.sort(function(a, b) {
          return b[2] - a[2]
      })
      var trigramArray = data.trigrams
      trigramArray.sort(function(a, b) {
          return b[3] - a[3]
      })
    },
    error: function badData(err) {
      console.log(err);
      $(".glossed-output").append("Server Error");
    }
  };

    function writeOutput(object, element) {
      var html = '';
      html = html + "<table>"
      for (item in object) {
        var cells = object[item];
        html = html + "<tr>"
        for (i=0; i<cells.length; i++) {
          html = html + "<td>"+cells[i]+"</td>"
        }
        html = html + '</tr>'
      }
      html = html + "</table>"
      $(element).hide()
      $(element).html(html)
    }

      $.ajax(settings).done(function(res) {
        $(".buttons").children().show()
        writeOutput(res.tagged, "#tagged")
        writeOutput(res.bigrams, "#bigrams")
        writeOutput(res.trigrams, "#trigrams")
        writeOutput(res.trigrams, "#sentiment")
      });
}

function showElement(element) {
  $(".output").children().hide()
  $(element).show()

}

$('#clientData').on('click', function(e){
    e.preventDefault();
    var url = $('#link').val();
    postData(url);
  })
