angular.module('app', [
  'ngResource',
  'ngRoute',
  'app.services',
  'app.filters',
  'app.directives',
  'ui.bootstrap'
]);

angular.module('app').config(function($routeProvider, $locationProvider, $httpProvider) {
  var routeRoleChecks = {
    admin: {auth: function(appAuth) {
      return appAuth.authorizeCurrentUserForRoute('admin')
    }},
    user: {auth: function(appAuth) {
      return appAuth.authorizeAuthenticatedUserForRoute()
    }}
  };

  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: '/partials/main/main',
      controller: 'appMainCtrl',
      title: 'Home | Tally Book'
    })
    .when('/contact', {
      templateUrl: '/partials/main/contact',
      controller: 'appContactCtrl',
      title: 'Contact | Tally Book'
    })
    .when('/mytallybook/', {
      templateUrl: '/partials/main/tallybook',
      controller: 'appTallybookCtrl',
      resolve: routeRoleChecks.user,
      title: 'My Tally Book | Tally Book'
    })
    .when('/admin/users', {
      templateUrl: '/partials/admin/user-list',
      controller: 'appUserListCtrl',
      resolve: routeRoleChecks.admin,
      title: 'Admin | Tally Book'
    })
    .when('/signup', {
      templateUrl: '/partials/account/signup',
      controller: 'appSignupCtrl',
      title: 'Signup | Tally Book'
    })
    .when('/login', {
      templateUrl: '/partials/account/login',
      controller: 'appLoginCtrl',
      title: 'Login | Tally Book'
    })
    .when('/profile', {
      templateUrl: '/partials/account/profile',
      controller: 'appProfileCtrl',
      resolve: routeRoleChecks.user,
      title: 'Profile | Tally Book'
    })
    .when('/courses', {
      templateUrl: '/partials/courses/course-list',
      controller: 'appCourseListCtrl',
      title: 'Courses'
    })
    .when('/courses/:id', {
      templateUrl: '/partials/courses/course-details',
      controller: 'appCourseDetailCtrl',
      title: 'Course'
    });

  //Http Intercpetor to check auth failures for xhr requests
  $httpProvider.interceptors.push('appHttpInterceptor');

});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  });
  $rootScope.$on('$routeChangeSuccess', function (evt, current) {
    $rootScope.title = current.$$route.title;
  });
});
