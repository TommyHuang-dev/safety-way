function getUserLocation() {
	// Get the location of the user using geolocation api, outputs it to #userLocation, and calls calcRisk
	// Does not have any parameters
	// Does not return anything
	// 'borrowed and modified from an online source'
	
 	var output = document.getElementById("userLocation");

	
  	if (!navigator.geolocation){
		// If geolocation is not supported, tell the user (don't leave them hanging)
   		output.innerHTML = "Geolocation is not supported by your browser";
    	return;
  	}

 	function success(position) {
		// Geolocation works, so get the coordinates of the user position
    	var latitude  = position.coords.latitude;
    	var longitude = position.coords.longitude;
		calcRisk(longitude, latitude);
    	output.innerHTML = latitude + '° ' + longitude + '° ';
  	}

	function error() {
		// Error in getting coordinates, e.g. user denies permission for location
    	output.innerHTML = "<p>Unable to retrieve your location</p>";
  	}
	
	// Loading message
  	output.innerHTML = "<p>Locating…</p>";
	
	// Call the geolocation function
  	navigator.geolocation.getCurrentPosition(success, error);
}
      
  function calcRisk(curLocLong, curLocLat) {
		// Calculates the risk score to display to user. Takes data from Crime Data folder, uses square root function that models human danger perception.
		// Parameters: user's current longitude and user's current latitude
		// Does not return anything
		
    // Set coordinates
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
	// Searches for a safer location from the users current location, checking a 1km radius area 2km away in many directions
	// Parameters: range of the search area, user's current location, converted latitude distance, converted longitude distance, r
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

window.onload = getUserLocation();