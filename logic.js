
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    var earthquakes = [];

    for (var i =0; i < earthquakeData.length; i++) {

        earthquakes.push(
            L.circle([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
                stroke: false,
                fillOpacity:0.75,
                color: colors(earthquakeData[i].properties.mag),
                fillColor : colors(earthquakeData[i].properties.mag),
                radius: (earthquakeData[i].properties.mag)*30000
            }).bindPopup(("<h3>" + earthquakeData[i].properties.place +
            "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>"))
        )
    }
    var earthquake_layer = L.layerGroup(earthquakes);

  createMap(earthquake_layer);
}

function colors(mag) {
    if (mag>4) {
        var color = "darkred";
    }
    else if (mag>3&&mag<4) {
        var color = "#ff4000";
    }
    else if (mag>2&&mag<3) {
        var color = "#ff8000";
    }
    else if (mag>1&&mag<2) {
      var color = "#ffbf00";
    }
    else {
        var color = "#ffff00"}
    return color;
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };


  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4],
    labels = ["#ffff00","#ffbf00", "#ff8000", "#ff4000", "darkred"];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + labels[i] + '">&nbsp;&nbsp;&nbsp;</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(myMap);

}