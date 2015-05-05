#! /usr/bin/python
# -*- coding:utf-8 -*-

#constants
VELOV_DATA_SOURCE = "https://download.data.grandlyon.com/ws/rdata/jcd_jcdecaux.jcdvelov/all.json"
DATA_REFRESH_INTERVAL = 300

import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import json
import threading
import thread
import time
import os
from flask import Flask, flash, render_template, request, session, jsonify, send_file
from flask.ext.sqlalchemy import SQLAlchemy
from flask_jsglue import JSGlue
from server import service
from server import servicePin
from server import serviceUser
from server import serviceCategory

import server
from src.model import User, Pin, Category
from server import velov
from server import facebookPin
from server import service
from server import init_databases
from server import poi



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
    return servicePin.majPin(request.form)

  if request.method == 'PUT':
    return servicePin.addPinFromForm(request.form)

  if request.method == 'DELETE':
    return servicePin.delete(request.form)

  if category:
    return servicePin.getPinsByIdCategory(category)

  visibility = request.args.get('visibilite')
  if visibility:
    return servicePin.getPinByVisibility(visibility)
  return servicePin.getAllPin()

@app.route('/pin/<idPin>/')
def pin(idPin = None):
  return servicePin.getPinById(idPin)

@app.route('/user/connect/', methods=['POST'])
def connectUser(data=None):
    if request.method == 'POST':
      return serviceUser.authUser(request.form)

@app.route('/user/', methods=('GET', 'POST', 'PUT', 'DELETE'))
@app.route('/user/<idUser>/')
def user(idUser = None, data=None):
  if request.method == "POST":
    return serviceUser.addUserFromForm(request.form)
  
  if request.method == 'PUT':
    return service.majUser(request.form)
  if request.method == 'DELETE':
    return serviceUser.delete(request.form)

  if idUser:
    return serviceUser.getUserById(idUser)

  return serviceUser.getAllUser()

@app.route('/categories/', methods=('GET', 'POST', 'PUT', 'DELETE'))
def categories(pin = None):
  if request.method == "POST":
    return serviceCategory.majCategory(request.form)

  if request.method == 'PUT':
    return serviceCategory.addCategoryFromForm(request.form)

  if request.method == 'DELETE':
    return serviceCategory.delete(request.form)

  return serviceCategory.getAllCategory()

@app.route('/category/<category>/')
def category(category = None):
  return serviceCategory.getCategoryById(category)

#renvoie l'id après l'authentification de l'utilisateur
@app.route('/auth', methods=('GET', 'POST'))
def auth():
  if request.method == 'POST':
    return service.authentificaton(request.form)
  return jsonify(error="false request")

#ajout d'un marqueur
@app.route('/add/pin/', methods=('GET', 'POST'))
def addPin():
  if request.method == 'POST':
    return servicePin.addPin(request.form)
  return jsonify(error="false request")

@app.route('/add/dynPin/', methods=['POST'])
def addDynPin():
  if request.method == 'POST':
    return servicePin.addDynPin(request.form)

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

@app.route('/pin/vote/<idPin>/', methods=['POST'])
def updateVote(idPin =None, data=None):
  if request.method =='POST':
    
    return service.UpdateUserVoteEvent(request.form,idPin)


@app.route('/search/<term>')
def search(term):
  if term:
    return service.globalSearch(term)
  else:
    return jsonify(error="false request")

  
@app.errorhandler(404)
def page_not_found(error):
    return jsonify(error="404"), 404

def load_facebook_event():
  facebookPin.refreshFacebookData()

def refresh():
	#load_facebook_event()
	load_static_data()
	while 1:
		velov.refreshVelovData(VELOV_DATA_SOURCE)
		time.sleep(DATA_REFRESH_INTERVAL)


def start_refresh_thread():
	thread.start_new_thread (refresh, ())

def load_static_data():
  poi.loadData()


if __name__ == '__main__':
  init_databases.init_all()
  start_refresh_thread()
  service.logMessage("Démarrage du serveur")
  app.debug = True
  app.run()
	
