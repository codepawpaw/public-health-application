'use strict';

/* Controllers */

angular.module('app.controllers', ['ngMaterial']).
  controller('AppCtrl', function ($scope, Service, $compile, $interval, $mdToast, $mdSidenav) {

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
    $scope.radius = 500;
    $scope.zoom = 10;
    $scope.clicked = false;
    $scope.circularActivated = false;

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;

    $scope.price = [];
    $scope.time = [];

    //--------------------------------------------

    //-------------------------------------------------------------------------------------------

    $scope.openNav = function() {
      document.getElementById("mySidenav").style.width = "12%";
    }

    $scope.closeNav = function() {
      document.getElementById("mySidenav").style.width = "0";
    }

    var map;

    $scope.sendSocket = function(message){
         $scope.clicked = true;
         $scope.closeNav();
         self.toggleActivation();
         $scope.loading = true;
         Service.getEntityWatson(message).success(function(result) {
            if(result["result"] ==  404){
              $scope.loading = false;
              self.toggleActivation();

              $mdToast.show({
                hideDelay   : 5000,
                position    : 'buttom left',
                templateUrl : 'toast-template.html'
              });
            } else {
              $scope.getLocationByKeyword(result["result"]); 
            }
         });
         
    };


    $scope.getLocation = function(criteria){
        $scope.clicked = true;
        $scope.loading = true;
        $scope.closeNav();
        self.toggleActivation();
        if (navigator.geolocation) {
            
          navigator.geolocation.getCurrentPosition(function(position) {
            
            var myLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById('map'), {
              center: myLocation,
              zoom: $scope.zoom
            });
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: myLocation,
              radius: $scope.radius,
              types: [criteria]
            }, callback);
          }, function(error) {
            map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: -34.397, lng: 150.644},
              zoom: 6
            });
            handleLocationError(true, map.getCenter());
          });
        } else {
          map = new google.maps.Map(document.getElementById('map'), {
              center: {lat: -34.397, lng: 150.644},
              zoom: 6
          });
          handleLocationError(false, map.getCenter());
        }
    };

    function handleLocationError(browserHasGeolocation, pos) {
        if(!pos){
          pos = {lat: -34.397, lng: 150.644};
        }
        var infoWindow = new google.maps.InfoWindow;
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed. Please check your geolocation service' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
    

    $scope.getLocationByKeyword = function(keywords){
      $scope.closeNav();
      $scope.clicked = true;
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
          zoom: $scope.zoom
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

    $scope.getDirection = function(){
      $scope.price = [];
      $scope.time = [];
      $scope.circularActivated = true;

      $scope.openNav();
      var place = $scope.end;
      navigator.geolocation.getCurrentPosition(function(position) {
          var myLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          directionsDisplay = new google.maps.DirectionsRenderer();
          var mapOptions = {
            zoom:$scope.zoom,
            center: myLocation
          }

          Service.getUberPriceEstimation(myLocation, place).success(function(result) {
            for(var i = 0;i<result.prices.length;i++){
              var p = {
                display_name: result.prices[i].display_name,
                estimate: result.prices[i].estimate
              };

              $scope.price.push(p);
            }

          });

          Service.getUberTimeEstimation(place).success(function(result) {
            for(var i =0;i<result.times.length;i++){
              var p = {
                display_name: result.times[i].display_name,
                estimate: result.times[i].estimate
              };
              $scope.time.push(p);
            }
          });


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
          $scope.circularActivated = false;
        }
      });
    }

    function addMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          title: place.name,
          position: place.geometry.location,
          icon: {
            url: 'http://images.clipartpanda.com/location-icon-vector-location_map_pin_black5.png',
            anchor: new google.maps.Point(60, 60),
            scaledSize: new google.maps.Size(45, 67)
          }
        });
      google.maps.event.addListener(marker, 'click', function() {
        $scope.clicked = true;
        $scope.loading = true;

        var service = new google.maps.places.PlacesService(map);
        service.getDetails(place, function(result, status) {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          var end = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          };
          $scope.end = end;

          var contentString = '<CENTER><div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+result.name+'</h1><BR>'+
            '<div id="bodyContent">'+
            '<p>'+result.formatted_address+'</p>'+'<br>';

          if(result.formatted_phone_number != undefined) contentString += '<p>'+result.formatted_phone_number+'</p>';

          if(result.rating != undefined) contentString += '<p> Rating '+result.rating+'</p>';

          contentString += '<a href="'+result.url+'"><button class="md-primary md-raised md-button md-ink-ripple" type="button" ">See On Gmap</button></a>'+
            '<button class="md-primary md-raised md-button md-ink-ripple" type="button" ng-click="getDirection();">Get Direction</button>'+'<br>'+
            '</div>'+
            '</div></CENTER>';

          var elTooltip = $compile(contentString)($scope);
          var infowindow = new google.maps.InfoWindow({
              content: elTooltip[0]
          });
          
          infowindow.open(map, marker);
          $scope.clicked = false;
          $scope.loading = false;
          self.toggleActivation();
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
          if(place.types[j] == "gym" || place.types[j] == "health" || place.types[j] == "hospital" || place.types[j] == "pharmacy"
             || place.types[j] == "insurance_agency" || place.types[j] == "dentist" || place.types[j] == "doctor"
             || place.types[j] == "spa"
            ){
            addMarker(place);    
          }
        }
        bounds.extend(place.geometry.location);
      }
      $scope.loading = false;
      $scope.clicked = false;
      map.fitBounds(bounds);
      self.toggleActivation();
    }
      
  }).
  controller('controller1', function ($scope) {

  }).
  controller('controller2', function ($scope) {
    // write Ctrl here
  });
