function deconstruct(obj) {
  var temp = []
  for (item in obj) {
    temp.push(obj[item])
  }
  return temp
}

function showElement(element) {
  $(".output").children().hide()
  $(element).show()
}

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

window.onload = function() {
  addUser();
  var _id = sessionStorage.getItem("selectedRecord");
  console.log(_id);
  var settings = {
    url: '/record',
    data: JSON.stringify({
    id : _id
   }),
    contentType: "application/json",
    processData: "false",
    method: 'POST',
    success: function displayData(res) {
      console.log(res)
    },
    error: function badData(err) {
      console.log(err);
    }
  }
  $.ajax(settings).done(function(res) {
    console.log('test')
    $(".buttons").children().show()
    $(".outputMenu").children().show()
    console.log(res.text)
    var bigramArray = res.text.bigrams;
    bigramArray.sort(function(a, b) {
        return b[2] - a[2];
    })
    writeOutput(bigramArray, "#bigrams");
    var trigramArray = res.text.trigrams;
    trigramArray.sort(function(a, b) {
        return b[3] - a[3];
    })
    writeOutput(trigramArray, "#trigrams");
    var tagged = res.text.tagged;
    var taggedArray = deconstruct(tagged)
    taggedArray.sort(function(a,b) {
      return b[2] - a[2];
    })
    writeOutput(taggedArray, "#tagged")
    writeSentiment(res.text.sentiment)
    writeRaw(res.text.raw);
  });
}
