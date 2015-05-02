function MapManager(){
	var self = this;
	var rest = new RESTful();
	var pin = new Pin();

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

	self.initMap = function() {
		self.pinSetup();

		 var mapOptions = {
			zoom: 13,
			center: cordinateLyon
	    };
	    map = new google.maps.Map(document.getElementById('map'),
	    							mapOptions);
	    self.refreshPins();
	    //setInterval(self.refreshPins(), 60000 );
	};
 

	self.addMarker = function(aPin) {
		var type = aPin.type;
		var image;
		var contentString;
		  
		switch (type) { 
			case "velov" : 
				image = imageVelov;
				titre = "Velo'v";
				contentString = self.buildDescription(aPin,"velov");
				break;
			case "bar" : 
				image = imageBar;
				titre = "Bar";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "restau" : 
				image = imageRestau;
				titre = "Restaurant";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "soiree" : 
				image = imageSoiree;
				titre = "Soirée";
				contentString = self.buildDescription(aPin,"dynamique");
				break;
			case "hotel" : 
				image = imageHotel;
				titre = "Hôtel";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "monument" : 
				image = imageMonument;
				titre = "Monument";
				contentString = self.buildDescription(aPin,"normal");
				break;
			default :
				image = imageNormal
				titre = "Autre";
				contentString = self.buildDescription(aPin,"normal");
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
						marker : aMarker});
		


	};

	self.buildDescription=function(aPin, pinType) {
		var contentString = '';
		switch (pinType) { 
			case "velov" : 
				contentString = '<div id="content" data-id-pin=' + aPin.id + '>'+
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
													'<INPUT TYPE="button" NAME="like" class="like" VALUE="Like"> ' +
													'<INPUT TYPE="button" NAME="dislike" VALUE="Dislike" class="dislike"> ' +
													'<INPUT TYPE="button" NAME="unlike" VALUE="Unlike" class="unlike"> ' +
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
							'<INPUT TYPE="button" NAME="like" class="like" VALUE="Like"> ' +
							'<INPUT TYPE="button" NAME="dislike" VALUE="Dislike" class="dislike"> ' +
							'<INPUT TYPE="button" NAME="unlike" VALUE="Unlike" class="unlike"> ' +
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
							'<INPUT TYPE="button" NAME="like" class="like" VALUE="Like"> ' +
							'<INPUT TYPE="button" NAME="dislike" VALUE="Dislike" class="dislike"> ' +
							'<INPUT TYPE="button" NAME="unlike" VALUE="Unlike" class="unlike"> ' +
							'</br><small>Score : <b>' + aPin.score + ' </b></small>'+
						'</p>' +
					'</form>' +
					'</div>'+
					'</div>';
		}
		return contentString;
	};
	

	self.refreshPins = function(){
		for (var i = 0; i < markers.length; i++) {
	    	markers[i].marker.setMap(null);
	  	}
		pins = [];
		markers = [];
		pin.getPins(self.cbGetAllPins);
	};

	self.cbGetAllPins = function(data){
		for(var i in data.Pins){
			var p = data.Pins[i];
			self.addMarker(p);
		}
	};

	self.cbVotePin = function(data){
		retour = data.return
		if (retour == 0){
			alert("Erreur:Le vote n'a pas été pris en compte")

		}
	};

	self.pinSetup = function(){

		$(document).on("click",".like",function(){
			var pinID= $(this).closest('#content').data('id-pin');
			var userID=1;
			pin.vote(userID,pinID,1,self.cbVotePin);
		});
		$(document).on("click",".unlike",function(){
			var pinID= $(this).closest('#content').data('id-pin');
			var userID=1;
			pin.vote(userID,pinID,0,self.cbVotePin);
		});
		$(document).on("click",".dislike",function(){
			var pinID= $(this).closest('#content').data('id-pin');
			var userID=1;
			pin.vote(userID,pinID,-1,self.cbVotePin);
		});
			
	};

}
