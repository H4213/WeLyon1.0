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
#--------------------------Category-----------------
def getAllCategory():
	items = Category.query.all()

	if items:
		return jsonify(categories=[item.serialize() for item in items])

	return jsonify(error = "No Category")

def getCategoryById(idCategory):
	print "getCategoryById"
	if idCategory:
		item = Category.query.get(idCategory).first()

		if item:
			return jsonify(categories=[item.serialize()])

		return jsonify(error="No category")

	return jsonify(error = "No idCategory")

def getCategoryByIdPin(idPin):
	print "getCategoryByIdPin"
	#id de la pin

	if idPin:
		pin = Pin.query.get(idPin)
		if pin:
			items = pin.categories
			return jsonify(categories=[item.serialize() for item in items])
		else:
			return jsonify(errors="No pin")

	return jsonify(errors="No idPin")
	
	#items = Category.query.filter_by(rank > rank).all()

def addCategoryFromForm(form):
	if (Category(form['name'] and form['description'] and form['idFather'])):

		exist = Category.query.filter_by(nom=form['name']).first()

		if exist:
	
			return jsonify(error="already exist")

		item = Category(form['name'], form['description'])
		father = Category.query.get(form['idFather'])
		if father:
			item.categoryFather = father
			
		db.session.add(item)
		db.session.commit()

		return jsonify(categories=[item.serialize()])

	return jsonify(error="invalid parameters")

def deleteCategory(form):
	if (form['id']):
		item = Category.query.get(id)
		if item:
			db.session.delete(Category.query.get(id))
			db.session.commit()
			return jsonify(deleted = "1")

		return jsonify(deleted = "0")
	return jsonify(deleted = "No id")
	

def majCategory(form):
	return "0"