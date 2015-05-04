from src import model
from src.model import User, Pin, Category, Log

from server import serviceConnection

import Queue
from Queue import LifoQueue

from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time

db = serviceConnection.connectToDatabase()

SIZE_OF_QUEUE = 200

logs = LifoQueue(SIZE_OF_QUEUE)

#---------------------------------------------------
#--------------------------Log-----------------
def getFil(more):
	items = logs

	if more >= SIZE_OF_QUEUE:
		items = Log.query.all()

	return jsonify(logs=[item.serialize() for item in items])

def logister(log):

	logs.put(log)

	db.session.add(log)
	db.session.commit()

def like(idUser, idPin, posneg):
	action = ""
	if  posneg >= 0:
		action = "Like"
	else:
		action = "Dislike"
	log = Log(idUser, action, idPin)

	logister(log)

def add(idUser, idPin):
	log = Log(idUser, "add", idPin)

	logister(log)

def delete(idUser, idPin):
	log = Log(idUser, "delete", idPin)

	logister(log)