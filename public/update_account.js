function putData(_user, _first, _last, _email) {
  dataObject = {'username': _user,
          'first': _first,
          'last' : _last,
          'email': _email
          }
  var settings = {
    url: `user`,
    type: "PUT",
    data: JSON.stringify(dataObject),
    contentType: "application/json",
    dataType: "json",
    // processData: "false",
    success: function displayData(data) {
      console.log(data);
    },
    error: function badData(err) {
      console.log(err);
    }
  };
  $.ajax(settings);
}

function fillUser() {
  var _first = sessionStorage.getItem("first");
  var _last = sessionStorage.getItem("last");
  var _email = sessionStorage.getItem("email");
  var _form = `
    <div class="label">
      First name
    </div>
    <div class="entry">
      <input class="field" id="first" type="text" name="first" value="${_first}"/>
    </div>
    <div class="label">
      Last name
    </div>
    <div class="entry">
      <input class="field" id="last" type="text" name="lastname" value="${_last}"/>
    </div>
    <div class="label">
      Email
    </div>
    <div class="entry">
      <input class="field" id="email" type="text" name="email" value="${_email}"/>
    </div>
  <div class='login'>
    <input class="field"  id="sub" type="submit" value="Update user profile"/>
  </div>
  `;
    $("form").html(_form);
};

$('form').on('submit', function() {
  var first = $("#first").val();
  var last = $('#last').val();
  var email = $('#email').val();
  var user = sessionStorage.getItem("user");
  putData(user, first, last, email);
})
