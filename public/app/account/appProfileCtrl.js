angular.module('app').controller('appProfileCtrl', function($scope, appAuth, appIdentity, appNotifier) {
  $scope.email = appIdentity.currentUser.email;

  $scope.update = function() {
    var newUserData = {
      email: $scope.email
    };
    if($scope.password && $scope.password.length > 0) {
      newUserData.password = $scope.password;
    }

    appAuth.updateCurrentUser(newUserData).then(function() {
      appNotifier.notify('Your user account has been updated');
    }, function(reason) {
      appNotifier.error(reason);
    })
  }
});