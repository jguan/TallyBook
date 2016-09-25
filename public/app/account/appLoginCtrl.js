angular.module('app').controller('appLoginCtrl', function($scope, appIdentity, appNotifier, appAuth, $location) {
  //$scope.identity = appIdentity;

  $scope.signin = function(email, password, rememberme) {
    appAuth.authenticateUser(email, password, rememberme).then(function(success) {
      if(success) {
        appNotifier.notify('You have successfully signed in!');
        $location.path('/mytallybook');
      } else {
        appNotifier.notify('Username/Password combination incorrect');
      }
    });
  };

  $scope.signout = function() {
    appAuth.logoutUser().then(function() {
      $scope.email = "";
      $scope.password = "";
      appNotifier.notify('You have successfully signed out!');
      $location.path('/');
    })
  };

});