angular.module('app').factory('appIdentity', function($window, appUser) {
  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new appUser();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function() {
      return !!this.currentUser;
    },
    isAuthorized: function(role) {
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    }
  }
});