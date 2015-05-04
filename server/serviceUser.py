from src import model
from src.model import User, Pin, Category

from server import service

from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time

db = service.connectToDatabase()

#---------------------------------------------------
#--------------------------User---------------------
def getAllUser():
	print "getAllUser"
	items = User.query.all()

	if items :
		print "users non vide"
		return jsonify(users=[item.serialize() for item in items])

	print "user vide"
	return jsonify(error="No user")

def getUserById(idUser):
	print "getUserById"
	if idUser:
		item = User.query.get(idUser).first()

		if item:
			return jsonify(categories=[item.serialize()])

		return jsonify(error="No user")

	return jsonify(error = "No idUser")


def addUserFromForm(form):
	if (form['pseudo'] and form['password']):
		exist = User.query.filter_by(pseudo=form['pseudo']).first()

		if exist:
	
			return jsonify(error="already exist")

		user = User(form['pseudo'], form['password'])

		db.session.add(user)
		db.session.commit()

		return jsonify(idUser=user.id, nameUser=user.pseudo)

	return jsonify(error="invalid parameters")
	
def authUser(form):
	if (form['pseudo'] and form['password']):
		user = User.query.filter_by(pseudo=form['pseudo']).first()
		if user and user.passw==form['password']:
			return jsonify(idUser=user.id, nameUser=user.pseudo)
		return jsonify(error = "invalid password")
  
def deleteUser(form):
	if (form['id']):
		item = User.query.get(id)
		if item:
			db.session.delete(User.query.get(id))
			db.session.commit()
			return jsonify(deleted = "1")

		return jsonify(deleted = "0")
	return jsonify(deleted = "No id")


def majUser(form):
	return "0"

def getUserFriendsById(idUser):

	if idUser:
		print "Query Getting Friends"
		query = "select * from assFriends where friend1ID="+str(idUser)+" or " + " friend2ID="+str(idUser)
		items = db.engine.execute(query)
		list = []
		if items:
			print "...Got Results"
			for row in items:
				if int(row["friend1ID"]) != int(row["friend2ID"]):
					#print idUser
					if int(idUser) == int(row["friend1ID"]):
						list.append(row["friend2ID"])
					else:
						list.append(row["friend1ID"])

			return jsonify(friends=list)
		else:
			print "...No result"				
			return jsonify(error="No friend")
	else:
		return jsonify(error = "No idUser")

