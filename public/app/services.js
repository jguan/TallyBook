'use strict';

/* Services */

var appServices = angular.module('app.services', []);

appServices.value('version', '0.1');

// register the interceptor as a service
appServices.factory('appHttpInterceptor', function($q, $location, appNotifier) {
  return {
    'response': function(response) {
      // do something on success
      if (response.status === 401) {
        console.log("Response 401");
      }
      //console.log("Response: ", response);
      return response || $q.when(response);
    },

    // optional method
    'responseError': function(rejection) {
      // do something on error
      console.log("Rejection: ", rejection);
      switch(rejection.status) {
        case 401:
          console.log(401);
          break;
        case 403:
          //console.log(403);
          $location.path('/');
          appNotifier.error(rejection.data.error['message']);
          break;
        case 404:
          console.log(404);
          break;
        case 0:
          console.log('No connection, internet is down?');
          break;
        default:
          console.log(rejection.data['message']);
      }
      return $q.reject(rejection);
    }
  }
});