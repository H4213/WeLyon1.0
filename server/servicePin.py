from src import model
from src.model import User, Pin, Category, Velov , FacebookPin

from server import service

from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time

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
	if idCategory:
		cat = Category.query.get(int(idCategory))

		if cat:
			items = cat.pint 

			if items:
				return jsonify(Pins=[item.serialize() for item in items])
			return jsonify(error="No pin")

		return jsonify(error="No category")

	return jsonify(error="No idCategory")

def addPinFromForm(form):
	print "addPin"
	if (form['title'] and form['user'] and form['lng'] and form['lat']):
		exist = Pin.query.filter_by(title=form['title'], lng=form['lng'], lat=form['lat']).first()
		
		if exist:
			return jsonify(error="already exists")

		user = User.query.get(form['user'])

		if not(user):
			return jsonify(error="user doesn't exist")
		
		#FAUX pin = Pin(form['title'], float(form['lng']), float(form['lat']), form['user'], form['category'], form['description'])
	
		db.session.add(form)
		db.session.commit()
		
		return jsonify(pin = pin.serialize()) 
		
	return jsonify(error="invalid parameters")

def deletePin(form):
	if (form['id']):
		item = Pin.query.get(form['id'])
		if item:
			db.session.delete(item)
			db.session.commit()
			return jsonify(deleted = "1")

		return jsonify(deleted = "0")
	return jsonify(deleted = "No id")

def majPin(form):
	return "0"