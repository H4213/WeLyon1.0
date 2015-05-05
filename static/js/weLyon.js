function WeLyon(){

	var self = this;
	var category = new Category();
	var mapManager = new MapManager();
	var user = new User();
	var idUser;
	var nameUser;
	var pinTest=new Pin();

//TODO initialisation par rapport aux droits d'utilisateur

//------------Les setups des pages/panels et ses boutons------------------
	self.setup = function(){
		localStorage.clear();
		self.setUser();
		self.initialiserCarte();		
		self.fillCategories();
	
		$('#categoryButton').on('click',function(){
			self.toggleCategories();
			$('.category-item').on('click', function() {
 				$(this).toggleClass('active');
 				var idCategory=$(this).data('id-category')
 				if ($(this).hasClass('active')){
 					mapManager.categoryFilter(true,idCategory);
 				}
 				else{
 					mapManager.categoryFilter(false,idCategory);
 				}
  			
			});
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

		$('#searchButton').on('click', function(){
			self.gererVisibilite($(this));
		});

		$('#sendSearch').on('click', function(){
			var search = $('#searchInput').find('input').val();
			alert( search);
			//TODO: send search on mapManager
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

		$('#filterByDateButton').on('click', function(){
			

			mapManager.filterByDate();

		});
		$('#categoryTreeView').on('nodeSelected', function(event, data) {
			if (data.nodes!=null){
				console.log(data.tag);
				for(var i = 0; i<data.nodes.length; i++)
				{
					$('#categoryTreeView').treeview('selectNode',[(data.nodes[i])]);
				}
			}
			else{
					mapManager.categoryFilter(true,data.tag);
				}
			
		});

		$('#categoryTreeView').on('nodeUnselected', function(event, data) {
			if (data.nodes!=null){
				for(var i = 0; i<data.nodes.length; i++)
				{
					$('#categoryTreeView').treeview('unselectNode',[(data.nodes[i])]);
				}
			}
			else{
					mapManager.categoryFilter(false,data.tag);
				}
		});

		$(".finalInput").keypress(function(event) {
			if (event.which == 13) {
				event.preventDefault();
				$(this).parent().find('.valider').click();
			}
		});


<<<<<<< HEAD
=======

>>>>>>> origin/dev-Paul-FiltreArbre
	};

	self.initialiserCarte = function(){		
		google.maps.event.addDomListener(window, 'load', mapManager.initMap());
		$('[data-toggle="tooltip"]').tooltip();
		self.gererVisibilite($('#onFireButton'));
	};

	self.setupAuthentificationPanel = function(bouton){
		// $('#okButton').on('click',function(){			
		// 	bouton.toggleClass('active');
		// 	$('#incscriptionPanel').toggle()
		// });
		
		$('#okInscription').on('click', function(){
			self.signInUser($(this));
			bouton.toggleClass('active');
			$('#incscriptionPanel').hide()
		});

		$('#okConnexion').on('click', function(){
			self.signUpUser($(this));
			bouton.toggleClass('active');
			$('#incscriptionPanel').hide();
		});

		$('.annuler').on('click', function(){
			alert(2);
			bouton.toggleClass('active');
			$('#incscriptionPanel').hide();
		});

		$(".finalInput").keypress(function(event) {
			if (event.which == 13) {
				event.preventDefault();
				$(this).closest('form').find('.valider').click();
			}
		});

		$(document).keyup(function(event) {
			if (event.which == 27) {
				event.preventDefault();
				if ($('#incscriptionPanel').is(":visible")){
					$('#incscriptionPanel').find('.annuler').click();
				}				
			}
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
	        form+='            <input type="password" class="form-control finalInput" id="confirmerMdP1" placeholder="Confirmez votre mot de passe">';
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
	        form+='           <input type="password" class="form-control finalInput" id="inscrireMdP2" placeholder="Mot de Passe">';
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
		mapManager.setListCategories(data.categories);
		var dataTree = self.transformToTreeFormat(data.categories , 0);
    	$('#categoryTreeView').treeview({
          color: "#428bca",
          showBorder: false,
          data: dataTree,
          multiSelect : true,
          levels : 1
        });
    
	};

	self.transformToTreeFormat = function (data , father) {
		var result = [];
		for (var i = 0; i<data.length; i++) {
			if (father != 0 ) {
				if (data[i].idFather && data[i].idFather == father ) {
					var node = { 
						text : data[i].nom ,
						tag : [data[i].id] 
						  }
					var nodes = self.transformToTreeFormat(data , data[i].id)
					if (nodes.length != 0 ) {
						node.nodes = nodes
					}
					result.push(node)
				} 
			}
			else {
				if(!data[i].idFather) {
					var node = { 
						text : data[i].nom ,
						tag : [data[i].id] 
						  }
					var nodes = self.transformToTreeFormat(data , data[i].id)
					if (nodes.length != 0 ) {
						node.nodes = nodes
					}
					result.push(node)
				}
			}
		}
		return result;
	};

	self.cbAddUser = function(data){
		if (data['error'] == null){
			self.cbAuthUser(data);
			alert("Votre compte WeLyon a bien été créé");
		}else {
			alert(data['error']);
		}
	};

	self.cbAuthUser = function(data){

		if (data['error'] == null){
			self.setUser(data.idUser, data.nameUser);
			mapManager.setIdUser(idUser);
			// alert("Bienvenue "+ nameUser);
		}
		
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
		switch(visibilite){
			case 'recherche':
				$('#searchInput').show();
			break;
			default:
				$('#searchInput').hide();
				mapManager.filtrerVisibilite(visibilite);
		}
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
		var pseudo= $('#inscrirePseudo1').val();
		var password= $('#inscrireMdP1').val();
		var password2= $('#confirmerMdP1').val();
		var mail = $('#inscrireEmail1').val();
		if (password === password2 && pseudo!=="" && password!==""){
			user.addUser(pseudo,password,self.cbAddUser);
		}
		else if (pseudo ==""){
			alert("veuillez choisir un pseudo")
		}
		else if (password == ""){
			alert("Veuillez choisir un mot de passe")
		}
		else if (password2 == ""){
			alert("Les mots de passe ne correspondent pas")
		}
	};

	self.signUpUser = function(bouton){
		alert($('#inscrireMdP2').val() == "");
		var pseudo = $('#inscrirePseudo2').val();
		var password = $('#inscrireMdP2').val();
		if (password!== "" && pseudo !== ""){
			user.authUser(pseudo,password,self.cbAuthUser);
		}else if (pseudo =="" || password == ""){
			alert("votre peseudo ou votre mot de passe est vide")
		}
		
	};




}
var weLyon = new WeLyon();
weLyon.setup();