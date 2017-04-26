'use strict';

angular.module('app.appServices', []).
  factory('Service', function ($http) {
    return {
			getEntityWatson : function(message) {
				return $http.get('http://localhost:2054/api/watson/'+message)
				//return $http.get('https://doyok.herokuapp.com/api/watson/'+message)
			},
			getCurrentLocation : function(){
				return $http.get('https://ipinfo.io');
			},
			getUberPriceEstimation : function(from, to){
				return $http.get('http://localhost:2054/api/uber/estimates/price/'+from.lat+'/'+from.lng+'/'+to.lat+'/'+to.lng)
				//return $http.get('https://doyok.herokuapp.com/api/uber/estimates/price/'+from.lat+'/'+from.lng+'/'+to.lat+'/'+to.lng)
			},
			getUberTimeEstimation : function(to){
				return $http.get('http://localhost:2054/api/uber/estimates/time/'+to.lat+'/'+to.lng)
				//return $http.get('https://doyok.herokuapp.com/api/uber/estimates/time/'+to.lat+'/'+to.lng)
			}
	}
  });
