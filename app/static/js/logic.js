/ GOAL 1
// Can I render a basic base map? - Set up Leaflet correctly
// Can we fetch the data that we need to plot?


// STEP 1: Init the Base Layers

// Define variables for our tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


// Step 2: Create the Overlay layers

// Store the API query variables.
// For docs, refer to https://dev.socrata.com/docs/queries/where.html.
// And, refer to https://dev.socrata.com/foundry/data.cityofnewyork.us/erm2-nwe9.
let baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
// Add the dates in the ISO formats
let date = "$where=created_date between'2023-01-01T00:00:00' and '2024-01-01T00:00:00'";
// Add the complaint type.
let complaint = "&complaint_type=Rodent";
// Add a limit.
let limit = "&$limit=100";

// Assemble the API query URL.
let url = baseURL + date + complaint + limit;

d3.json(url).then(function (data) {
  console.log(data);

  // create the overlay layer
  let markers = L.markerClusterGroup();

  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let location = row.location;

    // create marker
    if (location) {
      let marker = L.marker([location.coordinates[1], location.coordinates[0]]);
      let popup = `<h1>${row.incident_address}</h1><hr><h2>${row.borough}</h2><hr><h3>${row.descriptor} | ${row.created_date}</h3>`;
      marker.bindPopup(popup);
      markers.addLayer(marker);
    }
  }

  // Step 3: BUILD the Layer Controls

  // Only one base layer can be shown at a time.
  let baseLayers = {
    Street: street,
    Topography: topo
  };

  let overlayLayers = {
    Markers: markers
  }

  // Step 4: INIT the Map
  let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11,
    layers: [street, markers]
  });


  // Step 5: Add the Layer Control filter + legends as needed
  L.control.layers(baseLayers, overlayLayers).addTo(myMap);

});