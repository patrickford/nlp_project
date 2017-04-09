var response;
function deconstruct(obj) {
  var temp = []
  for (item in obj) {
    temp.push(obj[item])
  }
  return temp
}

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
       window.location = "/";
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

    function writeSentiment(object){
      $("#sentiment").hide()
      var compScore = object.comparative
      var posWords = object.positive
      var negWords = object.negative
      console.log(object.negative)
      var html = ''
      html = `<p>Sentiment comparative score: ${compScore}.<p>`
      $("#score").html(html)
      html = ''
      html = html + "<p class='block'>Positive Words</p>"
      for (var i=0; i<posWords.length; i++) {
        html = html + posWords[i] + '<br>'
      }
      $("#positive").html(html)
      html = ''
      html = html + "<p class='block'>Negative Words</p>"
      for (var i=0; i<negWords.length; i++) {
        html = html + negWords[i] + '<br>'
      }
      $("#negative").html(html)
    }

      $.ajax(settings).done(function(res) {
        var tagged = res.tagged;
        var taggedArray = deconstruct(tagged)
        taggedArray.sort(function(a,b) {
          return b[2] - a[2];
        })
        $(".buttons").children().show()
        $(".outputMenu").children().show()
        writeOutput(taggedArray, "#tagged")
        writeOutput(res.bigrams, "#bigrams")
        writeOutput(res.trigrams, "#trigrams")
        writeSentiment(res.sentiment)
      });
}

$('a').click(function(e) {
    //e.preventDefault();
    $(".outputMenu a").removeClass("on");
    $(".outputMenu a").removeClass("outputMenu");
    $(this).addClass('on');
});

function showElement(element) {
  $(".output").children().hide()
  $(element).show()
}

$('#clientData').on('click', function(e){
    e.preventDefault();
    var url = $('#link').val();
    postData(url);
  })

  function postLogin(_user, _pass) {
      var settings = {
        //url: '/login?username=' + _user + '&password=' +
        //_pass,
        url: 'login',
        data: {
          "username": _user,
          "password": _pass
        },
        type: 'POST',
        error: function badData(err) {
          console.log(url)
          console.log(err)
        }
        // success: function(data) {
        //   //document.location = "url"
        // }
      }
      $.ajax(settings).done(function(res) {
        $(location).attr('href', '/nlp.html')
        sessionStorage.setItem("authName", res);
      });
    }

  $('form').on('submit', function(e){
    e.preventDefault();
    var user = $("#username").val();
    var pass = $("#password").val()
    postLogin(user, pass)
  })

function capture() {
  console.log(response)
  var authorizedUser = localStorage.getItem("authName")
  console.log(authorizedUser)
}

function addUser() {
  var authorizedUser = sessionStorage.getItem("authName");
    $('#user').append(authorizedUser);
    console.log(authorizedUser);
};

function logOut() {
  var settings = {
    url: '/logout',
    // dataType: "json",
    // contentType: "application/json",
    // processData: "false",
    method: 'GET',
    success: function displayData(data) {
      console.log(data);
    },
    error: function badData(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
  window.location = "/";
}
