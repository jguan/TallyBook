angular.module('app').controller('appMainCtrl', function($scope, appCachedCourses) {
  $scope.courses = appCachedCourses.query();
});