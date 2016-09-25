angular.module('app').factory('appCachedCourses', function(appCourse) {
  var courseList;

  return {
    query: function() {
      if(!courseList) {
        courseList = appCourse.query();
      }

      return courseList;
    }
  }
});