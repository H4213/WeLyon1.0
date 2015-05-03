import json
import urllib
import os
import sys
import threading
sys.path.append("../")

import server
from server import servicePin
from server import service
from src.model import Pin, Category

#constants

#Prends en argument l'url du fichier json concernant les donnees de velov
#ex: "https://download.data.grandlyon.com/ws/rdata/jcd_jcdecaux.jcdvelov/all.json"

def insertTestData():
	service.logMessage(".Inserting test data ")
	
	count=0	
	for i in  range(0, 10000):
		title = "testunit"
		description = "item"
		lat = 0.0
		lnd = 0.0
		
		count=count+1
		if count == 50:
			count = 0
			print "inserted " + str(i) + " units"
			
		categorie1 = Category(count, "ABC")
		categorie2 = Category(count, "ABC")
		categorie3 = Category(count, "ABC")
		
		categorie1.id = count+1
		categorie2.id = count+2		
		categorie1.id = count+3	
		obj = Pin('velov', title, lnd, lat, 1, [categorie1, categorie2, categorie3], description)
		obj.typeSpecificID = i
		service.updateVelovByIdVelov(obj)

insertTestData()
	