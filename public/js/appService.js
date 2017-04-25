'use strict';

angular.module('app.appServices', []).
  factory('Service', function ($http) {
    return {
			getWeatherByCity : function(name) {
				return $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=metric&cnt=5&APPID=481e3bc28e5264e5607c2b65b449bfc1&q='+name)
			},
			getEmergencyAmbulance : function() {
				var req = {
				 method: 'GET',
				 crossDomain:true,
		         crossOrigin:true,
		         contentType:false,
		         'Access-Control-Allow-Methods': 'POST',
		         'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',   
		         header:{'Access-Control-Allow-Origin': '*'},
				 url: 'http://api.jakarta.go.id/v1/puskesmas',
				 headers: {
				   'Authorization': '/PMYNN3x9M6KeE+dLmfYJDJHBF8D5kCEQiiJBzND7yJaALfDJXDJzt3sfGtoXaj3'
				 },
				 data: {

				 }
				}

				$http(req).then(function(result){
					var req2 = {
					 method: 'GET',
					 crossDomain:true,
			         crossOrigin:true,
			         contentType:false,
			         'Access-Control-Allow-Methods': 'POST',
			         'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',   
			         header:{'Access-Control-Allow-Origin': '*'},
					 url: 'http://api.jakarta.go.id/v1/puskesmas',
					 headers: {
					   'Authorization': '/PMYNN3x9M6KeE+dLmfYJDJHBF8D5kCEQiiJBzND7yJaALfDJXDJzt3sfGtoXaj3'
					 },
					 data: {
					    input: { text: 'cancer hospital' },
					    context : result.context,
					 }
					}

					$http(req2).then(function(result) {
						console.log(result);
					}, function(){

					});

				}, function(){

				});
			},
			getEntityWatson : function(message) {
				return $http.get('http://localhost:2054/api/watson/'+message)
			},
			getCurrentLocation : function(){
				return $http.get('http://ipinfo.io');
			}
	}
  });
