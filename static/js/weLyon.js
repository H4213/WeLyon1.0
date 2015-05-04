function WeLyon(){

	var self = this;
	var category = new Category();
	var mapManager = new MapManager();
	var user = new User();
	var idUser;
	var nameUser;


//TODO initialisation par rapport aux droits d'utilisateur

//------------Les setups des pages/panels et ses boutons------------------
	self.setup = function(){
		localStorage.clear();
		self.setUser();
		self.initialiserCarte();		
		self.fillCategories();
	
		$('#categoryButton').on('click',function(){
			self.toggleCategories();
		});

		$('#newEventButton').on('click', function(){
			self.ajouterEvenemment();
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

		$('#disconnectButton').on('click', function(){
			self.setUser();
		});

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

		$('#okConnexion').on('click', function(){
			self.signUpUser($(this));
		});

		$('.annuler').on('click', function(){
			$('#incscriptionPanel').hide();
		});
	};

//--------------Remplissage des formulaires----------------------
	self.fillAuthentificationForm = function(bouton){
		$("#incscriptionPanel").find(".panel-body").find('form').remove();
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
	        form+='        <button id="annulerInscription" type="button" class="btn btn-danger pull-left annuler">Annuler</button>';
	        form+='        <button  id="okInscription" type="button" class="btn btn-default pull-right valider">S\'inscrire</button>';
	        form+='    </form>';
		}
		else if(bouton.get(0) === $('#connectButton').get(0)){
			form+='	   <form>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrirePseudo">Pseudo</label>';
	        form+='            <input type="text" class="form-control" id="inscrirePseudo2" placeholder="pseudo">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrireMdP">Mot de Passe</label>';
	        form+='           <input type="password" class="form-control" id="inscrireMdP2" placeholder="Mot de Passe">';
	        form+='        </div>';
	        form+='        <button id="annulerConnexion" type="button" class="btn btn-danger pull-left annuler">Annuler</button>';
	        form+='        <button  id="okConnexion" type="button" class="btn btn-default pull-right valider">Connexion</button>';
	        form+='    </form>';
		}

		$("#incscriptionPanel").find(".panel-body").append(form);
		self.setupAuthentificationPanel(bouton);
	};

//----------------- Getters/Setters ------------------
	self.getCategories = function(callback){
		category.getCategories(callback);
	};

	self.fillCategories = function(){
		self.getCategories(self.cbFillCat);
	};

	self.setUser = function(id,nom){
		if(typeof(Storage) !== "undefined") {
			if((typeof nameUser ===  "undefined" )|| (typeof idUser === "undefined")){
				idUser = localStorage.getItem('idUser');
				nameUser = localStorage.getItem('nameUser');	
			}			
			if ((nameUser ===  null )|| (idUser === null)){
				nameUser='Anonyme';
				idUser=-1;
			} else if((typeof id !== "undefined") || (typeof nom !== "undefined")){
				idUser = id;
				nameUser = nom;
				$('#connectedUser').find('i').html(" "+nom);
				self.toggleBoutonsConnexion();	
			} else {
				nameUser='Anonyme';
				idUser=-1;
				self.toggleBoutonsConnexion();
			}
			localStorage.setItem('idUser',idUser);
			localStorage.setItem('nameUser',nameUser);
		} else {
		    alert("WebStorage not supported, can't login");
		    //TODO: message d'erreur
		}		
	};

//---------------- Callbacks ------------------------ 
	self.cbFillCat = function (data) {
		var cat = '';
		for(var i in data.categories){
			cat +=' <button data-id-category="'+data.categories[i].id+'" class="col-md-4 btn btn-default category-item" type="button" style="display:none">'+ data.categories[i].nom +'</button> ';
		}
		$('#categories').append(cat);
		//TODO: remplir la liste des categories 
	};

	self.cbAddUser = function(data){
		if (data['error'] == null){
			self.cbAuthUser(data);
			alert("Votre compte WeLyon a bien été créé");
		}else {
			alert(data['error']);
		}
	}
	self.cbAuthUser = function(data){
		if (data['error'] == null){
			self.setUser(data.idUser, data.nameUser);
			mapManager.setIdUser(idUser);
			// alert("Bienvenue "+ nameUser);
		}
		
	}


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

	self.ajouterEvenemment = function(){
		mapManager.ajouterEvenemment();
	};

	self.toggleBoutonsConnexion = function(){
		$('#connectButton').toggle();
		$('#signinButton').toggle();
		$('#disconnectButton').toggle();
		$('#connectedUser').toggle();
		$('#optionUtilisateur').toggle();
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
		else if (pseudo==""){
			alert("veuillez choisir un pseudo")
		}
		else if (password == ""){
			alert("Veuillez choisir un mot de passe")
		}
		else if (password == ""){
			alert("Les mots de passe ne correspondent pas")
		}
		$('#incscriptionPanel').hide();
	};

	self.signUpUser = function(bouton){
		var pseudo= document.getElementById('inscrirePseudo2').value;
		var password= document.getElementById('inscrireMdP2').value;
		if (password!= null && pseudo != null)
		{
			user.authUser(pseudo,password,self.cbAuthUser);
		}
		else if (pseudo==null){
			alert("veuillez indiquez votre pseudo")
		}
		else if (password == null){
			alert("Veuillez indiquez votre mot de passe")
		}
		$('#incscriptionPanel').hide();
	};


}
var weLyon = new WeLyon();
weLyon.setup();