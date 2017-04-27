'use strict';

/* Directives */

angular.module('app.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).directive('dynamicMap', function ($window) {
  	console.log("called");
    return {
        restrict: 'A',

        link: function (scope, elem, attrs) {

            var winHeight = $window.innerHeight;

            var headerHeight = attrs.banner ? attrs.banner : 0;

            elem.css('height', winHeight - headerHeight + 'px');
        }
    };
  });
