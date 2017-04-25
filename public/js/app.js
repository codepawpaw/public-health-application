'use strict';

angular.module('app', [
  'ngRoute',
  'app.controllers',
  'app.filters',
  'app.appServices',
  'app.directives',
  'ngMaterial',
  'ngMessages'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/view1', {
      templateUrl: 'partials/partial1.html',
      controller: 'controller1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2.html',
      controller: 'controller2'
    }).
    otherwise({
      redirectTo: '/view1'
    });

  $locationProvider.html5Mode(true);
});
