from src import model
from src.model import User, Pin, Category, Velov , FacebookPin, Groupe

from server import service

from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time

db = service.connectToDatabase()

#---------------------------------------------------
#--------------------------Category-----------------
def getPinByIdUser(nomUser):
	#user = User.query.filter_by(pseudo = nomUser)
	user = User.query.filter_by(pseudo = nomUser).first()

	if user and user.pins:
		return jsonify(categories=[item.serialize() for item in user.pins])

	return jsonify(error = "No pin")

def requestGroupNameFree(name):
	group = Groupe.query.filter_by(name = name).first()

	if group:
		return jsonify(free = "false")

	return jsonify(free = "true")

def getGroupeByName(name):
	group = Groupe.query.filter_by(name = name).first()

	if group:
		return jsonify(group.serialize())

	return jsonify(erro= "no group with that name")

def addGroupeFromForm(form):
	if form:
		name = form['name']
		users= form['users']
		cats = form['categories']

		if name:
			group = Groupe(name)

			if users:
				for nom in users:
					user = User.query.filter_by(pseudo = nom).first()

					if user:
						group.users.append(user)

			if cats:
				for nom in cats:
					category = Category.query.filter_by(nom = nom).first()

					if category:
						group.categories.append(category)

		db.session.add(group)
		db.session.commit()

		return jsonify(group.serialze())



	return jsonify(error="invalid parameter")

def deleteGroupe(form):
	if (form['id']):
		item = Groupe.query.get(form['id'])
		if item:
			db.session.delete(item)
			db.session.commit()
			return jsonify(deleted = "1")

		return jsonify(deleted = "0")
	return jsonify(deleted = "No id")


def majGroupe(form):
	return "1"