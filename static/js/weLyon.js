function WeLyon(){

	var self = this;
	var category = new Category();
	var mapManager = new MapManager();
	var user = new User();

//TODO initialisation par rapport aux droits d'utilisateur

//------------Les setups des pages/panels et ses boutons------------------
	self.setup = function(){
		self.initialiserCarte();		
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

	self.initialiserCarte = function(){		
		google.maps.event.addDomListener(window, 'load', mapManager.initMap());
		$('[data-toggle="tooltip"]').tooltip();
		self.gererVisibilite($('#onFireButton'));
	};

	self.setupAuthentificationPanel = function(bouton){
		$('#okButton').on('click',function(){			
			bouton.toggleClass('active');
			$('#incscriptionPanel').toggle();
		});
		
		$('#okInscription').on('click', function(){
			self.signInUser($(this));
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
	        form+='            <input type="text" class="form-control" id="inscrirePseudo1" placeholder="pseudo">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrireEmail">Email</label>';
	        form+='            <input type="email" class="form-control" id="inscrireEmail1" placeholder="Entrez votre email">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrireMdP">Mot de Passe</label>';
	        form+='           <input type="password" class="form-control" id="inscrireMdP1" placeholder="Mot de Passe">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="confirmerMdP">Confirmer mot de passe</label>';
	        form+='            <input type="password" class="form-control" id="confirmerMdP1" placeholder="Confirmez votre mot de passe">';
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
	self.getCategories = function(callback){
		category.getCategories(callback);
	};

	self.fillCategories = function(){
		self.getCategories(self.cbFillCat);
	};

	self.cbFillCat = function (data) {
		var cat = '';
		for(var i in data.categories){
			cat +=' <button data-id-category="'+data.categories[i].id+'" class="col-md-4 btn btn-default category-item" type="button" style="display:none">'+ data.categories[i].nom +'</button> ';
		}
		$('#categories').append(cat);
		//TODO: remplir la liste des categories 
	};

	self.cbAddUser = function(data){
		alert("ok");
	};

	self.ouvrirPanelAuthentification = function(bouton){
		if(bouton.hasClass('active')){
			bouton.toggleClass('active');
			$('#incscriptionPanel').toggle();
		} else {
			self.fillAuthentificationForm(bouton);
			$('#nav').find('.active').toggleClass('active');
			bouton.toggleClass('active');
			$('#incscriptionPanel').show();
		}
		
	};

	self.gererVisibilite = function(bouton){		
		$('#visibilityFilter').find('.active').toggleClass('active');
		bouton.toggleClass('active');
		var visibilite = bouton.data('visibility');
		//mapManager.filtrerVisibilite(visibilite);
		//TODO: methode qui gere visibilite des pins par leur data-visibility (dans mapManager)	
	};

	self.toggleCategories = function(){
		$('.category-item').toggle();
	};
		
	self.signInUser = function(bouton){
		var pseudo= document.getElementById('inscrirePseudo1').value;
		var password= document.getElementById('inscrireMdP1').value;
		var password2= document.getElementById('confirmerMdP1').value;
		var mail = document.getElementById('inscrireEmail1').value;
		if (password == password2 && pseudo!=null && password!=null){
			user.addUser(pseudo,password,self.cbAddUser);
		}
		else if (pseudo==null){
			alert("veuillez choisir un pseudo");
		}
		else if (password == null){
			alert("Veuillez choisir un mot de passe");
		}
		else if (password == null){
			alert("Les mots de passe ne correspondent pas");
		}
	};
}

var weLyon = new WeLyon();
weLyon.setup();