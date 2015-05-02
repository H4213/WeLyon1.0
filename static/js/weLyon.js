function WeLyon(){
	var self = this;
	idUser = localStorage.getItem('idUser');
	var nameUser=localStorage.getItem('nameUser');
	if ((nameUser ==  null )|| (idUser=null)){
	nameUser='Anonyme';
	idUser=-1;
	}
	var category = new Category();
	var mapManager = new MapManager();
	var user = new User();
	
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
		$('#okInscription').on('click', function(){
			self.signInUser($(this));
		});
		$('#okConnexion').on('click', function(){
			self.signUpUser($(this));
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
	        form+='        <button id="annulerInscription" type="button" class="btn btn-danger pull-left">Annuler</button>';
	        form+='        <button  id="okInscription" type="button" class="btn btn-default pull-right">Sinscrire</button>';
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
	        form+='        <button id="annulerConnexion" type="button" class="btn btn-danger pull-left">Annuler</button>';
	        form+='        <button  id="okConnexion" type="button" class="btn btn-default pull-right">Connexion</button>';
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
	}
	self.cbAddUser = function(data){
		if (data['error']==null)
		{
		alert("Votre compte WeLyon a bien été créé");
		}
		else {
			alert(data['error']);
		}
	}
	self.cbAuthUser = function(data){
		if (data['error']==null)
		{
		idUser = data['idUser'];
		nameUser = data['nameUser'];
		localStorage.setItem('idUser',idUser);
		localStorage.setItem('nameUser',nameUser);
		mapManager.setIdUser(idUser);
		alert("Bienvenue "+nameUser);
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
		};
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
	}


}

var weLyon = new WeLyon();
weLyon.setup();