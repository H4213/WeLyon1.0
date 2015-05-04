# Smart-City - Serveur

##Affichage des marqueurs
###/marker  ou  /marker/"catégorie"
Affichage JSON de tous les marqueurs

##Affichage des utilisateurs
###/user
Affichage JSON de tous les utilisateurs (pseudo + pass)

##Authentification d'un utilisateur
###/auth
Vérifie l'authentification et renvoie son id
POST : 	*pseudo
	*passw

##Ajout d'un markeur
###/add/marker
Vérifie qu'il n'y a pas un doublon sur la positon.
Renvoie l'ID du nouveau marker
POST : 	*user (id)
	*title
	description
	cathegorie
	*lng
	*lat

##Inscription d'un utilisateur
###/add/user
Vérifie qu'il n'y a pas un doublon sur le pseudo.
Renvoie l'ID du nouvel user
POST : 	*pseudo
	*passw



