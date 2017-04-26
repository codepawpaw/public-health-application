var Uber = require('node-uber');
var http = require('https');
module.exports = function(app){

	var uber = new Uber({
	  client_id: '86FwyiiaPpfTI9AeHMjkkzAc6i3hkpKE',
	  client_secret: 'hzDDlyBX4b92IOeMx6y_a5zV2KESOwia9y_MTars',
	  server_token: 'FwN7t0t-JSE2W0YP9PLjgX9uiMMY95e1b0MB_gFe',
	  name: 'Doyok',
	  language: 'en_US', // optional, defaults to en_US
	  sandbox: false // optional, defaults to false
	});

	app.get('/api/uber/estimates/price/:startLatitude/:startLongitude/:endLatitude/:endLongitude',function(req,res){
		var start_latitude = req.params.startLatitude;
		var start_longitude = req.params.startLongitude;
		var end_latitude = req.params.endLatitude;
		var end_longitude = req.params.endLongitude;

		uber.estimates.getPriceForRouteAsync(start_latitude, start_longitude, end_latitude, end_longitude)
  		.then(function(result) { 
  			var response = result;
	        res.setHeader('Content-Type', 'application/json');
    		res.send(JSON.stringify(response)); 
  		}).error(function(err) { 
  			console.error(err); 
  		});
    });

    app.get('/api/uber/estimates/time/:endLatitude/:endLongitude',function(req,res){
		var end_latitude = req.params.endLatitude;
		var end_longitude = req.params.endLongitude;

		uber.estimates.getETAForLocationAsync(end_latitude, end_longitude)
  		.then(function(result) { 
  			var response = result;
	        res.setHeader('Content-Type', 'application/json');
    		res.send(JSON.stringify(response)); 
  		}).error(function(err) { 
  			console.error(err); 
  		});
    });


};