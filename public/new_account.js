function postNew(_user, _pass, _first, _last, _email) {
  var settings = {
    url: '/user',
    data: {
      "username": _user,
      "password": _pass,
      "firstName": _first,
      "lastName": _last,
      "email": _email
    },
    type: 'POST'
  }
  $.ajax(settings)
}

$("form").on('submit', function(e) {
  e.preventDefault();
  var first = $("#first").val();
  var last = $("#last").val();
  var pass1 = $("#password1").val();
  var pass2 = $("#password2").val();
  var user = $("#username").val();
  var email = $("#email").val();
  if (pass1 === pass2) {
    postNew(user, pass1, first, last, email)
    window.location.href = "/";
    return false;
  }
});
