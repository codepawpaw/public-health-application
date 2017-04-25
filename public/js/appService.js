'use strict';

angular.module('app.appServices', []).
  factory('Service', function ($http) {
    return {
			getEntityWatson : function(message) {
				return $http.get('http://localhost:2054/api/watson/'+message)
			},
			getCurrentLocation : function(){
				return $http.get('https://ipinfo.io');
			}
	}
  });
