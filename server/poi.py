import json
import sys

sys.path.append("../")

import service
from src import model
from src.model import User, Pin

def createPointOfInterestTable() :
	global title
	listPointOfInterest = []
	#POI sncf
	service.logMessage(".Loading sncf file")
	json_file_tcl = open('sncf.json')
	dataSncf = json.load(json_file_tcl)
	service.logMessage(".Parsing the json sncf file")
	
	for i in range (0, 88) :
		idUser = 1
		title = dataSncf["node"][i]["tag"][0]["-v"]
		lat = dataSncf["node"][i]["-lat"]
		lng = dataSncf["node"][i]["-lon"]

				
		obj = Pin('stationTCL', title, lng, lat, idUser, [], "")
		obj.typeSpecificID = dataSncf["node"][i]["-id"]
		listPointOfInterest.append(obj)
		
	json_file_tcl.close()
	#POI cafes
	service.logMessage(".Loading cafes file")
	json_file_cafes = open('cafes.json')
	dataCafes = json.load(json_file_cafes)
	#listPointOfInterest = []

	service.logMessage(".Parsing the cafe file") 
		
	for i in range (0,241):
		for j in dataCafes["node"][i]["tag"] :
			if j["_k"] == "name" :
				title = j["_v"]

			idUser = 1
			lat = dataCafes["node"][i]["_lat"]
			lng = dataCafes["node"][i]["_lon"]
			
			obj = Pin('cafe', title, lng, lat, idUser, [], "")
			obj.typeSpecificID = dataCafes["node"][i]["_id"]
			listPointOfInterest.append(obj)
			
	json_file_cafes.close()

	#POI restaurants
	service.logMessage(".Loading Restaurants file")
	json_file_restaurants = open('restaurants.json')
	dataRestaurants = json.load(json_file_restaurants)


	service.logMessage(".Parsing restaurant file") 
		
	for i in range (0,738):
		for j in dataRestaurants["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]

			idUser = 1
			lat = dataRestaurants["node"][i]["-lat"]
			lng = dataRestaurants["node"][i]["-lon"]
				
			obj = Pin('restaurant',title, lng, lat, idUser, [], "")
			obj.typeSpecificID = dataRestaurants["node"][i]["-id"]
			listPointOfInterest.append(obj)
				
	json_file_restaurants.close()

	#POI hopitaux
	service.logMessage(".Loading hospital file")
	json_file_hopitaux = open('hopitaux.json')
	dataHopitaux = json.load(json_file_hopitaux)


	service.logMessage(".Parsing hospital file") 
		
	for i in range (0,20):
		for j in dataHopitaux["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]

				idUser = 1
				lat = dataHopitaux["node"][i]["-lat"]
				lng = dataHopitaux["node"][i]["-lon"]
					
				obj = Pin('hopital',title, lng, lat, idUser, [], "")
				obj.typeSpecificID = dataHopitaux["node"][i]["-id"]
				listPointOfInterest.append(obj)
				
	json_file_hopitaux.close()

	#POI nightclubs
	service.logMessage(".Loading nightclubs file")
	json_file_nc = open('nightClubs.json')
	dataNC = json.load(json_file_nc)


	service.logMessage(".Parsing Night Club") 
		
	for i in range (0,10):
		for j in dataNC["node"][i]["tag"] :
			if j["-k"] == "name" :
				title = j["-v"]

				idUser = 1
				lat = dataNC["node"][i]["-lat"]
				lng = dataNC["node"][i]["-lon"]
					
				obj = Pin('nightClub',title, lng, lat, idUser, [], "")
				obj.typeSpecificID = dataNC["node"][i]["-id"]
				listPointOfInterest.append(obj)
				
	json_file_nc.close()
	return listPointOfInterest


def loadData() :
	service.logMessage(".PointOfInterests : Getting data")
	list = createPointOfInterestTable()
	service.logMessage(".PointOfInterests : Updating the database")
	for l in list :
		service.updatePointOfInterestByIdPointOfInterest(l)
	service.logMessage(".PointOfInterests : I'm up to date !")

	
