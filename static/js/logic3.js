// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
/*var myMap = L.map("map", {
    center: [0, -10],
    zoom: 2
  });*/
  
   

var container = L.DomUtil.get('map');
                    if (container != null) {
                        container._leaflet_id = null;
                    }

// initializing a new map
var map = L.map('map', { scrollWheelZoom: false }).setView([46, 2], 1);

// getting countries shapes
//var link = '/static/data/nobelCountries.geojson';
var link = '/static/data/countries_new.geojson';

// Our style object
var mapStyle = {
    //color: '#ac434e',
    //fillColor: '#cf6873',
    color: '#4aa0af',
    fillColor: '#4aa0af',
    fillOpacity: 0.4,
    weight: 1.5,
};
var medalIcon = L.icon({
                        iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/Nobel_Prize.png/440px-Nobel_Prize.png',
                        iconSize: [35, 35], // size of the icon
                    });

// Grabbing our GeoJSON data..
                    /*d3.json(link, function (data) {
                        console.log(data)

                        // Creating a geoJSON layer with the retrieved data
                        geojsonLayer = L.geoJson(data, {

                            // Passing in our style object
                            style: mapStyle,
                            onEachFeature: onEachFeature,
                        })
                        geojsonLayer.addTo(map);
                    });*/

                    fetch(link)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        setupMapData(data); 
                        
                    })
                    .catch(err => {
                        console.error('An error ocurred', err);
                    });
                    marker = L.marker([43.64701, -79.39425], { icon: medalIcon });

function size(countOfCountry) {
                        return countOfCountry.map(d => 25 + d / 2.5)
              }
function setupMapData(data){
    // Creating a geoJSON layer with the retrieved data
    var dataToBeShown = [] ;
    data.features.forEach(function(feature) {
        //console.log(feature);
        if (feature.properties["ADMIN"] == "United States of America"){
            dataToBeShown.push(feature)
        }
    });
    /*geojsonLayer = L.geoJson(dataToBeShown, {

        // Passing in our style object
        style: mapStyle,
        onEachFeature: onEachFeature,
    })
    geojsonLayer.addTo(map);*/
    geojson = L.geoJson(dataToBeShown, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
}
function onEachFeature(feature, layer) {
                        // does this feature have a property named popupContent?
                        if (feature.properties) {
                            layer.bindPopup(feature.properties.ADMIN);
                            layer.on({
                                mouseover: highlightFeature,
                                mouseout: resetHighlight,
                                click: zoomToFeature
                            });
                        }
                    }
function getColor(d) {
    return d > 7.000 ? '#800026' :
           d > 6.000  ? '#BD0026' :
           d > 5.000  ? '#E31A1C' :
           d > 4.000  ? '#FC4E2A' :
           d > 3.000   ? '#FD8D3C' :
           d > 2.000   ? '#FEB24C' :
           d > 1.000   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Happiness Rating</h4>' +  (props ?
        '<b>' + props.country + '</b><br />' + props.rating + '7.786'
        : 'Hover over a country');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0.000, 1.000, 2.000, 3.000, 4.000, 5.000, 6.000, 7.000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
  