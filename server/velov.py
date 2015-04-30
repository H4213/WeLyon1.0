import json
import urllib
import os
import sys
import threading
sys.path.append("../")

import service
import init_databases

from src.model import Velov, Category, User

#constants

#Prends en argument l'url du fichier json concernant les donnees de velov
#ex: "https://download.data.grandlyon.com/ws/rdata/jcd_jcdecaux.jcdvelov/all.json"

def createVelovTable(urlSource) :
	service.logMessage(".Loading of json from the server Velov ")
	urllib.urlretrieve(urlSource, "velov.json")
	json_file = open('velov.json')

	data = json.load(json_file)
	listVelov = []
	service.logMessage(".Parsing the json file")
	
	categorie = Category.query.filter_by(nom = "Velo'v").first()
	
	if not(categorie):
		init_databases.init_categories()
		categorie = Category.query.filter_by(nom = "Velo'v").first()
		
	
	admin_user = User.query.filter_by(pseudo="admin").first()
	if admin_user==None:
		init_databases.init_admin_user()
		admin_user = User.query.filter_by(pseudo="admin").first()
		
	for i in  range(0, 10):
	#data["nb_results"]	
		title = "Velov de " + data["values"][i][2]
		if data["values"][i][11]=="OPEN":
			description = "Etat : " + "OUVERT"
		else:
			description = "Etat : " + "FERME"
		lat = data["values"][i][8]
		lnd = data["values"][i][9]
		
		
		obj = Velov(title, lnd, lat, admin_user.id, [categorie], description)
		obj.libre = data["values"][i][12]
		obj.velo = data["values"][i][13]

		obj.idVelov = data["values"][i][17]
		listVelov.append(obj);

	json_file.close()
	os.remove('velov.json')
	
	return listVelov
	



#rafraichit ou ajoute les donnees dans la base
def refreshVelovData(urlSource):
	list = createVelovTable(urlSource)
	service.logMessage(".Updating the database")
	for v in list:
		service.updateVelovByIdVelov(v)
	service.logMessage(".Velo'v is up to date")
	
#lance le rafraichissement periodique des donnees velov
"""
def start_velov_data(tempo = 60.0):
	refreshVelovData(VELOV_DATA_SOURCE)
	threading.Timer(tempo, start_velov_data, [tempo]).start()
	service.logMessage("Sleep")
"""
	