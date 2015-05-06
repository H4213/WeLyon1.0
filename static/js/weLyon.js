function WeLyon(){

	var self = this;
	var category = new Category();
	var mapManager = new MapManager();
	var user = new User();
	var messageView = new MessageView();
	var idUser;
	var nameUser;
	var pinTest=new Pin();
	var dernier_id = 1;
	var levelofSearch=0;

//TODO initialisation par rapport aux droits d'utilisateur

//------------Les setups des pages/panels et ses boutons------------------
	self.setup = function(){
		localStorage.clear();
		self.setUser();
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
		
		self.initialiserCarte();		


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
			mapManager.getPinBySearch(search);
		});

		$('#dateFilterButton').on('click', function(){
			self.remplirFiltreDate();
		});

		$('#sendDateFilter').on('click', function(){
			
		mapManager.filterByDate()	
		});

		$('#categoryFilterButton').on('click', function(){
			$('#categoryFilter').toggleClass('open-filter');
			$('#categoryFilterTree').toggle();
		})

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


		$(".finalInput").keypress(function(event) {
			if (event.which == 13) {
				event.preventDefault();
				$(this).parent().find('.valider').click();
			}
		});

		setInterval(self.chargerNews,5000);
	};

	self.initialiserCarte = function(){		
		google.maps.event.addDomListener(window, 'load', mapManager.initMap());
		$('[data-toggle="tooltip"]').tooltip();
		self.gererVisibilite($('#onFireButton'));
		$('#optionsCarte').show();
		messageView.install('appAlert');
	};

	self.setupAuthentificationPanel = function(bouton){

		$('#okInscription').on('click', function(){
			self.signInUser($(this));
			bouton.toggleClass('active');
			$('#inscriptionPanel').hide()
		});

		$('#okConnexion').on('click', function(){
			self.signUpUser($(this));
			bouton.toggleClass('active');
			$('#inscriptionPanel').hide();
		});

		$('.annuler').on('click', function(){
			bouton.toggleClass('active');
			$('#inscriptionPanel').hide();
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
				if ($('#inscriptionPanel').is(":visible")){
					$('#inscriptionPanel').find('.annuler').click();
				}				
			}
		});

	};

//--------------Remplissage des formulaires----------------------
	self.fillAuthentificationForm = function(bouton){
		$("#inscriptionPanel").find(".panel-body").find('form').remove();
		
		var form = '';
		if(bouton.get(0) === $('#signinButton').get(0)){
			form+='	   <form>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrirePseudo">Pseudo</label>';
	        form+='            <input type="text" class="form-control" id="inscrirePseudo1" placeholder="Pseudo">';
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
	        form+='            <input type="text" class="form-control" id="inscrirePseudo2" placeholder="Pseudo">';
	        form+='        </div>';
	        form+='        <div class="form-group">';
	        form+='            <label for="inscrireMdP">Mot de Passe</label>';
	        form+='           <input type="password" class="form-control finalInput" id="inscrireMdP2" placeholder="Mot de Passe">';
	        form+='        </div>';
	        form+='        <button id="annulerConnexion" type="button" class="btn btn-danger pull-left annuler">Annuler</button>';
	        form+='        <button  id="okConnexion" type="button" class="btn btn-default pull-right valider">Connexion</button>';
	        form+='    </form>';
		}

		$("#inscriptionPanel").find(".panel-body").append(form);
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
		    messageView.append(Messages.Navigator.WEB_STORAGE_ERROR);
		}		
	};

//---------------- Callbacks ------------------------ 
	self.cbFillCat = function (data) {
		mapManager.setListCategories(data.categories);
		var dataTree = self.transformToTreeFormat(data.categories , 0);

    	$('#categoryTreeView').fancytree({
          checkbox : true,
          selectMode : 3,
          source : dataTree,
          select: function(event, data){
       		self.filterCategory(event,data);
				}

        });
    
	};


	self.transformToTreeFormat = function (data , father) {
		var result = [];
		for (var i = 0; i<data.length; i++) {
			if (father != 0 ) {
				if (data[i].idFather && data[i].idFather == father ) {
					var node = { 
						title : data[i].nom,
						folder : false,
						expanded : false,
						key : data[i].id,
						icons : false,
						selected : true
						 
						 }
					var nodes = self.transformToTreeFormat(data , data[i].id)
					if (nodes.length != 0 ) {
						node.children = nodes
					}
					result.push(node)
				} 
			}
			else {
				if(!data[i].idFather) {
					var node = { 
						title : data[i].nom,
						folder : false,
						expanded : false,
						key : data[i].id,
						selected:true
  						}
					var nodes = self.transformToTreeFormat(data , data[i].id)
					if (nodes.length != 0 ) {
						node.children = nodes
					}
					result.push(node)
				}
			}
		}
		return result;
	};

	self.cbAddUser = function(data){
		if (data['error'] == null){
			messageView.append(Messages.Register.REGISTER_SUCCESS, data.nameUser);			
			self.cbAuthUser(data);
		}else {
			alert(data['error']);
		}
	};

	self.cbAuthUser = function(data){

		if (data['error'] == null){
			self.setUser(data.idUser, data.nameUser);
			mapManager.setIdUser(idUser);
			
			if(messageView.count()==1){
				messageView.show();
			} else if(messageView.count()==0){
				messageView.append(Messages.Login.LOGIN_SUCCESS, data.nameUser);
				messageView.show();
			}
		}
		
	};

	self.remplirFiltreDate = function(){
		var jour ='<option value="" disabled selected>Jour</option>';
		var mois = '<option value="" disabled selected>Mois</option>';
		var annee = '<option value="" disabled selected>Année</option>';

		for( var i=1; i<=31; i++){
			jour+=' <option value="'+i+'">'+i+'</option>';
		}
		for( var i=1; i<=12; i++){
			mois+=' <option value="'+i+'">'+i+'</option>';
		}
		for( var i=2015; i<=2020; i++){
			annee+=' <option value="'+i+'">'+i+'</option>';
		}

		$('#dateFilterDayBegin').html('');
		$('#dateFilterMonthBegin').html('');
		$('#dateFilterYearBegin').html('');
		$('#dateFilterDayEnd').html('');
		$('#dateFilterMonthEnd').html('');
		$('#dateFilterYearEnd').html('');

		$('#dateFilterDayBegin').append(jour);
		$('#dateFilterMonthBegin').append(mois);
		$('#dateFilterYearBegin').append(annee);
		$('#dateFilterDayEnd').append(jour);
		$('#dateFilterMonthEnd').append(mois);
		$('#dateFilterYearEnd').append(annee);

		$('#dateFilterForm').toggle();
		$('#categoryFilter').toggle();
	};

	self.ouvrirPanelAuthentification = function(bouton){
		if(bouton.hasClass('active')){
			bouton.toggleClass('active');
			$('#inscriptionPanel').toggle();
		} else {
			self.fillAuthentificationForm(bouton);
			$('#nav').find('.active').toggleClass('active');
			bouton.toggleClass('active');
			$('#inscriptionPanel').show();
		}		
		$('#inscriptionPanel').find('form:first *:input[type!=hidden]:first').focus();
	};

	self.gererVisibilite = function(bouton){		
		$('#visibilityFilter').find('.active').toggleClass('active');
		bouton.toggleClass('active');
		var visibilite = bouton.data('visibility');
		switch(visibilite){
			case 'recherche':
				$('#searchInput').show();
				$('#dateFilter').hide();
			break;
			default:
				$('#searchInput').hide();
				$('#dateFilter').show();
				mapManager.filtrerVisibilite(visibilite);
		}
	};

	self.ajouterEvenemment = function(){
		messageView.append(Messages.Point.NEW_POINT_INFO);
		messageView.show();

		mapManager.ajouterEvenemment();
		//TODO: retour vrai?!
		messageView.append(Messages.Point.NEW_POINT_SUCCESS);
		messageView.show();
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
		} //TODO: gere avec validator
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
		var pseudo = $('#inscrirePseudo2').val();
		var password = $('#inscrireMdP2').val();
		if (password!== "" && pseudo !== ""){
			user.authUser(pseudo,password,self.cbAuthUser);
		}else if (pseudo =="" || password == ""){
			//TODO: gere avec validator
			// alert("votre peseudo ou votre mot de passe est vide")
		}		
	};

	self.setId = function (id){
        dernier_id = id;
    }
	self.chargerNews = function (){
        mapManager.getNews('fil/'+dernier_id+'/' , self.cbNews);
    }

    self.cbNews = function(data){
        if(data!=''){
           	$(data).prependTo('#filActubox').hide().animate({'height':'toggle','opacity':'toggle'},2000);
     	   	$('#filActubox div:last-child').remove();
        }
    };

	self.filterCategory=function(event,data){
		var node = data.node;
		self.filtreCategoryNode(node);
   		levelofSearch=0
	};
	self.filtreCategoryNode=function(node){
		var idCategory = node.key;
   		var param =node.isSelected();
		mapManager.categoryFilter(param,idCategory);
		if (node.children!=null && levelofSearch<2){
				levelofSearch +=1;

				for(i=0;i<node.children.length;i++){
					console.log(node.children[i]);
					self.filtreCategoryNode(node.children[i]);
				}
				
		}
	};



}
var weLyon = new WeLyon();
weLyon.setup();