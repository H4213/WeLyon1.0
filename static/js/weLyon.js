function WeLyon(){
	var self = this;
	var category = new Category();
	var mapManager = new MapManager();

//------------Les setups des pages/panels et ses boutons------------------
	self.setup = function(){
		google.maps.event.addDomListener(window, 'load', mapManager.initMap());
		self.fillCategories();

		$('#categoryButton').on('click',function(){
			self.toggleCategories();
		});

		$('#onFireButton').on('click', function(){
			self.gererVisibilite($(this));
		});

		$('#allButton').on('click', function(){
			self.gererVisibilite($(this));
		});

		$('#freshButton').on('click', function(){
			self.gererVisibilite($(this));
		});

		$('#signinButton').on('click', function(){
			self.ouvrirPanelAuthentification($(this));
		});

		$('#connectButton').on('click', function(){
			self.ouvrirPanelAuthentification($(this));
		});

		//TODO: remplir page (a l'ouverture/connexion) en accord avec les droits de l'utilisateur 

	};

	self.setupAuthentificationPanel = function(bouton){
		$('#okButton').on('click',function(){			
			bouton.toggleClass('active');
			$('#incscriptionPanel').toggle();
		});
	};
//--------------Remplissage des formulaires----------------------
	self.fillAuthentificationForm = function(bouton){
		$("#incscriptionPanel").find(".panel-body").html("");
		var form = '';
		if(bouton.get(0) === $('#signinButton').get(0)){
			form+='	   <form>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrirePseudo">Pseudo</label>';
	        form+='            <input type="text" class="form-control" id="inscrirePseudo" placeholder="pseudo">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrireEmail">Email</label>';
	        form+='            <input type="email" class="form-control" id="inscrireEmail" placeholder="Entrez votre email">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrireMdP">Mot de Passe</label>';
	        form+='           <input type="password" class="form-control" id="inscrireMdP" placeholder="Mot de Passe">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="confirmerMdP">Confirmer mot de passe</label>';
	        form+='            <input type="password" class="form-control" id="confirmerMdP" placeholder="Confirmez votre mot de passe">';
	        form+='        </div>';
	        form+='        <button id="annulerInscription" class="btn btn-danger pull-left">Annuler</button>';
	        form+='        <button  id="okInscription" class="btn btn-default pull-right">Sinscrire</button>';
	        form+='    </form>';
		}
		else if(bouton.get(0) === $('#connectButton').get(0)){
			form+='	   <form>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrirePseudo">Pseudo</label>';
	        form+='            <input type="text" class="form-control" id="inscrirePseudo" placeholder="pseudo">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrireMdP">Mot de Passe</label>';
	        form+='           <input type="password" class="form-control" id="inscrireMdP" placeholder="Mot de Passe">';
	        form+='        </div>';
	        form+='        <button id="annulerConnexion" class="btn btn-danger pull-left">Annuler</button>';
	        form+='        <button  id="okConnexion" class="btn btn-default pull-right">Connexion</button>';
	        form+='    </form>';
		}

		$("#incscriptionPanel").find(".panel-body").append(form);
		self.setupAuthentificationPanel(bouton);
	};

//----------------- Getters/Setters------------------
	self.getCategories = function(){
		var listeCategories = category.getCategories();
		return listeCategories;
	};

	self.fillCategories = function(){
		var listeCategories = self.getCategories();
		var cat = '';
		for(var i in listeCategories){
			cat +=' <button data-id-category="'+listeCategories[i].id+'" class="col-md-4 btn btn-default category-item" type="button" style="display:none">'+ listeCategories[i].nom +'</button> ';
		}
		$('#categories').append(cat);

		//TODO: remplir la liste des categories
	};

	self.ouvrirPanelAuthentification = function(bouton){
		if(bouton.hasClass('active')){
			bouton.toggleClass('active');
			$('#incscriptionPanel').toggle();
		} else {
			self.fillAuthentificationForm(bouton);
			$('#nav').find('.active').toggleClass('active');
			bouton.toggleClass('active');
			$('#incscriptionPanel').show()
		}
		
	};

	self.gererVisibilite = function(bouton){		
		$('#visibility').find('.active').toggleClass('active');
		bouton.toggleClass('active');
		//TODO: methode qui gere la visibilite des evenements	
	};

	self.toggleCategories = function(){
		$('.category-item').toggle();
	};
	
}

var weLyon = new WeLyon();
weLyon.setup();