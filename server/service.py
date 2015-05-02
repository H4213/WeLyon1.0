from src import model
<<<<<<< HEAD
from src.model import User, Pin, Category, Velov , FacebookPin, Vote
=======
from src.model import User, Pin, Category, Velov , FacebookPin , PointOfInterest
>>>>>>> origin/dev-PointsOfInterest
from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
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
	return obj.serialize()

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
		item = Velov.query.filter_by(idVelov=current.idVelov).first()
		
		if item:
			item.velo = current.velo
			item.libre = current.libre
			db.session.commit()
		else:
<<<<<<< HEAD
			addObject(current)
=======
			addObjet(current)
>>>>>>> origin/dev-PointsOfInterest
		
#Creates Facebook events 
def updateFacebookByIdFacebook(current):
	if current:
		item = FacebookPin.query.filter_by(idFacebook=current.idFacebook).first()
		
		if item == None:
<<<<<<< HEAD
			addObject(current)

def addUser(name,password):
	newUser = User(name,password)
	addObject(newUser)
	
def addCategory(form):
	db.session.add(form)
	db.session.commit()
	
def UpdateUserVoteEvent(idUser,posneg,idPin):

	if idUser and idPin and posneg:
		item = Vote.query.filter_by(idUser=idUser, idPin=idPin).first()
		pinItem = Pin.query.filter_by(id=idPin).first()
		if item:

			if item.posneg != posneg:
				oldposneg=item.posneg
				
				if posneg>0 and oldposneg<0:
					
					pinItem.score=int(pinItem.score)+2
				elif (posneg>0 and oldposneg==0) or (posneg==0 and oldposneg<0) :
					pinItem.score=int(pinItem.score)+1
				elif (posneg<0 and oldposneg==0) or (posneg==0 and oldposneg>0):
					pinItem.score=int(pinItem.score)-1
				elif posneg<0 and oldposneg>0:
					pinItem.score=int(pinItem.score)-2
			item.posneg=posneg
			db.session.commit()

		else:
			newVote=Vote(idUser,idPin)
			newVote.posneg=posneg
			pinItem.score=posneg
			addObject(newVote)
=======
			addObjet(current)

#Creates points of interest sncf
def addPointOfInterest(form):

	db.session.add(form)
	db.session.commit()

def updatePointOfInterestByIdPointOfInterest(current) :
	if current:
		item = PointOfInterest.query.filter_by(idPointOfInterest=current.idPointOfInterest).first()
		
		if item is None:
			addObjet(current)
>>>>>>> origin/dev-PointsOfInterest
