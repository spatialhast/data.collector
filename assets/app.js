
$("#cancel-btn").click(function() {
  UIkit.modal("#form-modal").hide();
  map.removeLayer(drawnItems);  
/*
  $("#hydrant-form")[0].reset();
  $("#changeset-comment").val("");
  map.closePopup();
  if (newMarker) {
    map.removeLayer(newMarker);
  }
  */
});


$("#save-btn").click(function() {
  UIkit.modal("#form-modal").hide();
  //event.preventDefault();
  setData();
});


    // Create Leaflet map object
    var map = L.map('map',{ 
      zoomControl: false,
      minZoom: 2,
      maxZoom: 18,
      center: [42.381899, -71.122499], 
      zoom: 13
    });

    // Add Tile Layer basemap
    /*
    L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png', {
      attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
      subdomains: '0123',
      minZoom: 2,
      maxZoom: 18
    }).addTo(map);
*/


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; Map Data <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);



/*
L.easyButton('<img src="">', function(){
   UIkit.modal("#form-modal").show();
}).addTo(map);

*/

var locateCtrl = L.control.locate({
  position: "topright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: false,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "uk-icon-crosshairs",
  iconLoading: "uk-icon-spinner uk-icon-spin",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 2000,
    timeout: 2000
  }
}).addTo(map);






    // Declare Variables
    // Create Global Variable to hold CartoDB points
    var cartoDBPoints = null;

    // Set your CartoDB Username
    var cartoDBUsername = "hast";

    // Write SQL Selection Query to be Used on CartoDB Table
    // Name of table is 'data_collector'
    var sqlQuery = "SELECT * FROM data_collector";

    // Create variable for Leaflet.draw features
    var drawnItems = new L.FeatureGroup();

    // Get CartoDB selection as GeoJSON and Add to Map
    function getGeoJSON(){
      $.getJSON("https://"+cartoDBUsername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQuery, function(data) {
        cartoDBPoints = L.geoJson(data,{
          pointToLayer: function(feature,latlng){
            var marker = L.marker(latlng);
            marker.bindPopup('<p>' + feature.properties.description + '<br /><em>Submitted by </em>' + feature.properties.name + '</p>');
            return marker;
          }
        }).addTo(map);
      });
    };

    // Run showAll function automatically when document loads
    $( document ).ready(function() {
      getGeoJSON();
    });

    var drawControl = new L.Control.Draw({
      draw : {
        polygon : false,
        polyline : false,
        rectangle : false,
        circle : false
      },
      edit : false,
      remove: false
    });

    map.addControl(drawControl);
    
    map.on('draw:created', function (e) {
      var layer = e.layer;

      map.addLayer(drawnItems);
      drawnItems.addLayer(layer);

      //dialog.dialog( "open" );
      UIkit.modal("#form-modal").show();


    });

    var submitToProxy = function(q){
      $.post("php/callProxy.php", { //Put path to your callProxy.php file here
        qurl:q,
        cache: false,
        timeStamp: new Date().getTime()
      }, function(data) {
        console.log(data);
        refreshLayer();
      });
    };


/*
    dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
      position: {
        my: "center center",
        at: "center center",
        of: "#map"
      },
      buttons: {
        "Add to Database": setData,
        Cancel: function() {
          dialog.dialog("close");
          map.removeLayer(drawnItems);
        }
      },
      close: function() {
        form[ 0 ].reset();
        console.log("Dialog closed");
      }
    });
*/


/*
    form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault();
      setData();
    });

*/


function setData() {
  var enteredUsername = username.value;
  var enteredDescription = description.value;
  drawnItems.eachLayer(function (layer) {
    var sql = "INSERT INTO data_collector (the_geom, description, name, latitude, longitude) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('";
      var a = layer.getLatLng();
      console.log(a);
      var sql2 ='{"type":"Point","coordinates":[' + a.lng + "," + a.lat + "]}'),4326),'" + enteredDescription + "','" + enteredUsername + "','" + a.lat + "','" + a.lng +"')";
  var pURL = sql+sql2;
  console.log(pURL);
  submitToProxy(pURL);
  console.log("Feature has been submitted to the Proxy");
});
  map.removeLayer(drawnItems);
  drawnItems = new L.FeatureGroup();
  console.log("drawnItems has been cleared");
  dialog.dialog("close");
};

function refreshLayer() {
  if (map.hasLayer(cartoDBPoints)) {
    map.removeLayer(cartoDBPoints);
  };
  getGeoJSON();
};