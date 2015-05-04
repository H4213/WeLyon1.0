from src import model
from src.model import User, Pin, Category
from server import service

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


def addPin(form):
	if (form['titre'] and form['idUser'] and form['lng'] and form['lat']):
		exist = Pin.query.filter_by(title=form['titre'], lng=form['lng'], lat=form['lat']).first()
		if exist:
			return jsonify(error="already exists")
		user = User.query.get(form['idUser'])

		if not(user):
			return jsonify(error="user doesn't exist")
		pin = Pin('Event', form['titre'], float(form['lng']), float(form['lat']) , form['idUser'] , [Category.query.filter_by(nom=form['category']).first()] , form['description'])
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
		
		categorie1=Category.query.filter_by(nom=form['category']).first()
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