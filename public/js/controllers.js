'use strict';

/* Controllers */

angular.module('app.controllers', ['ngMaterial']).
  controller('AppCtrl', function ($scope, socket, Service, $compile, $interval) {

    var self = this, j= 0, counter = 0;

    self.mode = 'query';
    self.activated = true;

    self.showList = [ ];

    self.toggleActivation = function() {
        if ( !self.activated ) self.showList = [ ];
        if (  self.activated ) {
          j = counter = 0;
          self.determinateValue = 30;
          self.determinateValue2 = 30;
        }
    };

    $interval(function() {
      self.determinateValue += 1;
      self.determinateValue2 += 1.5;

      if (self.determinateValue > 100) self.determinateValue = 30;
      if (self.determinateValue2 > 100) self.determinateValue2 = 30;

        if ( (j < 2) && !self.showList[j] && self.activated ) {
          self.showList[j] = true;
        }
        if ( counter++ % 4 === 0 ) j++;

        if ( j == 2 ) self.contained = "indeterminate";

    }, 100, 0, true);

    $interval(function() {
      self.mode = (self.mode == 'query' ? 'determinate' : 'query');
    }, 7200, 0, true);

    //---------- INITIAL VALUE ---------------------

    $scope.loading = false;
    $scope.indeterminate = false;
    $scope.image_url = "https://img.clipartfest.com/1d90d3fe2dc112f65b18fc2eab23e468_-doctor-logo-clip-art-png-clipart-images-of-doctor_800-1314.png";
    $scope.radius = 500;

    //--------------------------------------------

    //-------------------------------------------------------------------------------------------
    var map;

    $scope.sendSocket = function(message){
         self.toggleActivation();
         $scope.loading = true;
         Service.getEntityWatson(message).success(function(result) {
            $scope.getLocationByKeyword(result["result"]); 
         });
         
    };


    $scope.getLocation = function(criteria){
        console.log("radius = "+$scope.radius);
        $scope.loading = true;
        self.toggleActivation();
        if(criteria == 'doctor' || criteria == 'hospital'){
          $scope.image_url = "https://img.clipartfest.com/1d90d3fe2dc112f65b18fc2eab23e468_-doctor-logo-clip-art-png-clipart-images-of-doctor_800-1314.png";
        } else if(criteria == 'dentist'){
          $scope.image_url = "https://practo-fabric.s3.amazonaws.com/namita-s-dental-clinic-faridabad-1460054622-5706aa5eebe43.png";
        } else if('insurance_agency'){
          $scope.image_url = "http://www.pngall.com/wp-content/uploads/2016/06/Insurance-PNG-HD.png";
        } else {
          $scope.image_url = "https://img.clipartfest.com/471e53e4f7a24d1ec8cd6e4f9f0e9d8c_hair-beauty-salon-clip-art-beauty-salon-clipart-images_437-494.png";
        }
        navigator.geolocation.getCurrentPosition(function(position) {
          var myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map = new google.maps.Map(document.getElementById('map'), {
            center: myLocation,
            zoom: 10
          });
          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: myLocation,
            radius: $scope.radius,
            types: [criteria]
          }, callback);
        });
    };
    

    $scope.getLocationByKeyword = function(keywords){
      if($scope.loading == false){
        $scope.loading = true;
        self.toggleActivation();
      }
      navigator.geolocation.getCurrentPosition(function(position) {
        var myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
      
        map = new google.maps.Map(document.getElementById('map'), {
          center: myLocation,
          zoom: 10
        });

        var service = new google.maps.places.PlacesService(map);
        var request = {
          location: myLocation,
          radius: $scope.radius,
          query: keywords
        };

        service.textSearch(request, callback);
      });
    };

    $scope.getLocation('hospital');


    function callback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
      }
    }

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;

    $scope.getDirection = function(){
      var place = $scope.end;
      navigator.geolocation.getCurrentPosition(function(position) {
          var myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          directionsDisplay = new google.maps.DirectionsRenderer();
          var mapOptions = {
            zoom:8,
            center: myLocation
          }
          map = new google.maps.Map(document.getElementById('map'), mapOptions);
          directionsDisplay.setMap(map);
          calcRoute(myLocation, place);
      });
    };

    function calcRoute(start, end) {
      var request = {
        origin: start,
        destination: end,
        provideRouteAlternatives: true,
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL
      };
      directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          directionsDisplay.setDirections(result);
        }
      });
    }

    function addMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          title: place.name,
          position: place.geometry.location,
          icon: {
            url: $scope.image_url,
            anchor: new google.maps.Point(50, 50),
            scaledSize: new google.maps.Size(50, 57)
          }
        });

      google.maps.event.addListener(marker, 'click', function() {
        if (marker.getAnimation() !== null && marker.getAnimation() === google.maps.Animation.BOUNCE) {
          marker.setAnimation(null);
        } else {
          //marker.setAnimation(google.maps.Animation.BOUNCE);
        }

        var service = new google.maps.places.PlacesService(map);
        service.getDetails(place, function(result, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
          }
          var end = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          };
          $scope.end = end;
          var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+result.name+'</h1><BR>'+
            '<div id="bodyContent">'+
            '<p>'+result.formatted_address+'</p>'+'<br>'+
            '<p>'+result.formatted_phone_number+'</p>'+
            '<p> Rating '+result.rating+'</p>'+
            '<a href="'+result.url+'"><button class="md-primary md-raised md-button md-ink-ripple" type="button" ">See On Gmap</button></a>'+
            '<button class="md-primary md-raised md-button md-ink-ripple" type="button" ng-click="getDirection();">Get Direction</button>'+'<br>'+
            '</div>'+
            '</div>';

          var elTooltip = $compile(contentString)($scope);
          var infowindow = new google.maps.InfoWindow({
              content: elTooltip[0]
          });
          
          infowindow.open(map, marker);
        });
        
      });
    }


    function createMarkers(places) {
      var bounds = new google.maps.LatLngBounds();
      var placesList = document.getElementById('places');

      for(var i = 0; i < places.length; i++){
        var place = places[i];
        var isHealthPlace = false;
        for(var j = 0;j < place.types.length;j++){
          if(place.types[j] == "health" || place.types[j] == "hospital" || place.types[j] == "pharmacy"
             || place.types[j] == "insurance_agency" || place.types[j] == "dentist" || place.types[j] == "doctor"
            ){
            addMarker(place);    
          }
        }
        bounds.extend(place.geometry.location);
      }
      $scope.loading = false;
      map.fitBounds(bounds);
      self.toggleActivation();
    }
      
  }).
  controller('controller1', function ($scope, socket) {

  }).
  controller('controller2', function ($scope) {
    // write Ctrl here
  });
