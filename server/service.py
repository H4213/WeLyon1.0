from src import model
from src.model import User, Pin, Category, Vote
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
		
		if item == None:
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

#Creates points of interest sncf
def addPointOfInterest(form):
	db.session.add(form)
	db.session.commit()

def updatePointOfInterestByIdPointOfInterest(current) :
	if current:
		item = Pin.query.filter_by(typeSpecificID=current.typeSpecificID, type='pointOfInterest').first()
		if item is None:
			addObject(current)

