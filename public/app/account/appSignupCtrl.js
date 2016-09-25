angular.module('app').controller('appSignupCtrl', function($scope, appUser, appNotifier, $location, appAuth) {

  $scope.signup = function() {
    var newUserData = {
      email: $scope.email,
      password: $scope.password
    };

    appAuth.createUser(newUserData).then(function() {
      appNotifier.notify('User account created!');
      $location.path('/');
    }, function(reason) {
      appNotifier.error(reason);
    })
  };

});