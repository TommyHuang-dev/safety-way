// Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var output = pos.lat + "°N, " + pos.lng + "°E";
      document.getElementById("userLocation").innerHTML = output;
      calcRisk(pos.lng, pos.lat);

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }
  function calcRisk(curLocLong, curLocLat) {
    // Set coords
    var coords = [];
    var squareRange = [];
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var jsonData = JSON.parse(this.responseText);
          for (i = 0; i < jsonData.features.length; i++) {
            coords.push({'x':jsonData.features[i].geometry.x, 'y':jsonData.features[i].geometry.y});
          }

          // console.log(coords);
          var longCov = 80.00;
          var latCov = 111.045;
          // Set current location
          var curLoc = [curLocLong, curLocLat];
          // Set radius, in kilometers
          var r = 1;
          document.getElementById("radius").innerHTML = r;
      document.getElementById("radius2").innerHTML = r;

          // Initialize square range
          // Scan thru and save all  points withing square range
          // console.log(coords);
          // console.log(curLoc);

          for (var i = 0; i < coords.length; i++) {
            if (coords[i].x < curLoc[0] + (r / longCov)
              && coords[i].x > curLoc[0] - (r / longCov)
              && coords[i].y < curLoc[1] + (r / latCov)
              && coords[i].y > curLoc[1] - (r / latCov))
              {
              squareRange.push([coords[i].x, coords[i].y]);
            }
          }
          console.log(squareRange);
      document.getElementById("crimeCount").innerHTML = squareRange.length;

          //square root value
          var countSquareRange = Math.floor(Math.sqrt(squareRange.length) * 10) /10;



          if (Math.floor(Math.sqrt(squareRange.length) * 10) /10 > 10) {
            countSquareRange = 10;

          }
          // output to webpage
          document.getElementById("crimeRatingText").innerHTML = countSquareRange + "/10";

      document.getElementById("scale").style.width = countSquareRange * 10 + "%";
      }

      findDirection(squareRange, curLoc, latCov, longCov, r);

    };
    xmlhttp.open("GET", "https://burntpotatoes.github.io/safety-way/Crime%20Data/CrimeData.json", true);
    xmlhttp.send();
    //pos.long and pos.lat
  }

function findDirection(squareRange, curLoc, latCov, longCov, r) {
    var northCoords = [];
    var southCoords = [];
    var eastCoords = [];
    var westCoords = [];
    var directionList = [];

    for (var i = 0; i < squareRange.length; i++) {
      if (squareRange[i][1] < curLoc[0] + (r / latCov) && squareRange[i][0] > curLoc[0]) {
        northCoords.push([squareRange[i].x, squareRange[i].y]);
      }
      else if (squareRange[i][1] > curLoc[0] - (r / latCov) && squareRange[i][0] < curLoc[0]) {
        southCoords.push([squareRange[i].x, squareRange[i].y]);
      }
      else if (squareRange[i][0] < curLoc[0] + (r / longCov) && squareRange[i][1] > curLoc[0]) {
        eastCoords.push([squareRange[i].x, squareRange[i].y]);
      }
      else if (squareRange[i][0]> curLoc[0] - (r / longCov) && squareRange[i][1] < curLoc[0]) {
        westCoords.push([squareRange[i].x, squareRange[i].y]);
      }
    }
    var northCount = northCoords.length;
    var southCount = southCoords.length;
    var eastCount = eastCoords.length;
    var westCount = westCoords.length;

    directionList.push(northCount, southCount, eastCount, westCount);
    console.log(directionList);

    var indexOfSafestDirection = directionList.indexOf(Math.min(directionList));
    if (indexOfSafestDirection = 0) {
      console.log("NORTH");
    }
    else if (indexOfSafestDirection = 1) {
      console.log("SOUTH");
    }
    else if (indexOfSafestDirection = 2) {
      console.log("EAST");
    }
    else if (indexOfSafestDirection = 3) {
      console.log("WEST");
    }
}

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
