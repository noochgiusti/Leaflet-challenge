var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(queryUrl, function(data) {
    console.log(data.features);

  createFeatures(data.features);
});


function getColor(d) {
	return d > 5 ? '#ef5c16' :
	       d > 4  ? '#ef8016' :
	       d > 3  ? '#efca16' :
	       d > 2  ? '#efe816' :
	       d > 1  ? '#c3ef59' :
	                 '#9ccf16';
}

var legend = L.control({position: 'topleft'});

legend.onAdd = function (map) {

	  var div = L.DomUtil.create('div', 'info legend'),
		  mags = [0, 1, 2, 3, 4, 5],
		  labels = [];

 	  for (var i = 0; i < mags.length; i++) 
    {
 		  div.innerHTML +=
 			  '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
 			  mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
 	  }
 	return div;
};


function createFeatures(earthquakeData){


  var earthquakes = L.geoJSON(earthquakeData,{
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 4,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        fillOpacity: 0.9})

        .bindPopup("<h3>"+feature.properties.place +"</h3><hr><p>"
      + new Date(feature.properties.time)+"</p><p><strong>Magnitude: "
      + feature.properties.mag+"</strong></p>");
  }   
});

  createMap(earthquakes);
}


function createMap(earthquakes) {

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });



  var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
    "GrayScale Map": graymap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [20, -70],
    zoom: 2.2,
    layers: [graymap,earthquakes]
  });


  L.control.layers(baseMaps,overlayMaps, {
    collapsed: false
  }).addTo(myMap);

 legend.addTo(myMap);
}