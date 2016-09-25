angular.module('app').controller('appNavBarLoginCtrl', function($scope, $http, appIdentity, appNotifier, appAuth, $location) {
  $scope.identity = appIdentity;
  $scope.signin = function(username, password) {
    appAuth.authenticateUser(username, password).then(function(success) {
      if(success) {
        appNotifier.notify('You have successfully signed in!');
      } else {
        appNotifier.notify('Username/Password combination incorrect');
      }
    });
  };

  $scope.signout = function() {
    appAuth.logoutUser().then(function() {
      $scope.username = "";
      $scope.password = "";
      appNotifier.notify('You have successfully signed out!');
      $location.path('/');
    })
  }
});