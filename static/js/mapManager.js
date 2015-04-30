
var markers = [];
var pins = [];
var map; // object containing the map
var cordinateLyon = new google.maps.LatLng(45.7601676, 4.8328885);

// image de marker
var imageNormal = Flask.url_for("static", {"filename": "./assets/normal.png"});
var imageVelov = Flask.url_for("static", {"filename": "./assets/velov.png"});
var imageBar =  Flask.url_for("static", {"filename": "./assets/bar.png"});
var imageSoiree =Flask.url_for("static", {"filename": "./assets/soiree.png"});
var imageRestau = Flask.url_for("static", {"filename": "./assets/restau.png"});
var imageHotel = Flask.url_for("static", {"filename": "./assets/hotel.png"});
var imageMonument = Flask.url_for("static", {"filename": "./assets/monument.png"});

function initMap() {
	 var mapOptions = {
		zoom: 13,
		center: cordinateLyon
    };
    map = new google.maps.Map(document.getElementById('map'),
    							mapOptions);
    refreshPins();
    setInterval(refreshPins, 60000 );
}
 

function addMarker(aPin) {
	// ToDo : gerer les différents types de marker
	
	var type = aPin.type;
	var image;
	switch (type) { 
		case "velov" : 
			image = imageVelov;
			titre = "Velo'v";
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">Station de Velo\'v</h2>'+
				'<div id="bodyContent">'+
				'<p> ------DESCRIPTION DE LA STATION DE VELO\'V------ </p>'+
				'</div>'+
				aPin.libre +
				'</div>';
			break;
		case "bar" : 
			image = imageBar;
			titre = "Bar";
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">Bar</h2>'+
				'<div id="bodyContent">'+
				'<p> ------DESCRIPTION DU BAR------ </p>'+
				'</div>'+
				'</div>';
			break;
		case "restau" : 
			image = imageRestau;
			titre = "Restaurant";
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">Restaurant</h2>'+
				'<div id="bodyContent">'+
				'<p> ------DESCRIPTION DU RESTAURANT------ </p>'+
				'</div>'+
				'</div>';
			break;
		case "soiree" : 
			image = imageSoiree;
			titre = "Soirée";
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">Soirée</h2>'+
				'<div id="bodyContent">'+
				'<p> ------DESCRIPTION DE LA SOIREE------ </p>'+
				'</div>'+
				'</div>';
			break;
		case "hotel" : 
			image = imageHotel;
			titre = "Hôtel";
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">Hôtel</h2>'+
				'<div id="bodyContent">'+
				'<p> ------DESCRIPTION DE L\'HOTEL------ </p>'+
				'</div>'+
				'</div>';
			break;
		case "monument" : 
			image = imageMonument;
			titre = "Monument";
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">Monument</h2>'+
				'<div id="bodyContent">'+
				'<p> ------DESCRIPTION DU MONUMENT------ </p>'+
				'</div>'+
				'</div>';
			break;
		default :
			image = imageNormal
			titre = "Autre";
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">Autre point d\'intérêt</h2>'+
				'<div id="bodyContent">'+
				'<p> ------DESCRIPTION DU POINT d\'INTERET------ </p>'+
				'</div>'+
				'</div>';
		}

	var infowindow = new google.maps.InfoWindow({
      content: contentString
	});
		
	var aMarker = new google.maps.Marker({
		position: new google.maps.LatLng(aPin.lat, aPin.lng),
		map: map,
		icon: image,
		title: titre
	});
	
	google.maps.event.addListener(aMarker, 'click', function() {
		infowindow.open(map,aMarker);
	});
	
	markers.push({pin : aPin,
					marker : aMarker})
}


function refreshPins () 
{
	for (var i = 0; i < markers.length; i++) {
    	markers[i].marker.setMap(null);
  	}
	pins = [];
	markers = [];
	doGetPins("/pins/");
}
