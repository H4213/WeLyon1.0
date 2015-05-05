function MapManager(){
	var self = this;
	var rest = new RESTful();
	var pin = new Pin();
	var idUser = localStorage.getItem('idUser');
	if (idUser==null){
	idUser=-1;
	}
	var infowindow = new google.maps.InfoWindow({content : ""});
	var markers = new Map();
	var marker;
	var listIdCategories=[];
	var map; // object containing the map
	var cordinateLyon = new google.maps.LatLng(45.7601676, 4.8328885);
	var newPos =new google.maps.LatLng(0,0);
	
	// image de marker
	var imageNormal = Flask.url_for("static", {"filename": "./assets/normal.png"});
	var imageVelov = Flask.url_for("static", {"filename": "./assets/velov.png"});
	var imageBar =  Flask.url_for("static", {"filename": "./assets/bar.png"});
	var imageSoiree =Flask.url_for("static", {"filename": "./assets/soiree.png"});
	var imageRestau = Flask.url_for("static", {"filename": "./assets/restaurant.png"});
	var imageHotel = Flask.url_for("static", {"filename": "./assets/hotel.png"});
	var imageMonument = Flask.url_for("static", {"filename": "./assets/monument.png"});
	var imageFacebook = Flask.url_for("static", {"filename": "./assets/facebook.png"})
	var imageTCL = Flask.url_for("static", {"filename": "./assets/tcl.png"})
	var imageHopital = Flask.url_for("static", {"filename": "./assets/hopital.png"})



	self.initMap = function() {
		self.pinSetup();

		 var mapOptions = {
			zoom: 13,
			center: cordinateLyon
	    };
	    map = new google.maps.Map(document.getElementById('map'),
	    							mapOptions);
	    var centerControlDiv = document.createElement('div');
		var centerControl = self.CenterControl(centerControlDiv, map);
		centerControlDiv.index = 1;
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
		

		google.maps.event.addListener(map, 'zoom_changed', self.zoomHandler );
		google.maps.event.addListener(map, 'center_changed', self.zoomHandler );


	    //self.refreshPins();
	    //setInterval(self.refreshPins(), 60000 );
	};

	self.zoomHandler = function () {
		var bounds = map.getBounds();
		var height =  $("#map").height();
		var width =  $("#map").width();
		var numberOfMarkers = Math.floor(height*width/(50*50));
		var toDisplay = [];
		for (var valeur of markers.values()) {
			if (bounds.contains(valeur.marker.getPosition())) {
				valeur.marker.setVisible(false);
				toDisplay.push(valeur);	
			}
		}
		toDisplay.sort(function(a,b) {
			if (a.pin.score < b.pin.score) {
				return -1;
			}
			if (a.pin.score > b.pin.score) {
				return 1;
			}
			return 0;
		});
		for ( var i = 0 ;  ( i <30 ) && (i < toDisplay.length)  ; i++) {
			
			toDisplay[i].marker.setVisible(true);
		}
	}
  
	self.CenterControl=function (controlDiv, map) {

	  // Set CSS for the control border
	  var controlUI = document.createElement('div');
	  controlUI.style.backgroundColor = '#fff';
	  controlUI.style.border = '2px solid #fff';
	  controlUI.style.borderRadius = '3px';
	  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
	  controlUI.style.cursor = 'pointer';
	  controlUI.style.marginTop = '22px';
	  controlUI.style.marginRight = '22px';
	  controlUI.style.textAlign = 'center';
/*	  controlUI.style.display = 'none';
*/	  controlUI.title = 'Cliquer pour ajouter un event';
	  controlDiv.appendChild(controlUI);

	  // Set CSS for the control interior
	  var controlText = document.createElement('div');
	  controlText.style.color = 'rgb(25,25,25)';
	  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
	  controlText.style.fontSize = '16px';
	  controlText.style.lineHeight = '38px';
	  controlText.style.paddingLeft = '5px';
	  controlText.style.paddingRight = '5px';
	  controlText.innerHTML = 'Ajouter un event';
	  controlUI.appendChild(controlText);

	  // Setup the click event listeners:
	  google.maps.event.addDomListener(controlUI, 'click', function() {
	    controlText.innerHTML = 'Choisir l\'emplacement sur la carte';
		google.maps.event.addListenerOnce(map, 'click', function(e) {	
			controlText.innerHTML = 'Ajouter un event';
			self.placeNewMarker(e.latLng, map);
		});
	  });
	};

	self.ajouterEvenemment = function(){
	 	google.maps.event.addListenerOnce(map, 'click', function(e) {	
	 		
	 		$('#formulaireAjoutEvenement').modal('show');
			$('#valideTypePoint').on('click',function(){
				switch ($('#ajoutPointChoixType').type.value){
					case "Lieu":
					break;
					case "Evenement":
					break;
				}
			});
	 		/*("#myModal .modal-body").load(target, function() { 
         $("#myModal").modal("show"); */
	 	});
	 };

	self.placeNewMarker=function(position, map) {
		 if (marker){
		 marker.setVisible(false);
		}
		 marker = new google.maps.Marker({
			position: position,
			map: map
		});
		map.panTo(position);
		newPos=position
		self.buildForm(marker);
	};
	self.buildForm=function(aMarker) {
		var contentString = '' +
			'<p>' +
				'<h2>Ajout d\'un nouvel évènement</h2>' +
			'</p>' +
			'<form name="formulaire" id="formulaire1">' +
				'<p>' +
					'<h3>Type d\'évènement</h3>' +
					'<img src="./static/assets/soiree.png" alt="Soirée"> <INPUT TYPE="radio" NAME="type" VALUE="Soiree">Soirée <BR>' +
					'<img src="./static/assets/bar.png" alt="Bar"> <INPUT TYPE="radio" NAME="type" VALUE="Bar">Bar <BR>' +
					'<img src="./static/assets/restau.png" alt="Restaurant"> <INPUT TYPE="radio" NAME="type" VALUE="Restaurant">Restaurant <BR>' +
					'<img src="./static/assets/hotel.png" alt="Hôtel"> <INPUT TYPE="radio" NAME="type" VALUE="Hotel">Hôtel <BR>' +		
					'<img src="./static/assets/monument.png" alt="Monument"> <INPUT TYPE="radio" NAME="type" VALUE="Monument">Monument <BR>' +
					'<img src="./static/assets/normal.png" alt="Autre"> <INPUT TYPE="radio" NAME="type" VALUE="normal">Autre <BR>' +
				'</p>' +
				'<p>' +
					'<INPUT TYPE="button" id="okCreatePin" NAME="suivant" VALUE="Suivant">' +
				'</p>' +
			'</form>';

		 infowindow.setContent(contentString)
		
		infowindow.open(map,aMarker);
		usedMarker = aMarker;
		usedInfoWindow = infowindow;
		google.maps.event.addListener(infowindow, 'closeclick', function(){
		if (marker){
			marker.setVisible(false); //removes the marker);
		}
		});

	$('#okCreatePin').on("click",function(){
				self.buildForm2();
			});

	};

	self.buildForm2=function() {
		leFormulaire=document.getElementById('formulaire1');
		theType=leFormulaire.type.value;
		if(leFormulaire.type[0].checked)
		{
			var contentString = '' +
				'<p>' +
					'<h2>Ajout d\'un nouvel évènement</h2>' +
				'</p>' +
				'<form name="formulaire">' +
					'<p>' +
						'<center><h3><img src="./static/assets/' + theType + '.png" alt="Soirée"> Soirée </h3></center>' +
					'</p>' +
					'<p>' +
						'<label for="titre">Titre</label> :<br /><input type="text" name="titre" id="titreAjout"/>' +
					'</p>' +
					'<p>' +
						'<label for="description">Description</label> :<br />' +
						'<textarea name="description" id="descriptionAjout"></textarea>' +
					'</p>' +
					'<p>' +
					'<fieldset class="date">'+
						 '<label>Date de début : </label><br />'+
  								 '<select id="jour_debut" name="jour_debut" />'+
			  						    '<option>1</option>'      +
			  						    '<option>2</option>'      +
			  						    '<option>3</option>'      +
			  						    '<option>4</option>'      +
			  						    '<option>5</option>'      +
			  						    '<option>6</option>'      +
			  						    '<option>7</option>'      +
			  						    '<option>8</option>'      +
			  						    '<option>9</option>'      +
			  						    '<option>10</option>'      +
			  						    '<option>11</option>'      +
			  						    '<option>12</option>'      +
			  						    '<option>13</option>'      +
			  						    '<option>14</option>'      +
			  						    '<option>15</option>'      +
			  						    '<option>16</option>'      +
			  						    '<option>17</option>'      +
			  						    '<option>18</option>'      +
			  						    '<option>19</option>'      +
			  						    '<option>20</option>'      +
			  						    '<option>21</option>'      +
			  						    '<option>22</option>'      +
			  						    '<option>23</option>'      +
			  						    '<option>24</option>'      +
			  						    '<option>25</option>'      +
			  						    '<option>26</option>'      +
			  						    '<option>27</option>'      +
			  						    '<option>28</option>'      +
			  						    '<option>29</option>'      +
			  						    '<option>30</option>'      +
			  						    '<option>31</option>'      +
		  						  '</select>' +
		  						  '<select id="mois_debut" name="mois_debut" />'+
			  						    '<option >01</option> ' +
			  						    '<option >02</option>'+      
			  						    '<option>03</option>'   + 
			  						    '<option>04</option>'+      
			  						    '<option>05</option>'+     
			  						    '<option>06</option>'+      
			  						    '<option>07</option>'+      
			  						    '<option>08</option>'     + 
			  						    '<option>09</option>' +     
			  						    '<option>10</option>'    +  
			  						    '<option>11</option>'    +  
			  						    '<option>12</option>'     + 
		  						  '</select>'+
		  						  '<select id="annee_debut" name="annee_debut" />'+
		  						         
			  						    '<option>2015</option>'      +
			  						    '<option>2016</option>'      +
			  						    '<option>2017</option>'      +
			  						    '<option>2018</option>'      +
		  						  '</select>'+
		  					'<span class="inst">(Jour-Mois-Année)</span>'+
		  			'</fieldset>'+
		  			'<fieldset class="heure">'+
		  				'<label>Heure de début : </label><br />'+
  						'<input type="text" name="heure_debut" id="heure_debut" size="2">'+
  						'<label>h</label>'+
  						'<input type="text" name="minute_debut" id="minute_debut" size="2">'+	  					
		  			'</fieldset>'+

		  			'<fieldset class="date">'+
						 '<label>Date de Fin : </label><br />'+
  								 '<select id="jour_fin" name="jour_fin" />'+
			  						    '<option>1</option>'      +
			  						    '<option>2</option>'      +
			  						    '<option>3</option>'      +
			  						    '<option>4</option>'      +
			  						    '<option>5</option>'      +
			  						    '<option>6</option>'      +
			  						    '<option>7</option>'      +
			  						    '<option>8</option>'      +
			  						    '<option>9</option>'      +
			  						    '<option>10</option>'      +
			  						    '<option>11</option>'      +
			  						    '<option>12</option>'      +
			  						    '<option>13</option>'      +
			  						    '<option>14</option>'      +
			  						    '<option>15</option>'      +
			  						    '<option>16</option>'      +
			  						    '<option>17</option>'      +
			  						    '<option>18</option>'      +
			  						    '<option>19</option>'      +
			  						    '<option>20</option>'      +
			  						    '<option>21</option>'      +
			  						    '<option>22</option>'      +
			  						    '<option>23</option>'      +
			  						    '<option>24</option>'      +
			  						    '<option>25</option>'      +
			  						    '<option>26</option>'      +
			  						    '<option>27</option>'      +
			  						    '<option>28</option>'      +
			  						    '<option>29</option>'      +
			  						    '<option>30</option>'      +
			  						    '<option>31</option>'      +
		  						  '</select>' +
		  						  '<select id="mois_fin" name="mois_fin" />'+
			  						    '<option value="1">Janvier</option> ' +
			  						    '<option value=2>Février</option>'+      
			  						    '<option value=3>Mars</option>'   + 
			  						    '<option>Avril</option>'+      
			  						    '<option>Mai</option>'+     
			  						    '<option>Juin</option>'+      
			  						    '<option>Juillet</option>'+      
			  						    '<option>Août</option>'     + 
			  						    '<option>Septembre</option>' +     
			  						    '<option>Octobre</option>'    +  
			  						    '<option>Novembre</option>'    +  
			  						    '<option>Decembre</option>'     + 
		  						  '</select>'+
		  						  '<select id="annee_fin" name="annee_fin" />'+
		  						         
			  						    '<option>2015</option>'      +
			  						    '<option>2016</option>'      +
			  						    '<option>2017</option>'      +
			  						    '<option>2018</option>'      +
		  						  '</select>'+
		  					'<span class="inst">(Jour-Mois-Année)</span>'+
		  			'</fieldset>'+
	  				'<fieldset class="heure">'+
	  					'<label>Heure de début : </label><br />'+
						'<input type="text" name="heure_fin" id="heure_fin" size="2">'+
						'<label>h</label>'+
						'<input type="text" name="minute_fin" id="minute_fin" size="2">'+	  					
	  				'</fieldset>'+
      						  
      						  						
						'<center><input type="button" class="pinCreationButtonDyn" name="valider" value="Valider"></center>' +
					'</p>' +
				'</form>';
		}
		else
		{
			var contentString = '' +
				'<p>' +
					'<h2>Ajout d\'un nouvel évènement</h2>' +
				'</p>' +
				'<p>' +
					'<img src="./static/assets/' + theType + '.png" alt="' + theType + '">' +theType+
				'</p>' +
				'<form name="formulaire">' +				
					'<p>' +
						'<label for="titre">Titre</label> :<br /><input type="text" name="titre" id="titre"/>' +
					'</p>' +
					'<p>' +
						'<label for="description">Description</label> :<br />' +
						'<textarea name="description" id="description"></textarea>' +
					'</p>' +
					'<p>' +
						'<center><input type="button" class="pinCreationButtonStatic" name="valider" value="Valider"></center>' +
					'</p>' +
				'</form>';
		}

		 infowindow.setContent(contentString);
		
		infowindow.open(map,usedMarker);
		$(document).on("click",".pinCreationButtonDyn",function(){
				var jour_debut= document.getElementById('jour_debut').value;

				var mois_debut= document.getElementById('mois_debut').value;

				var annee_debut=document.getElementById('annee_debut').value;
				var heure_debut=document.getElementById('heure_debut').value;
				var minute_debut=document.getElementById('minute_debut').value;

				var jour_fin=document.getElementById('jour_fin').value;
				var mois_fin= document.getElementById('mois_fin').value;
				var annee_fin=document.getElementById('annee_fin').value;
				var heure_fin=document.getElementById('heure_fin').value;
				var minute_fin=document.getElementById('minute_fin').value;


				var title =document.getElementById('titreAjout').value;
				var description =document.getElementById('descriptionAjout').value;

				pin.addDynPin(title,description,idUser,jour_debut,mois_debut,annee_debut,heure_debut,minute_debut,jour_fin,mois_fin,annee_fin,heure_fin,minute_fin, newPos.lat(), newPos.lng(),theType,self.cbVotePin);
			});
		$(document).on("click",".pinCreationButtonStatic",function(){

				var title =document.getElementById('titre').value;
				var description =document.getElementById('description').value;

				pin.addStaticPin(title,description,idUser, newPos.lat(), newPos.lng(),theType,self.cbVotePin);
			});


	};


	self.addMarker = function(aPin) {
		var type = aPin.type;
		var image;
		var contentString;
		var id=aPin.id;
		switch (type) { 
			case "velov" : 
				image = imageVelov;
				titre = "Velo'v";
				contentString = self.buildDescription(aPin,"velov");
				break;
			case "stationTCL" : 
				image = imageTCL;
				titre = "Velo'v";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "cafe" : 
				image = imageBar;
				titre = "Café/Bar";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "restaurant" : 
				image = imageRestau;
				titre = "Restaurant";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "nightClub" : 
				image = imageSoiree;
				titre = "Night Club";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "hopital" : 
				image = imageHopital;
				titre = "Hopital";
				contentString = self.buildDescription(aPin,"normal");
				break;
			case "facebookPin" : 
				image = imageFacebook;
				titre = "Facebook";
				contentString = self.buildDescription(aPin,"dynamique");
				break;
			case "event" : 
				image = imageFacebook;
				titre = "Evenement";
				contentString = self.buildDescription(aPin,"dynamique");
				break;
			default :
				image = imageNormal
				titre = "Autre";
				contentString = self.buildDescription(aPin,"normal");
			}
			
		var aMarker = new google.maps.Marker({
			position: new google.maps.LatLng(aPin.lat, aPin.lng),
			map: map,
			icon: image,
			title: titre,
			'idPin': aPin.id,
			'visibilityCategoryToken': 0,
			'visibilityDateToken': 1
		});

		markers.set(id,{pin : aPin,
						marker : aMarker});
		google.maps.event.addListener(aMarker, 'click', function() {
			infowindow.setContent(self.buildDescription(markers.get(aMarker['idPin']).pin,markers.get(aMarker['idPin']).pin.type));
		
			infowindow.open(map,aMarker);

		});
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
											'<p>Nombre de places: <b>' + aPin.data1 + '</b><br />' +
											'Nombre de vélos disponibles: <b>' + aPin.data2 + '</b></p>'+
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
				contentString = '<div id="content" data-id-pin=' + aPin.id + '>'+
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
				contentString = '<div id="content" data-id-pin=' + aPin.id + '>'+
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
		for (var valeur of markers.values()) {
	    	valeur.marker.setMap(null);
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
		for(var i=0; i<listIdCategories.length; i++){
			if($('#categoryButton'+listIdCategories[i]).data('id-category')!=null){
				if ($('#categoryButton'+listIdCategories[i]).hasClass('active'))
				{
					self.categoryFilter(true,listIdCategories[i])
				}
				else
				{
					self.categoryFilter(false,listIdCategories[i])
				}			
			}
		}
		self.filterByDate();
	};

	self.cbVotePin = function(data){
		if (data['error']==null){
			aPin = data.pin;
		self.addMarker(aPin);
		infowindow.setContent(self.buildDescription(aPin, aPin.type));
		infowindow.open(map, markers.get(aPin.id));
		}
	};

	self.cbGetPinVisibilite =function(data){
		for (var valeur of markers.values()) {
 			
    		valeur.marker.setMap(null);	
    	}
    	self.cbGetAllPins(data);
   	};
	self.pinSetup = function(){
			$(document).on("click",".like",function(){
				var pinID= $(this).closest('#content').data('id-pin');
				pin.vote(idUser,pinID,1,self.cbVotePin);
			});
			$(document).on("click",".unlike",function(){
				var pinID= $(this).closest('#content').data('id-pin');
				pin.vote(idUser,pinID,0,self.cbVotePin);
			});
			$(document).on("click",".dislike",function(){
				var pinID= $(this).closest('#content').data('id-pin');
				pin.vote(idUser,pinID,-1,self.cbVotePin);
			});

	};		
	self.filtrerVisibilite =function(visibilite){
		pin.getPinVisibilite(visibilite, self.cbGetPinVisibilite);
	};

	self.setIdUser =function (idUserParam){
		idUser = idUserParam;
	};

	self.categoryFilter = function(visible, idCategory){
		for (var valeur of markers.values()) {
			if (valeur!=null){
				var found=-1
				for (var j=0;j<valeur.pin.category.length;j++){
					if(valeur.pin.category[j].indexOf(idCategory)!=-1){
						found=1;
						console.log(valeur.pin)
						break;
					}
				}
				if (found==1){
					if (visible==true){
						valeur.marker['visibilityCategoryToken']+=1;
					}
					else{

						valeur.marker['visibilityCategoryToken']-=1;
						if (valeur.marker['visibilityCategoryToken']<0){
							valeur.marker['visibilityCategoryToken']=0
						}
					} 
					if (valeur.marker['visibilityCategoryToken']>0 && valeur.marker['visibilityDateToken']>0)
					{
						valeur.marker.setVisible(true);
					}
					else{
						valeur.marker.setVisible(false);
					}
		    	}
		    }
		}
	};

	self.setListCategories=function(listCategories){
		listIdCategories=listCategories;
	};

	self.filterByDate=function(){
			startingDay=$('#jour_debutFilter').val();
			startingMonth=$('#mois_debutFilter').val();
			startingYear=$('#annee_debutFilter').val();
			endingDay=$('#jour_finFilter').val();
			endingMonth=$('#mois_finFilter').val();
			endingYear=$('#annee_finFilter').val();
		for (var valeur of markers.values()){
			if(valeur.pin.dateBegin!=null && valeur.pin.dateEnd!=null)
			{
				var dateBegin = new Date(valeur.pin.dateBegin);
				var dateEnd =new Date(valeur.pin.dateEnd);
				var dateBeginCompare=new Date();
				dateBeginCompare.setDate(startingDay);
				dateBeginCompare.setMonth(startingMonth);
				dateBeginCompare.setYear(startingYear);

				var dateEndCompare=new Date();
				dateEndCompare.setDate(endingDay);
				dateEndCompare.setMonth(endingMonth);
				dateEndCompare.setYear(endingYear);
				

				if (dateBegin>dateBeginCompare && dateEnd<dateEndCompare)
				{
					if(valeur.marker.visibilityCategoryToken>0)
					{
					valeur.marker.visibilityDateToken=0
					valeur.marker.setVisible(true)
					}
				}
				else
				{
					valeur.marker.visibilityDateToken=0
					valeur.marker.setVisible(false)
				}
			}
		}
	};
}
