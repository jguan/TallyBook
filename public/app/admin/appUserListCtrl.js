angular.module('app').controller('appUserListCtrl', function($scope, appUser) {
  $scope.users = appUser.query();
});