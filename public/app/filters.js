'use strict';

/* Filters */

angular.module('app.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]).
  filter('ucfirst', function() {
    return function(input) {
      if (input) input = input.toLowerCase();
      return input.substring(0,1).toUpperCase()+input.substring(1);
    };
  });
