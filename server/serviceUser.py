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

def addFriendFromForm(form):
	if (form['userID'] and form['newFriendID']):
		if int(form['userID']) == int(form['newFriendID']):
			return jsonify(error="Of course you're your own friend...") 

		exist1 = User.query.filter_by(id=int(form['userID'])).first()
		exist2 = User.query.filter_by(id=int(form['newFriendID'])).first()

		if exist1 and exist2:
			query = "insert into assFriends VALUES ("+str(form['userID'])+","+ str(form['newFriendID'])+")"
			db.engine.execute(query)
			return jsonify(result="OK")
		else:
			return jsonify(error="inexistent member")
	else:
		jsonify(error="incorrect form")

def deleteFriendship(form):
	if (form['ID1'] and form['ID2']):
		query0 = "select * from assFriends where friend1ID="+str(form['ID1'])+" or " + " friend2ID="+str(form['ID2'])
		items = db.engine.execute(query)
		if item:
			query = "delete from assFriends where friend1ID="+str(form['ID1'])+" and " + " friend2ID="+str(form['ID2'])
			db.engine.execute(query)
		else:
			return jsonify(error="inexistent friendship")
	else:
		return jsonify(error="invalid form")


def addUserCategory(form):
	if (form['userID'] and form['categoryID']):

		exist1 = User.query.filter_by(id=int(form['userID'])).first()
		exist2 = Category.query.filter_by(id=int(form['categoryID'])).first()

		if exist1 and exist2:
			query = "insert into usrCategories VALUES ("+str(form['userID'])+","+ str(form['categoryID'])+")"
			db.engine.execute(query)
			return jsonify(result="OK")
		else:
			return jsonify(error="inexistent object")
	else:
		jsonify(error="incorrect form")
  

def deleteUserCategory(form):
	if (form['userID'] and form['categoryID']):
		query0 = "select * from usrCategories where userID="+str(form['userID'])+" or " + " categoryID="+str(form['categoryID'])
		items = db.engine.execute(query)
		if item:
			query = "delete from assFriends where userID="+str(form['userID'])+" or " + " categoryID="+str(form['categoryID'])
			db.engine.execute(query)
		else:
			return jsonify(error="inexistent user category")
	else:
		return jsonify(error="invalid form")

def getUserCategoriesById(idUser):
	if idUser:
		print "Query Getting user categories"
		query = "select * from usrCategories where usrID="+str(idUser)
		items = db.engine.execute(query)
		list = []
		if items:
			print "...Got Results"
			for row in items:
				list.append(row["categoryID"])

			return jsonify(userCategories=list)
		else:
			print "...No result"				
			return jsonify(error="No user categories")
	else:
		return jsonify(error = "No idUser")