import json

import sys

sys.path.append("../")

import service
from src import model
from src.model import User, Pin

def createPointOfInterestTable() :
	service.logMessage("Loading json sncf file")

	json_file = open('sncf.json')
	data = json.load(json_file)
	listPointOfInterest = []

	service.logMessage("Parsing the json sncf file")
	
	i = 0
	while i < 88 :
		idUser = 1
		title = data["node"][i]["tag"][0]["-v"]
		lat = data["node"][i]["-lat"]
		lng = data["node"][i]["-lon"]		
		obj = Pin('pointOfInterest', title, lng, lat, idUser, [], "")
		obj.typeSpecificID = data["node"][i]["-id"]
		listPointOfInterest.append(obj)
		i+=1
	json_file.close()

	return listPointOfInterest



def loadSncfData() :
	service.logMessage(".TCL : Getting data")
	list = createPointOfInterestTable()
	service.logMessage(".TCL : Updating the database")
	for l in list :
		service.updatePointOfInterestByIdPointOfInterest(l)
	service.logMessage(".TCL : I'm up to date !")

