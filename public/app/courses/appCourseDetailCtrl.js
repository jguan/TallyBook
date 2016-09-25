angular.module('app').controller('appCourseDetailCtrl', function($scope, appCachedCourses, $routeParams) {
  appCachedCourses.query().$promise.then(function(collection) {
    collection.forEach(function(course) {
      if(course._id === $routeParams.id) {
        $scope.course = course;
      }
    })
  })
});