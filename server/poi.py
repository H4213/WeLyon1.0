import json
import sys

sys.path.append("../")

import service
from src import model
from src.model import User, Pin, Category

def createPointOfInterestTable() :
	global title
	listPointOfInterest = []
	#POI sncf
	service.logMessage(".Loading sncf file")
	json_file_tcl = open('sncf.json')
	dataSncf = json.load(json_file_tcl)
	service.logMessage(".Parsing the json tcl file")
	categorie = Category.query.filter_by(nom = "Tcl").first()
	for i in range (0, 88) :
		idUser = 1
		title = dataSncf["node"][i]["tag"][0]["-v"]
		lat = dataSncf["node"][i]["-lat"]
		lng = dataSncf["node"][i]["-lon"]
		
		

		obj = Pin('stationTCL', title, lng, lat, idUser, [categorie], "")
		obj.typeSpecificID = dataSncf["node"][i]["-id"]
		listPointOfInterest.append(obj)
		
	json_file_tcl.close()
	#POI cafes
	service.logMessage(".Loading cafes file")
	json_file_cafes = open('cafes.json')
	dataCafes = json.load(json_file_cafes)
	#listPointOfInterest = []

	service.logMessage(".Parsing the cafe file")
	categorie = Category.query.filter_by(nom = "Bar/Cafe").first() 
		
	for i in range (0,241):
		for j in dataCafes["node"][i]["tag"] :
			if j["_k"] == "name" :
				title = j["_v"]

			idUser = 1
			lat = dataCafes["node"][i]["_lat"]
			lng = dataCafes["node"][i]["_lon"]
			
			obj = Pin('cafe', title, lng, lat, idUser, [categorie], "")
			obj.typeSpecificID = dataCafes["node"][i]["_id"]
			listPointOfInterest.append(obj)
			
	json_file_cafes.close()

	#POI restaurants
	service.logMessage(".Loading Restaurants file")
	json_file_restaurants = open('restaurants.json')
	dataRestaurants = json.load(json_file_restaurants)


	service.logMessage(".Parsing restaurant file") 
	categorie = Category.query.filter_by(nom = "Restaurant").first()

	for i in range (0,738):
		for j in dataRestaurants["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]

			idUser = 1
			lat = dataRestaurants["node"][i]["-lat"]
			lng = dataRestaurants["node"][i]["-lon"]
				
			obj = Pin('restaurant',title, lng, lat, idUser, [categorie], "")
			obj.typeSpecificID = dataRestaurants["node"][i]["-id"]
			listPointOfInterest.append(obj)
				
	json_file_restaurants.close()

	#POI hopitaux
	service.logMessage(".Loading hospital file")
	json_file_hopitaux = open('hopitaux.json')
	dataHopitaux = json.load(json_file_hopitaux)


	service.logMessage(".Parsing hospital file") 
	categorie = Category.query.filter_by(nom = "Hopital").first()	
	for i in range (0,20):
		for j in dataHopitaux["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]

				idUser = 1
				lat = dataHopitaux["node"][i]["-lat"]
				lng = dataHopitaux["node"][i]["-lon"]
					
				obj = Pin('hopital',title, lng, lat, idUser, [categorie], "")
				obj.typeSpecificID = dataHopitaux["node"][i]["-id"]
				listPointOfInterest.append(obj)
				
	json_file_hopitaux.close()

	#POI nightclubs
	service.logMessage(".Loading nightclubs file")
	json_file_nc = open('nightClubs.json')
	dataNC = json.load(json_file_nc)


	service.logMessage(".Parsing Night Club") 
	categorie = Category.query.filter_by(nom = "Night Club").first()	
	for i in range (0,10):
		for j in dataNC["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]

				idUser = 1
				lat = dataNC["node"][i]["-lat"]
				lng = dataNC["node"][i]["-lon"]
					
				obj = Pin('nightClub',title, lng, lat, idUser, [categorie], "")
				obj.typeSpecificID = dataNC["node"][i]["-id"]
				listPointOfInterest.append(obj)
				
	json_file_nc.close()

	#POI police	
	service.logMessage(".Loading police file")
	json_file_police = open('police.json')
	dataPolice = json.load(json_file_police)


	service.logMessage(".Parsing police stations") 
	categorie = Category.query.filter_by(nom = "Police").first()	
	for i in range (0,31):
		for j in dataPolice["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]

				idUser = 1
				lat = dataPolice["node"][i]["-lat"]
				lng = dataPolice["node"][i]["-lon"]
					
				obj = Pin('police',title, lng, lat, idUser, [categorie], "")
				obj.typeSpecificID = dataPolice["node"][i]["-id"]
				listPointOfInterest.append(obj)
				
	json_file_police.close()

	#POI monuments
	service.logMessage(".Loading monuments file")
	json_file_monuments = open('monuments.json')
	dataMonuments = json.load(json_file_monuments)
	categorie = Category.query.filter_by(nom = "Monument").first()
	for i in range (0,37):
		for j in dataMonuments["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]
				idUser = 1
				lat = dataMonuments["node"][i]["-lat"]
				lng = dataMonuments["node"][i]["-lon"]
						
				obj = Pin('monument',title, lng, lat, idUser, [categorie], "")
				obj.typeSpecificID = dataMonuments["node"][i]["-id"]
				listPointOfInterest.append(obj)
				
	json_file_monuments.close()

				

	return listPointOfInterest


def loadData() :
	service.logMessage(".PointOfInterests : Getting data")
	list = createPointOfInterestTable()
	service.logMessage(".PointOfInterests : Updating the database")
	for l in list :
		service.updatePointOfInterestByIdPointOfInterest(l)
	service.logMessage(".PointOfInterests : I'm up to date !")

	
