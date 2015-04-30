
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
	var type = aPin.type;
	var image;
	var contentString;
	  
	switch (type) { 
		case "velov" : 
			image = imageVelov;
			titre = "Velo'v";
			contentString = buildDescription(aPin,"velov");
			break;
		case "bar" : 
			image = imageBar;
			titre = "Bar";
			contentString = buildDescription(aPin,"normal");
			break;
		case "restau" : 
			image = imageRestau;
			titre = "Restaurant";
			contentString = buildDescription(aPin,"normal");
			break;
		case "soiree" : 
			image = imageSoiree;
			titre = "Soirée";
			contentString = buildDescription(aPin,"dynamique");
			break;
		case "hotel" : 
			image = imageHotel;
			titre = "Hôtel";
			contentString = buildDescription(aPin,"normal");
			break;
		case "monument" : 
			image = imageMonument;
			titre = "Monument";
			contentString = buildDescription(aPin,"normal");
			break;
		default :
			image = imageNormal
			titre = "Autre";
			contentString = buildDescription(aPin,"normal");
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

function buildDescription(aPin, pinType) {
	var contentString = '';
	switch (pinType) { 
		case "velov" : 
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">' + aPin.title + '</h2>'+
					'<div id="bodyContent">'+						
						'<p>' + aPin.description + '</p>'+
						'<p>Nombre de places: <b>' + aPin.velo + '</b><br />' +
						'Nombre de vélos disponibles: <b>' + aPin.libre + '</b></p>'+
						'<p><small>Posté par ' + aPin.user + '</small></p>'+
						'<form name="form1">' +
							'<p>' +
								'<INPUT TYPE="button" NAME="like" VALUE="Like" onClick="vote(1,' + aPin.id + ',1)"> ' +
								'<INPUT TYPE="button" NAME="dislike" VALUE="Dislike" onClick="vote(1,' + aPin.id + ',-1)"> ' +
								'<INPUT TYPE="button" NAME="unvote" VALUE="Unvote" onClick="vote(1,' + aPin.id + ',0)"> ' +
								'</br><small>Score : <b>' + aPin.score + ' </b></small>'+
							'</p>' +
						'</form>' +
					'</div>'+
				'</div>';
			break;
			
		case "dynamique" : 
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">' + aPin.title + '</h2>'+
				'<div id="bodyContent">'+
				'<p>' + aPin.description + '</p>'+
				'<p>Début: <b>' + aPin.dateDebut + '</b><br />Fin: <b>' + aPin.dateFin + '</b></p>'+
				'<p><small>Posté par ' + aPin.user + '</small></p>'+
				'<form name="form1">' +
					'<p>' +
						'<INPUT TYPE="button" NAME="like" VALUE="Like" onClick="vote(1,' + aPin.id + ',1)"> ' +
						'<INPUT TYPE="button" NAME="dislike" VALUE="Dislike" onClick="vote(1,' + aPin.id + ',-1)"> ' +
						'<INPUT TYPE="button" NAME="unvote" VALUE="Unvote" onClick="vote(1,' + aPin.id + ',0)"> ' +
						'</br><small>Score : <b>' + aPin.score + ' </b></small>'+
					'</p>' +
				'</form>' +
				'</div>'+
				'</div>';
			break;
		
		default :
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h2 id="firstHeading" class="firstHeading">' + aPin.title + '</h2>'+
				'<div id="bodyContent">'+
				'<p>' + aPin.description + '</p>'+
				'<p><small>Posté par ' + aPin.user + '</small></p>'+
				'<form name="form1">' +
					'<p>' +
						'<INPUT TYPE="button" NAME="like" VALUE="Like" onClick="vote(1,' + aPin.id + ',1)"> ' +
						'<INPUT TYPE="button" NAME="dislike" VALUE="Dislike" onClick="vote(1,' + aPin.id + ',-1)"> ' +
						'<INPUT TYPE="button" NAME="unvote" VALUE="Unvote" onClick="vote(1,' + aPin.id + ',0)"> ' +
						'</br><small>Score : <b>' + aPin.score + ' </b></small>'+
					'</p>' +
				'</form>' +
				'</div>'+
				'</div>';
	}
	return contentString;
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
