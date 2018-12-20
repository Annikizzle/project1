// maps 

var coordsStringArray = [];

// use these variables to send the the distance calulator
var startPoint = {
  lat: 0,
  lng: 0
};
var endPoint = {
  lat: 0,
  lng: 0
};

// these variables are in a format that can be sent to a weather API call
var startPointString;
var endPointString;

// initialize the map when the page loads
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat: 41.85, lng: -87.65}
    });
    
    directionsDisplay.setMap(map);

    var onChangeHandler = function() {
      calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('start').addEventListener('change', onChangeHandler);
    document.getElementById('end').addEventListener('change', onChangeHandler);
  }


// this function removes the "()" from the coordsStringArray elements
function cleanString(stringValue){
  newString = stringValue.replace('(', '').replace(')', '').replace(' ', '');
  return newString;
}

// this function shows the route on the map and populates the coordsStingArray variable
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: 'DRIVING'
  }, function(response, status) {
      console.log(response);
      // console.log(response.routes[0].overview_path[15].toString()); this .toString function will return the lat/lng values as a single string
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      coordsStringArray = [];

      // set the starting point of the route
      startPoint.lat = response.routes[0].overview_path[0].lat();
      startPoint.lng = response.routes[0].overview_path[0].lng();
      startPointString = response.routes[0].overview_path[0].toString();
      coordsStringArray.push(cleanString(response.routes[0].overview_path[0].toString()));

      // console.log(startPoint);
      // console.log(startPointString);
      
      for (var i=1; i < response.routes[0].overview_path.length; i++) {
        // this if statement will push the coordinates 
        if (getDistanceFromLatLonInKm(startPoint.lat, startPoint.lng, response.routes[0].overview_path[i].lat(), response.routes[0].overview_path[i].lng()) >= 80) {
          
          // push the coords to the array
          coordsStringArray.push(cleanString(response.routes[0].overview_path[i].toString()));

          // set the new startpoint for the distance calculation
          startPoint.lat = response.routes[0].overview_path[i].lat()
          startPoint.lng = response.routes[0].overview_path[i].lng()
        }
      }
      console.log("Array: "+ coordsStringArray);
    } else {
      //window.alert('Directions request failed due to ' + status);
    }
  });
}

// Get the distance between 2 latlng points
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) { 
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
  
}

// get the list of city IDs from the .json file. reference this list to get city id using lat/lng values
$.getJSON("assets/json/city.list.json", function(json) {
  console.log(json);
}); // cors error in chrome, but works fine in firefox

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
var latlng = {
  lat: 41.692611,
  lng: -81.192178
}

var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyBLjJhcaHNLroE3ch8eeLZJEmtA1fziUFg";
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
});

// var latitude;
// var longitude;
// var origin;
// var destination;

function getUserLocation(){
    navigator.geolocation.getCurrentPosition(function(position){
        // console.log(position);

        // console.log(position.coords.latitude);
        // console.log(position.coords.longitude);
        var latlong = position.coords.latitude + "," + position.coords.longitude;
        console.log(latlong);
        
        $("#mapsImage").attr("src", "https://www.google.com/maps/embed/v1/place?key=AIzaSyBLjJhcaHNLroE3ch8eeLZJEmtA1fziUFg&q="+latlong+"&center="+latlong)

    })
}

function getWeather() {
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?zip=44092,us&appid=f9d254aedad74e95688746dad9882b99";

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    });

}

function getRoute() {

    $("#mapsImage").attr("src", "https://www.google.com/maps/embed/v1/directions?key=AIzaSyBLjJhcaHNLroE3ch8eeLZJEmtA1fziUFg&origin="+origin+"&destination="+destination)
}
origin = "cleveland+ohio";
destination = "akron+ohio";

// getRoute();
var myOptions = {
    zoom: 10,
    center: new google.maps.LatLng(40.84, 14.25),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);

   var directionsService = new google.maps.DirectionsService();
   var directionsRequest = {
     origin: origin,
     destination: destination,
     provideRouteAlternatives: true,
     travelMode: google.maps.DirectionsTravelMode.DRIVING,
     unitSystem: google.maps.UnitSystem.METRIC
   };

directionsService.route(
    directionsRequest,
    function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            for (var i = 0, len = response.routes.length; i < len; i++) {
                new google.maps.DirectionsRenderer({
                    map: mapObject,
                    directions: response,
                    routeIndex: i
                });
            }
        } else {
            $("#error").append("Unable to retrieve your route<br />");
        }
    }

 );
