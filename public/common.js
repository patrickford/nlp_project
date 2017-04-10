function addUser() {
  var authorizedUser = sessionStorage.getItem("authName");
    $('#user').append(authorizedUser);
    console.log(authorizedUser);
};

function logOut() {
  var settings = {
    url: '/logout',
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
