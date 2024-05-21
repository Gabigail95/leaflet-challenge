// Create the map object with options
let map = L.map("map", {
    center: [37.7749, -122.4194], // Centered on San Francisco
    zoom: 5
  });
  
  // Add the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(map);
  
  // Define the URL for the earthquake GeoJSON data
  let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // Fetch the data and plot on the map
  fetch(earthquakeUrl)
    .then(response => response.json())
    .then(data => {
      // Define a function to set marker size based on earthquake magnitude
      function markerSize(magnitude) {
        return magnitude * 4;
      }
  
      // Define a function to set marker color based on earthquake depth
      function markerColor(depth) {
        return depth > 90 ? '#FF5F65' :
               depth > 70 ? '#FCA35D' :
               depth > 50 ? '#FDB72A' :
               depth > 30 ? '#F7DB11' :
               depth > 10 ? '#DCED11' :
                            '#A3F600';
      }
  
      // Add GeoJSON data to the map
      L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
        }
      }).addTo(map);
  
      // Add legend to the map
      let legend = L.control({ position: 'bottomright' });
  
      legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'info legend'),
            depthGrades = [0, 10, 30, 50, 70, 90],
            labels = ['<strong>Depth (km)</strong>'];
  
        // Loop through depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depthGrades.length; i++) {
          div.innerHTML +=
            '<i style="background:' + markerColor(depthGrades[i] + 1) + '"></i> ' +
            depthGrades[i] + (depthGrades[i + 1] ? '&ndash;' + depthGrades[i + 1] + '<br>' : '+');
        }
  
        return div;
      };
  
      legend.addTo(map);
    })
    .catch(error => console.error("Error fetching earthquake data: ", error));
  