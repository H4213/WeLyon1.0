# Smart-City - Serveur

##Pins
@app.route('/pins/', methods=('GET', 'POST', 'PUT', 'DELETE'))<br>
@app.route('/pins/'idPin'/')<br>
@app.route('/pins/category/'idCategory'/')<br>
###Get Pin
GET sur /pins ou /pins/'idPin' ou '/pins/category/'idCategory'/'
```
pins = { 
	[
		{
            'id': self.id,
            'user': self.idUser,
            'title': self.title,
            'category': {
            	[
            		{
            			'id': self.id,
            			'nom': self.nom
            		},
            		{...}
            	]
            },
            'description': self.description,
            'lng': self.lng,
            'lat': self.lat,
            'score': self.score
		},
		{...}
	]
}
```

###Ajouter une pin
PUT sur /pin
```
<form method="PUT" action="/pins">
	<input type="text" name="title"/>
	<input type="text" name="user"/>
	<input type="text" name="lng"/> (longitude)
	<input type="text" name="lat"/> (latitude)
	<input type="text" name="description"/>
	<input type="text" name="category"/>
</form>
```

renvoie le JSON de la pin

###Supprimer une pin
DELETE sur /pin
```
<form method="DELETE" action="/pins">
	<input type="text" name="id"/>
</form>
```
Renvoie un json delete="1" (ou 0 si erreur)



##Categories
@app.route('/categories/', methods=('GET', 'POST', 'PUT', 'DELETE'))<br>
@app.route('/categories/'category'/')<br>
@app.route('/categories/pin/'pin'/')<br>
###Get Categories
GET sur les adresses
```
Categories = { 
	[
		{
                'id': self.id,
                'nom': self.nom,
                'description': self.description,
                'pins' : [
                		{
                			'id': self.id,
            				'title': self.title,
                		},
                		{...}
                	],
                'Child': [
                	{
                		'id': self.id,
            			'nom': self.nom,
                	},
                	{...}
                ]
            },
		{...}
	]
}
```

###Ajouter une categorie
PUT sur /categorie
```
<form method="PUT" action="/categories">
	... A venir
</form>
```

renvoie le JSON de la catégorie

###Supprimer une categorie
DELETE sur /categories
```
<form method="DELETE" action="/categories">
	<input type="text" name="id"/>
</form>
```
Renvoie un json delete="1" (ou 0 si erreur)




##User
@app.route('/users', methods=('GET', 'POST', 'PUT', 'DELETE'))<br>
@app.route('/users/'idUser'/')<br>
###Get Categories
GET sur les adresses
```
Users = { 
	[
		{
            'id': self.id,
            'pseudo': self.pseudo,
            'mail': self.mail,
            'passw' : self.passw
        },
		{...}
	]
}
```

###Ajouter un user
PUT sur /users
```
<form method="PUT" action="/users">
	<input type="text" name="pseudo"/>
	<input type="text" name="mail"/>
	<input type="text" name="passw"/>
</form>
```

renvoie le JSON de la catégorie

###Supprimer une categorie
DELETE sur /categories
```
<form method="DELETE" action="/users">
	<input type="text" name="id"/>
</form>
```
Renvoie un json delete="1" (ou 0 si erreur)



##Authentification
```
<form method="POST" action="/authentification">
	<input type="text" name="pseudo"/>
	<input type="text" name="passw"/>
</form>
```

renvoie JSON
```
{
	'id': 'idDeLUser'
	'pseudo': 'pseudoDeLUser'
}
```

##Social
###Suivis d'un utilisateur
GET sur /follow/"nomUser"<br>
JSON :

###Groupe personnalisé
Création, édition, suppression :<br>
PUT, POST, DELETE sur /groupe/<br>
```
{
    'name': 'leNom',
    'users': [
        {'nom': 'LeNom1'},
        {'nom': 'LeNom2'},

    ],
    'cats' : [
        {'nom': 'LeNom1'},
        {'nom': 'LeNom2'},
    ]
}
```

Consultation:<br>
GET sur /groupe/'nomDuGroupe'<br>
