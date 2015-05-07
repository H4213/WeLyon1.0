from src import model
from src.model import User, Pin, Category
from server import service, serviceLog

from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time
import datetime
db = service.connectToDatabase()

#---------------------------------------------------
#--------------------------Pin----------------------
def getAllPin():
	print "getAllPin"
	items = Pin.query.all()
	if items :
		print "pin non vide"
		return jsonify(Pins=[item.serialize() for item in items])

	print "pin vide"
	return jsonify(error="No pin")
def getPinByVisibility(visibility):
	if visibility=="fresh":
		dateLimit = datetime.datetime.now() -datetime.timedelta(days=7)
		items= Pin.query.filter(Pin.dateCreation>dateLimit)
		if items:
			return jsonify(Pins=[item.serialize() for item in items])
	if visibility=="hot":
		HOT_CONSTANT=10

		itemsStaticHot = Pin.query.filter(Pin.staticHotVisibility==True, Pin.score<HOT_CONSTANT)
		itemsScoreHot=Pin.query.filter(Pin.score>=HOT_CONSTANT)
		for item in itemsStaticHot:
			pint("?")
			itemsScoreHot.push(itemsStaticHot)
		if itemsScoreHot:
			print('lel')
			return jsonify(Pins=[item.serialize() for item in itemsScoreHot])
	if visibility=="all":
		return getAllPin()

	return jsonify(error="No pin for "+visibility)



def getPinById(idPin):
	print idPin
	if idPin:
		item = Pin.query.get(int(idPin))

		if item:
			return jsonify(pin = [item.serialize()])

		return jsonify(error="No pin")

	return jsonify(error="No idPin")

def getPinsByIdCategory(idCategory):
	filter="%,"+str(idCategory)+",%"
	
	print "requested category " + str(idCategory)
	if idCategory:
		items = Pin.query.filter(Pin.categories.like(filter))
		
		"""if cat:
			items = cat.pint 
		"""
		if items:
			print("got results")
			return jsonify(Pins=[item.serialize() for item in items])
		return jsonify(error="No pin")

	return jsonify(error="No category")
def addPinTest():
	dateBegin=datetime.datetime.now()
	dateEnd=dateBegin.replace(day=05)
	pin = Pin('Event',"Soire ajout manuel",45.748518880254,4.84052316511319,"1",[Category.query.filter_by(id=7).first()],"")
	pin.dateBegin=dateBegin
	pin.dateEnd=dateEnd
	service.addObject(pin)

def addPin(form):
	if (form['titre'] and form['idUser'] and form['lng'] and form['lat']):
		exist = Pin.query.filter_by(title=form['titre'], lng=form['lng'], lat=form['lat']).first()
		if exist:
			return jsonify(error="already exists")
		user = User.query.get(form['idUser'])

		if not(user):
			return jsonify(error="user doesn't exist")

		print(Category.query.get(form['category']).nom.lower())
		pin = Pin(Category.query.get(form['category']).nom.lower(), form['titre'], float(form['lng']), float(form['lat']) , form['idUser'] , [Category.query.get(form['category'])] , form['description'])
		serviceLog.add(pin.idUser, pin.id)
		service.addObject(pin)

		return jsonify(pin = pin.serialize()) 
		
	return jsonify(error="invalid parameters")

def addDynPin(form):
	if (form['titre'] and form['idUser'] and form['lng'] and form['lat']):
		exist = Pin.query.filter_by(title=form['titre'], lng=form['lng'], lat=form['lat']).first()
		if exist:
			return jsonify(error="already exists")

		user = User.query.get(form['idUser'])

		if not(user):
			return jsonify(error="user doesn't exist")
		
		categorie1=Category.query.filter_by(id=form['category']).first()
		description = form['description']
		pin = Pin("Event",form['titre'], float(form['lng']), float(form['lat']),form['idUser'],[categorie1],description)
		dateDebut = datetime.datetime(year=int(form['annee_debut']),month=int(form['mois_debut']),day=int(form['jour_debut']),minute=int(form['minute_debut']),hour=int(form['heure_debut']))
		dateFin  = datetime.datetime(year=int(form['annee_fin']),month=int(form['mois_fin']),day=int(form['jour_fin']),minute=int(form['minute_fin']),hour=int(form['heure_fin']))
		pin.dateBegin=dateDebut
		pin.dateEnd=dateFin
		service.addObject(pin)
		return jsonify(pin = pin.serialize()) 
		
	return jsonify(error="invalid parameters")

def deletePin(form):
	if (form['id']):
		item = Pin.query.get(id)
		if item:
			db.session.delete(Pin.query.get(id))
			db.session.commit()
			return jsonify(deleted = "1")

		return jsonify(deleted = "0")
	return jsonify(deleted = "No id")

def majPin(form):
	return "0"

def getCommentByIdPin(idPin):
	print("comment requested")
	if idPin:
		items = db.engine.execute("select * from comments where pin_id="+str(idPin))
		list = []
		if items:
			for row in items:
				list.append({
					"text":row['text'],
					"date":row['date']
					})
			print("got results")
			return jsonify(Comments=list)
		else:
			return jsonify(Comments=list)

	return jsonify(error="Wrong request")

def addCommentByIdPin(idPin, text) :
	if True:
		print idPin
		print text
		db.engine.execute("insert into comments(pin_id, text) values ("+str(idPin)+"," +"'"+text+"')")
		return getCommentByIdPin(str(idPin))
	else:
		return jsonify(error="Wrong request")
