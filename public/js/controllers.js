'use strict';

/* Controllers */

angular.module('app.controllers', ['ngMaterial']).
  controller('AppCtrl', function ($scope, Service, $compile, $interval, $mdToast) {

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
    $scope.zoom = 10;
    $scope.clicked = false;

    //--------------------------------------------

    //-------------------------------------------------------------------------------------------
    var map;

    $scope.sendSocket = function(message){
         $scope.clicked = true;
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
        self.toggleActivation();
        if(criteria == 'doctor'){
          $scope.image_url = "http://img.clipartall.com/doctor-20clipart-doctors-clipart-800_784.png";
        } else if(criteria == 'hospital') {
          $scope.image_url = "http://img.clipartall.com/this-nice-cartoon-hospital-clip-art-is-free-for-personal-or-commercial-use-use-this-clip-art-on-your-book-illustrations-medical-projects-school-projects-clip-art-hospital-687_572.png";
        } else if(criteria == 'dentist'){
          $scope.image_url = "https://img.clipartfest.com/091825e5a878a9f441ff71c58571576d_happy-tooth-dentist-clipart-transparent_225-300.png";
        } else if(criteria == 'insurance_agency'){
          $scope.image_url = "https://s-media-cache-ak0.pinimg.com/originals/eb/70/c1/eb70c187b201143c6a964f597f9a0c85.png";
        } else if(criteria == 'gym'){
          $scope.image_url = "https://www.careconnect.com/images/icons/gym-06.png";
        }
        if (navigator.geolocation) {
          Service.getCurrentLocation().success(function(result) {
            console.log(result);
            var loc = result.loc.split(',');
            
          //navigator.geolocation.getCurrentPosition(function(position) {
            /*var myLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };*/
            var myLocation = {
              lat: parseInt(loc[0]),
              lng: parseInt(loc[1])
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
            console.log(error);
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
      $scope.clicked = true;
      if($scope.loading == false){
        $scope.loading = true;
        self.toggleActivation();
      }
      if(keywords == 'drug store'){
        $scope.image_url = "https://cdn.pixabay.com/photo/2014/03/25/16/24/medicine-296966_960_720.png";
      } else if(keywords == 'ambulance'){
        $scope.image_url = "http://www.clipartlord.com/wp-content/uploads/2014/04/ambulance5.png";
      } else if(keywords == 'gym'){
        $scope.image_url = "https://www.careconnect.com/images/icons/gym-06.png";
      } else if(keywords == 'spa') {
        $scope.image_url = "http://clipart-library.com/images/8T68KXkyc.png";
      } else if(keywords == 'sport center'){
        $scope.image_url = "https://bw-11f9e78e4899a78dedd439fc583b6693-bwcore.s3.amazonaws.com/articles/-A-free-sports-clipart-Sports.png";
      } else if(keywords == 'swimming pool'){
        $scope.image_url = "https://img.clipartfest.com/98ce110e547ddfdbeb4a2070fa8fd5f8_-pool-free-stock-photo-pool-transparent-background-clipart_958-566.png";
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
        console.log("callback");
        console.log(results);
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
            zoom:$scope.zoom,
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
            anchor: new google.maps.Point(60, 60),
            scaledSize: new google.maps.Size(70, 67)
          }
        });
      google.maps.event.addListener(marker, 'click', function() {

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
      console.log(places);
      for(var i = 0; i < places.length; i++){
        var place = places[i];
        console.log(place);
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
      console.log("selesai");
      self.toggleActivation();
    }
      
  }).
  controller('controller1', function ($scope) {

  }).
  controller('controller2', function ($scope) {
    // write Ctrl here
  });
