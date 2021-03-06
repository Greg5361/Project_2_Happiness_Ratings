
//Global variables
var countries_set = [];
var regions_set = [];
var countries_non_unique = [];
var regions_non_unique = [];
var countries_to_be_shown = [];
var ratings_to_be_shown = [];
var jsonData;
var regionSelectField = d3.select("#region");
var bubbleChartDiv = document.getElementById('bubble');
var map;
var info;

//Get the Data From API
function getDataFromApi(){
  jsonData = [];
  fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        jsonData = data;
        setupIntialData();
    })
    .catch(err => {
        console.error('An error ocurred', err);
  });
}

// Setup the intial Data for the page
function setupIntialData(){
      jsonData.forEach(function(obj) { 
      

      countries_non_unique.push(obj.Country);
      regions_non_unique.push(obj.Region);
      });
      countries_set = countries_non_unique.filter((value, index) => countries_non_unique.indexOf(value) === index);
      regions_set = regions_non_unique.filter((value, index) => regions_non_unique.indexOf(value) === index);
      console.log(countries_set); 
      console.log(regions_set); 
      
      regions_set.forEach(region => {
        regionSelectField.append("option").text(region)
      });
      console.log(countries_to_be_shown);
      console.log(ratings_to_be_shown);
      resetBubbleChart(regions_set[0]);
}


//Reset Bubble chart for the selected Region
function resetBubbleChart(regionName){
  d3.select("bubble").html("");
  countries_to_be_shown = [];
  ratings_to_be_shown = [];
  //main_json_data.forEach(function(obj) {
  jsonData.forEach(function(obj) {
   if (obj.Region == regionName){
      countries_to_be_shown.push(obj.Country);
      ratings_to_be_shown.push(obj.Rating);
   }
  });
  var trace = {
                        x: countries_to_be_shown,
                        y: ratings_to_be_shown,
                        mode: 'markers',
                        marker: {
                            size: ratings_to_be_shown.map(d => 25 + d / 2.5),
                            color: [100, 10, 36, 191, 356, 17, 8, 1, 6, 6, 18, 1, 24, 8, 1, 1, 5, 2, 5, 3, 1, 1, 1, 1, 4, 5, 1],
                            colorscale: 'Rainbow'
                        },
                        text: countries_to_be_shown
                    };

  var data = [trace];

  var layout = {
  title: 'Happiness Ratings',
  showlegend: false,
  yaxis:{
    title:"Happiness Ratings"
  },
  margin: {
                            'l': 100,
                            'r': 0,
                            't': 50,
                            'b': 150
        }
  };

  Plotly.newPlot('bubble', data, layout);
  bubbleChartDiv.on('plotly_click', function (data) {
                        data.points.forEach(function (pt) {
                          resetGaugeChartFor(pt.x, pt.y);
                          return;
                        });
                  });
  
  document.getElementById('chartHeaderLabel').innerText = regionName;

  resetGaugeChartFor(countries_to_be_shown[0], ratings_to_be_shown[0]);

}

function resetGaugeChartFor(country, rating){
  d3.select("gauge").html("");
  var data = [
                        {
                            domain: { x: [0, 1], y: [0, 1] },
                            value: rating,
                            type: 'indicator',
                            mode: 'gauge+number',
                            gauge: {
                                axis: { range: [null, 10.000] },
                                bar: { color: '#FF575A' },
                                steps: [
                                    { range: [0, 1.000], color: '#FFF2F2' },
                                    { range: [1.000, 2.000], color: '#FFE5E5' },
                                    { range: [2.000, 3.000], color: '#FFCBCC' },
                                    { range: [3.000, 4.000], color: '#FFB1B2' },
                                    { range: [4.000, 5.000], color: '#FF9799' },
                                    { range: [5.000, 6.000], color: '#FF8A8C' },

                                ]
                            }
                        }
                    ];
  var layout = {
                        title: {
                            text: `Happiness Rating for <br>${country}`,
                            font: {
                                family: 'Courier New, monospace',
                                size: 21,
                                color: "#ac434e"
                            },

                        }
                    };

  Plotly.newPlot('gauge', data, layout);
  resetMapForTheReqion(regions_set[0], countries_set[0]);
  //Handler for Bubble click in the bubble chart
  
}


//Handler funtion when region select option is changed
regionSelectField.on("change", change)
function change() {
    this.options[this.selectedIndex].value
    console.log(this.options[this.selectedIndex].value)
    resetBubbleChart(this.options[this.selectedIndex].value);
}






// Geojson Feature parser
function onEachFeature(feature, layer) {
    if (feature.properties) {
        layer.bindPopup(feature.properties.ADMIN);
    }
}




function resetMapForTheReqion(region, country){
    var container = L.DomUtil.get('map');
                    if (container != null) {
                        container._leaflet_id = null;
                    }

    // initializing a new map
    map = L.map('map', { scrollWheelZoom: false }).setView([46, 2], 1);
    var link = '/static/data/countries_new.geojson';

    // Our style object
    var mapStyle = {
        color: '#4aa0af',
        fillColor: '#4aa0af',
        fillOpacity: 0.4,
        weight: 1.5,
    };
    fetch(link)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setupMapData(data); 
      
    })
    .catch(err => {
      console.error('An error ocurred', err);
    });
}

function size(countOfCountry) {
                        return countOfCountry.map(d => 25 + d / 2.5)
}
function setupMapData(data){
    // Creating a geoJSON layer with the retrieved data
    var dataToBeShown = [] ;
    countries_to_be_shown.forEach(function(country, index){
        data.features.forEach(function(feature) {
          var countryToBeChecked;
          if (country == "United States"){
            countryToBeChecked = "United States of America"
          }
          else{
            countryToBeChecked = country
          }
          
          if (feature.properties["ADMIN"] == countryToBeChecked){
              feature.properties["rating"] = ratings_to_be_shown[index];
              dataToBeShown.push(feature)
          }
      });
    });
    titleLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + API_KEY, {
                 id: 'mapbox/light-v9',
                 tileSize: 512,
                 zoomOffset: -1
                }).addTo(map);
    geojson = L.geoJson(dataToBeShown, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
    map.fitBounds(geojson.getBounds());
    info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

// method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Happiness Rating</h4>' +  (props ?
            '<b>' + props.ADMIN + '</b><br />' + props.rating 
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
}
function onEachFeature(feature, layer) {
                        // does this feature have a property named popupContent?
                        if (feature.properties) {
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
        fillColor: getColor(feature.properties.rating),
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




// Wrap every letter in a span
var textWrapper = document.querySelector('.ml1 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml1 .letter',
    scale: [0.3,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 600,
    delay: (el, i) => 70 * (i+1)
  }).add({
    targets: '.ml1 .line',
    scaleX: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700,
    offset: '-=875',
    delay: (el, i, l) => 80 * (l - i)
  }).add({
    targets: '.ml1',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });


// Call the Get API fucntion
getDataFromApi();
