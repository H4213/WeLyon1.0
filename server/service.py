from src import model
from src.model import User, Pin, Category, Vote
from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
<<<<<<< HEAD
from sqlalchemy import or_
=======
from server import serviceLog
>>>>>>> origin/dev-Fil
import time

def logMessage(message):
	print("[LOG]["+time.strftime("%H:%M:%S") + "] "+message)
def errorMessage(message):
	print("[ERROR]["+time.strftime("%H:%M:%S") + "] "+message)

def connectToDatabase():
    """
    Connect to our SQLite database and return a Session object
    """
    session = model.db
    return session

db = connectToDatabase()


def addObject(obj):
	db.session.add(obj)
	db.session.commit()
	return obj

def deleteObject(obj):
	db.session.delete(obj)
	db.session.commit()
	return jsonify(deleted = "1")

def authentification(form):
	user = User.query.filter_by(pseudo=form['pseudo'], passw=form['passw']).first()
	if user:
		return jsonify(id=user.id, pseudo=user.pseudo)
	return jsonify(error="authentification error")
	
#updates or creates a velov 
def updateVelovByIdVelov(current):
	if current:
		item = Pin.query.filter_by(typeSpecificID=current.typeSpecificID , type='velov').first()
		
		if item:
			item.data1 = current.data1
			item.data2 = current.data2
			db.session.commit()
		else:
			addObject(current)
					
#Creates Facebook events 
def updateFacebookByIdFacebook(current):
	if current:
		item = Pin.query.filter_by(typeSpecificID=current.typeSpecificID, type='facebookPin').first()
		print item
		if item == None:
			addObject(current)

def addUser(name,password):
	newUser = User(name,password)
	addObject(newUser)
	
def addCategory(form):
	db.session.add(form)
	db.session.commit()
	
def UpdateUserVoteEvent(form,idPin):
	idUser=form['idUser'];
	posneg = form['posneg'];
	if idUser and idPin and posneg:
		item = Vote.query.filter_by(idUser=idUser, idPin=idPin).first()
		pinItem = Pin.query.filter_by(id=idPin).first()
		oldposneg=0
		print ("ici")
		if item:
			oldposneg=item.posneg
			print(oldposneg)
			item.posneg=posneg
		else :
		
			print("item=none")
			newVote=Vote(idUser,idPin)
			newVote.posneg=posneg
			addObject(newVote)
			print (idUser+","+idPin)
			if pinItem.score:
				print('la')
			else:
				pinItem.score=0
			
		pinItem.score=int(pinItem.score)-oldposneg+int(posneg)
		serviceLog.like(idUser, idPin, posneg) #log
		db.session.commit()

		return jsonify(pin=pinItem.serialize())
			

def updatePointOfInterestByIdPointOfInterest(current) :
	if current:
		item = Pin.query.filter_by(typeSpecificID=current.typeSpecificID, type=current.type).first()
		if item is None:
			addObject(current)


def globalSearch(term):
	if not(term):
		return jsonify(result="No results")
	else:
		print ('searching for ' + term) 
		listLevel1 = []
		items = Pin.query.filter(or_(Pin.title.like("%"+term+"%"), Pin.description.like("%"+term+"%")))
		if items:
			listLevel1.append(items)
			#return jsonify(Pins=[item.serialize() for item in items])

		listLevel2 = []
		itemsC = Category.query.filter(or_(Category.nom.like("%"+term+"%"), Category.description.like("%"+term+"%")))
		if items:
			for i in itemsC:
				filter="%,"+str(i.id)+",%"
				items2 = Pin.query.filter(Pin.categories.like(filter))
				listLevel2.append(items2)

		listLevel1.extend(listLevel2)

		return jsonify(Pins=[[item.serialize() for item in items] for items in listLevel1])

