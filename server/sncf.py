import json

import sys

sys.path.append("../")

import service


from src.model import PointOfInterest



def createPointOfInterestTable() :
	print("[LOG]  Loading json sncf file")

	json_file = open('sncf.json')
	data = json.load(json_file)
	listPointOfInterest = []

	print("[LOG] Parsing the json sncf file")
	
	i = 0
	while i < 88 :


		idUser = 1
		title = data["node"][i]["tag"][0]["-v"]
		lat = data["node"][i]["-lat"]
		lng = data["node"][i]["-lon"]

				
		obj = PointOfInterest(title, lng, lat, idUser, [], "")
		obj.idPointOfInterest = data["node"][i]["-id"]
		listPointOfInterest.append(obj)
		
		i+=1
		

	json_file.close()
	
	print(title)

	return listPointOfInterest



def loadSncfData() :
	list = createPointOfInterestTable()
	service.logMessage(".Updating the database")
	for l in list :
		service.updatePointOfInterestByIdPointOfInterest(l)
	service.logMessage(".Loading sncf data")

