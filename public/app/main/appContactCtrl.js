angular.module('app').controller('appContactCtrl', function($scope, $http, appNotifier, $location) {

  $scope.send = function() {
    $http.post('/contact', {name: $scope.name, email: $scope.email, subject: $scope.subject, message: $scope.message}).then(function (response) {
      console.log(response);
      if (response.data.success) {
        appNotifier.notify('Email has been sent successfully!');
        $location.path('/');
      } else {
        appNotifier.error(response.data.error);
      }
    });

  };

});