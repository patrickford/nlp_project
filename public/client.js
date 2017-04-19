function deconstruct(obj) {
  var temp = []
  for (item in obj) {
    temp.push(obj[item])
  }
  return temp
}



function postData(_url, _description) {
  var settings = {
    url: '/posts',
    data: JSON.stringify({
      url: _url,
      description: _description
   }),
    contentType: "application/json",
    processData: "false",
    method: 'POST',
    success: function displayData(data) {
      console.log(data)
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

    function writeRaw(string) {
      $("#raw").hide();
      $("#raw").html(string);
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
        writeRaw(res.raw);
      });
}

$('a').click(function(e) {
    $(".outputMenu a").removeClass("on");
    $(".outputMenu a").removeClass("outputMenu");
    $(this).addClass('on');
});

function showElement(element) {
  $(".output").children().hide()
  $(element).show()
}

$('#intake').on('submit', function(e){
    e.preventDefault();
    $('.output').children().hide();
    var url = $('#link').val();
    var description = $('#description').val();
    if (url != '' && description !='') {
      console.log('true')
      postData(url, description);
    }
    else if (url == '' && description != '') {
      $('.intake-label').removeClass("red")
      $('#link-label').addClass("red");
    }
    else if (description == '' && url != '') {
      $('.intake-label').removeClass("red")
      $('#description-label').addClass("red");
    }
    else {
      console.log('false')
      $('.intake-label').addClass("red")
    }
  })


function postLogin(_user, _pass) {
    var settings = {
      url: 'login',
      data: {
        "username": _user,
        "password": _pass
      },
      type: 'POST',
      error: function badData(err) {
        console.log(err)
      }
    }
    $.ajax(settings).done(function(res) {
      var lastName = res.lastName
      var firstName = res.firstName
      console.log(typeof(lastName) === "undefined")
      if (typeof(lastName) === "undefined") {
        $(".password-message").html("wrong user name or password").addClass('red')
      }
      else {
        var fullName = firstName + ' ' + lastName;
        sessionStorage.setItem("authName", fullName);
        sessionStorage.setItem("email", res.email);
        sessionStorage.setItem("first", res.firstName);
        sessionStorage.setItem("last", res.lastName);
        sessionStorage.setItem("user", res.username);
        $(location).attr('href', '/nlp.html')
      }
    });
  }

$( "#client-login").on('submit', function(e){
  e.preventDefault();
  var user = $("#username").val();
  var pass = $("#password").val();
  if (user != '' && pass != '') {
    postLogin(user, pass);
  }
  else if (user == '' && pass != '') {
    $('.label').removeClass("red");
    $('#username-label').addClass("red");
  }
  else if (user != '' && pass == '') {
    $('.label').removeClass("red");
    $('#password-label').addClass("red");
  }
  else {
    $('.label').addClass("red");
  }
})
