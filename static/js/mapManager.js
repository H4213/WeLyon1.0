function MapManager(){

	var self = this;
	var rest = new RESTful();
	var pin = new Pin();
	var idUser = localStorage.getItem('idUser');
	if (idUser==null){
		idUser=-1;
	}
	var infowindow = new google.maps.InfoWindow({content : ""});
	var currentPin = new Pin();
	var markers = new Map();
	var marker;
	var listIdCategories=[];
	var map; // object containing the map
	var cordinateLyon = new google.maps.LatLng(45.7601676, 4.8328885);
	var newPos =new google.maps.LatLng(0,0);
	var markersResume = []
	
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
	var imagePolice = Flask.url_for("static", {"filename": "./assets/police.png"})
	var imageResume = Flask.url_for("static", {"filename": "./assets/plus.png"});



	self.initMap = function() {
		self.pinSetup();

		 var mapOptions = {
			zoom: 13,
			center: cordinateLyon
	    };
	    map = new google.maps.Map(document.getElementById('map'),mapOptions);
	    var centerControlDiv = document.createElement('div');
		var centerControl = self.CenterControl(centerControlDiv, map);
		centerControlDiv.index = 1;
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
		google.maps.event.addListener(map, 'zoom_changed', self.zoomHandler );
		google.maps.event.addListener(map, 'center_changed', self.zoomHandler );
	};

	self.zoomHandler = function () {
		for (var i = 0 ; i< markersResume.length ; i++ ) {
			markersResume[i].setVisible(false);
		}
		markersResume = [];
		var bounds = map.getBounds();
		var height =  $("#map").height();
		var width =  $("#map").width();
		var numberOfMarkers = Math.floor(height*width/(50*50));
		var zones = self.splitBounds(bounds);
		var toDisplay = [];
		for (var valeur of markers.values()) {
			valeur.marker.setVisible(false);
			if (bounds.contains(valeur.marker.getPosition()) && valeur.marker.visibilityCategoryToken > 0  ) {
				console.log("token" + valeur.marker.visibilityCategoryToken);
				console.log("type " + valeur.pin.type)
				toDisplay.push(valeur);
				for (var i = 0 ; i < zones.length ; i++) {
					if (zones[i].bound.contains(valeur.marker.getPosition())) {
						zones[i].count ++;
					}
				}	
			}
		}
		toDisplay.sort(function(a,b) {
			if (a.pin.score < b.pin.score) {
				return 1;
			}
			if (a.pin.score > b.pin.score) {
				return -1;
			}
			return 0;
		});
		for ( var i = 0 ;  ( i <30 ) && (i < toDisplay.length)  ; i++) {
			toDisplay[i].marker.setVisible(true);
		}
		
		zones.forEach(function (element , index) {
			var aMarker = new google.maps.Marker({
				position: element.bound.getCenter(),
				map: map,
				icon: imageResume,
				count : element.count,
				bound : element.bound
			});

			google.maps.event.addListener(aMarker, 'click', function() {
				infowindow.setContent("Et " + aMarker.count + " autre lieux d'interet" );
				infowindow.open(map,aMarker);
				markersResume.push(aMarker);
			});
			markersResume.push(aMarker);

		});
			
	};

	self.splitBounds = function (bounds) {
		result = [];
		var northEast = bounds.getNorthEast();
		var southWest = bounds.getSouthWest();
		var center = bounds.getCenter();
		result.push({bound : new google.maps.LatLngBounds(center , northEast) , count : 0});
		result.push({bound : new google.maps.LatLngBounds(southWest, center) , count : 0});
		result.push({bound : new google.maps.LatLngBounds( new google.maps.LatLng(center.lat() , southWest.lng()) , new google.maps.LatLng( northEast.lat() , center.lng())), count : 0});
		result.push({bound : new google.maps.LatLngBounds( new google.maps.LatLng(southWest.lat() , center.lng()) , new google.maps.LatLng( center.lat() , northEast.lng())), count : 0});
		return result;
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
	  controlUI.title = 'Cliquer pour ajouter un event';
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
  								 '<select id="jour_debut" name="jour_debut" />';
  								 for (var i = 0 ; i<31 ; i++) {
  								 	contentString +=  '<option>' + (i+1) +'</option>';
  								 };
		  						 contentString += '</select>'+
		  						  '<select id="mois_debut" name="mois_debut" />';
		  						  for (var i = 0 ; i<12 ; i++ ) {
		  						  	contentString += '<option>' + (i+1) + '</option> '
		  						  }    
		  						  contentString += '</select>'+
		  						  '<select id="annee_debut" name="annee_debut" />'
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
  								 '<select id="jour_fin" name="jour_fin" />';
			  						    for (var i = 0 ; i<31 ; i++) {
  								 			contentString +=  '<option>' + (i+1) +'</option>';
  								 		}	
		  						contentString +=  '</select>' +
		  						  '<select id="mois_fin" name="mois_fin" />';
		  						  for (var i = 0 ; i<13 ; i++ ) {
		  						  	contentString += '<option>' + (i+1) + '</option> '
		  						  }    
		  						  contentString += '</select>'+
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
						/*pin.addDynPin("Soirée","description",1,10,10,2015,10,10,10,10,2015,10,10, 45.76, 4.835,16,self.cbVotePin);
*/
		});
		$(document).on("click",".pinCreationButtonStatic",function(){

			var title =document.getElementById('titre').value;
			var description =document.getElementById('description').value;
			pin.addStaticPin(title,description,idUser, newPos.lat(), newPos.lng(),theType,self.cbVotePin);
		});
	}

	self.addMarker = function(aPin) {
		var type = aPin.type;
		var image;
		var contentString;
		var id=aPin.id;
		switch (type) { 
			case "velov" : 
				image = imageVelov;
				titre = "Velo'v";
				break;
			case "stationTCL" : 
				image = imageTCL;
				titre = "Metro/Tram";
				break;
			case "cafe" : 
				image = imageBar;
				titre = "Café/Bar";
				break;
			case "restaurant" : 
				image = imageRestau;
				titre = "Restaurant";
				break;
			case "nightClub" : 
				image = imageSoiree;
				titre = "Night Club";
				break;
			case "hopital" : 
				image = imageHopital;
				titre = "Hopital";
				break;
			case "facebookPin" : 
				image = imageFacebook;
				titre = "Facebook";
				break;
			case "Monument" : 
				image = imageMonument;
				titre = "Monument";
				break;
			case "event" : 
				image = imageNormal;
				titre = "Evenement";
				break;
			case "police" : 
				image = imagePolice;
				titre = "Police";
				break;
			default :
				image = imageNormal
				titre = "Autre";
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
			infowindow.setContent(self.buildDescription(markers.get(aMarker['idPin']).pin,"#first"));
			infowindow.open(map,aMarker);
		});
	};

	
	self.buildDescription=function(aPin, listofCommentsHTML) {
		
		currentPin = aPin;
		var contentString = '';
		switch (aPin.type) { 
			case "velov" : 
				contentString = '<div id="siteNotice">'+
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
										'</div>';
				break;
				
			case "dynamique" : 
				contentString = 
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
					'</form>' ;
				break;
			
			default :
				contentString = 
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
					'</div>';
		}
		if(listofCommentsHTML=='#first')
		{
			 pin.getComments(aPin.id, self.cbBuildDescription);

		}
		if(listofCommentsHTML=="#first")
		listofCommentsHTML = '<img src="./static/assets/load.gif">';
		else if(listofCommentsHTML=="#no")
		listofCommentsHTML = '<p>--Pas de commentaire encore--</p';

		var commentsEntete = '<br/><div id="commentzone"><h4>Commentaires</h4>'+
					'<INPUT id="newComment" TYPE="textarea" placeholder="Ajoutez votre avis" VALUE="" class="newComment">'+
					'<INPUT TYPE="button" NAME="ADD" VALUE="+" class="newCommentButton">'
									+'<br/><br/><ul style="text-align:left">'+listofCommentsHTML+'</ul></div>';
		contentString = '<div id="content" data-id-pin=' + aPin.id+contentString+commentsEntete+'</div>';
		
		return contentString;
	};
	

	self.cbBuildDescription=function(data){
		var string_list = "#no";
			if(data.Comments.length > 0)
			{
					string_list="";
				
				for(i = 0; i < data.Comments.length;i++){
	    			string_list+='<li>'+data.Comments[i].text+'</li>';
	    			infowindow.setContent(self.buildDescription(currentPin, string_list));
				}
			}
			else
			{
				infowindow.setContent(self.buildDescription(currentPin, "#no"));
			}

		
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
		for (var valeur of markers.values()) {
 			
    		valeur.marker.setMap(null);	
    	}
		for(var i in data.Pins){
			var p = data.Pins[i];
			self.addMarker(p);
		//self.filterByDate();
		};
		self.forceCategoryFilter();
		self.zoomHandler();
	}

	self.cbVotePin = function(data){
		if (data['error']==null){
			aPin = data.pin;
			alert(aPin.id);
			markers.get(aPin.id).marker.setMap(null);
			delete markers.get(aPin.id);
			self.addMarker(aPin);
			markers.get(aPin.id).marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
				markers.get(aPin.id).marker.setAnimation(null);
			},2250);

		}
	};

	self.cbGetPinVisibilite =function(data){

    	self.cbGetAllPins(data);
   	};

   	self.cbGetPinSearch = function(data){
   		console.log(data)
   		for (var valeur of markers.values()) {
    		valeur.marker.setMap(null);	

    	}
  
    		for(var j in data.Pins[0]){
    			var p =data.Pins[0][j];
    			self.addMarker(p);
    		
	 	}
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
			$(document).on("click",".newCommentButton",function(){
				pin.addComment( $("#newComment").val(), 1, currentPin.id, self.cbBuildDescription);
			});

	};

	self.filtrerVisibilite =function(visibilite){
		pin.getPinVisibilite(visibilite, self.cbGetPinVisibilite);
	};

	self.setIdUser =function (idUserParam){
		idUser = idUserParam;
	};
	self.forceCategoryFilter=function(){
		var tree = $("#categoryTreeView").fancytree("getTree")
		tree.visit(function(node){
			console.log(node)
    		var idCategory=node.key;
    		var param=node.isSelected();
    		self.categoryFilter(param,idCategory)
  		});
	}
	self.categoryFilter = function(visible, idCategory){

		for (var valeur of markers.values()) {
			
				var found=-1
				for (var j=0;j<valeur.pin.category.length;j++){
					if(valeur.pin.category[j]==idCategory){
						found=1;
					}
				}
				if (found==1){
					if (visible==true){
						valeur.marker['visibilityCategoryToken']++;
					}
					else{
						//valeur.marker.setVisible(visible);
						valeur.marker['visibilityCategoryToken']--;
						if (valeur.marker['visibilityCategoryToken']<0){
							valeur.marker['visibilityCategoryToken']=0
						}
					} 
					//valeur.marker.setVisible(visible);
		    	}
		}
	};


	self.setListCategories=function(listCategories){
		listIdCategories=listCategories;
	};

	self.filterByDate=function(){
		startingDay=$('#dateFilterDayBegin').val();
		startingMonth=$('#dateFilterMonthBegin').val();
		startingYear=$('#dateFilterYearBegin').val();
		endingDay=$('#dateFilterDayEnd').val();
		endingMonth=$('#dateFilterMonthEnd').val();
		endingYear=$('#dateFilterYearEnd').val();
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
			else
				{
					valeur.marker.visibilityDateToken=0
					valeur.marker.setVisible(false)
				}
		}
	};

	self.getNews = function (path,  callback) {
		rest.get(path , null , callback);
	}

	self.getPinBySearch = function(search){
		pin.getPinBySearch(search,self.cbGetPinSearch);
	}

}
