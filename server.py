#! /usr/bin/python
# -*- coding:utf-8 -*-

#constants
VELOV_DATA_SOURCE = "https://download.data.grandlyon.com/ws/rdata/jcd_jcdecaux.jcdvelov/all.json"
DATA_REFRESH_INTERVAL = 20

import sys
reload(sys)
sys.setdefaultencoding("utf-8")

import threading
import thread
import time
import os
from flask import Flask, flash, render_template, request, session, jsonify, send_file
from flask.ext.sqlalchemy import SQLAlchemy
from flask_jsglue import JSGlue
from server import service

import server
from src.model import User, Pin, Category
from server import velov
from server import facebookPin
from server import service
from server import init_databases



app = Flask(__name__)
jsglue = JSGlue(app)
db = service.connectToDatabase()

@app.route("/")
def index():
  return render_template("index.html")

@app.route("/assests/<file>")
def file (file) : 
  return send_file("./static/assests/" + file , mimetype='image/gif')

#Affichage des différents marqueurs enregistrés
@app.route('/pins/', methods=('GET', 'POST', 'PUT', 'DELETE'))
@app.route('/pins/<category>/')
def pins(category = None):
  if request.method == "POST":
    return service.majPin(request.form)

  if request.method == 'PUT':
    return service.addPin(request.form)

  if request.method == 'DELETE':
    item = Pin.query.get(id)
    if item:
      db.session.delete(Pin.query.get(id))
      db.session.commit()
      return jsonify(deleted = "1")

    return jsonify(deleted = "0")

  return service.getAllPin(category)

@app.route('/pin/<idPin>/')
def pin(idPin = None):
  return service.getPinById(idPin)

@app.route('/user', methods=('GET', 'POST', 'PUT', 'DELETE'))
@app.route('/user/<idUser>/')
def user(idUser = None):

  if request.method == "POST":
    return service.majUser(request.form)

  if request.method == 'PUT':
    return service.addUser(request.form)

  if request.method == 'DELETE':
    item = User.query.get(id)
    if item:
      db.session.delete(User.query.get(id))
      db.session.commit()
      return jsonify(deleted = "1")

    return jsonify(deleted = "0")

  return service.getAllUser(idUser)

@app.route('/categories/', methods=('GET', 'POST', 'PUT', 'DELETE'))
@app.route('/categories/<pin>/')
def categories(pin = None):
  if request.method == "POST":
    return service.majCategory(request.form)

  if request.method == 'PUT':
    return service.addCategory(request.form)

  if request.method == 'DELETE':
    item = Category.query.get(id)
    if item:
      db.session.delete(Category.query.get(id))
      db.session.commit()
      return jsonify(deleted = "1")

    return jsonify(deleted = "0")

  return service.getAllCategory(pin)

@app.route('/category/<category>/')
def category(category = None):
  return service.getCategoryById(category)

#renvoie l'id après l'authentification de l'utilisateur
@app.route('/auth', methods=('GET', 'POST'))
def auth():
  if request.method == 'POST':
    return service.authentificaton(request.form)
  return jsonify(error="false request")

#ajout d'un marqueur
@app.route('/add/pin', methods=('GET', 'POST'))
def addPin():
  if request.method == 'POST':
    return service.addPin(request.form)
  return jsonify(error="false request")

#inscription d'un utilisateur
@app.route('/add/user', methods=('GET', 'POST'))
def addUser():
  if request.method == 'POST':
    return service.addUser(request.form)
  return jsonify(error="false request")

@app.route('/delete/<obj>/<id>/')
@app.route('/delete/<obj>/<id>/')
@app.route('/delete/<obj>/<id>/')
def delete(obj = None, id = None):
  if (obj == "user"):
    db.session.delete(User.query.get(id))
  elif(obj == "pin"):
    db.session.delete(Pin.query.get(id))
  elif(obj == "category"):
    db.session.delete(Category.query.get(id))
  else:
    return jsonify(retour = "0") #No object deleted

  db.session.commit()
  return jsonify(retour = "1") #object deleted

@app.errorhandler(404)
def page_not_found(error):
    return jsonify(error="404"), 404
	

def load_facebook_event():
  facebookPin.refreshFacebookData()

def refresh():
	#load_facebook_event()
	while 1:
		velov.refreshVelovData(VELOV_DATA_SOURCE)
		time.sleep(DATA_REFRESH_INTERVAL)

def start_refresh_thread():
	thread.start_new_thread (refresh, ())

if __name__ == '__main__':
  init_databases.init_all()
  start_refresh_thread()
  service.logMessage("Démarrage du serveur")
  app.run()
	
