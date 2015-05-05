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

	last = Log.query.order_by(Log.id.desc()).first()
	if not last:
		return ""

	lastId = last.id
	print lastId

	log = Log.query.get(more)
	user = User.query.get(log.idUser)
	pinName = ""
	if not log.action == "subscribe":
		pin = Pin.query.get(log.idPin)
		pinName = pin.title


	futurLast = int(lastId)+1

	print "\n\n--------------------------\n", more ," et ",futurLast

	if int(more) == int(futurLast):
		print "egal"
		return ""

	getNext = ""
	if not int(more) == int(lastId):
		getNext = "<script>chargerNews();</script>"

	more = int(more) + 1
	more = defMore(more, lastId)

	script = "<script>setId("+str(more)+");</script>"


	div = '<div id="filActu" class="col-sm-2"><span id="'+str(log.idUser)+'">'+user.pseudo+'</span><br>'+log.action+'<br><span id="'+str(log.idPin)+'">'+pinName+'</span><script>//alert("'+ str(log.id) +'appele")</script></div>'

	return div + script + getNext
		
	items = Log.query.all()
	return jsonify(logs=[item.serialize() for item in items])

	return jsonify(logs=[item.serialize() for item in iter(logs.get, None)])

def defMore(more, last):
	if more == 0:
		if last > 5:
			newMore = int(last) - int(more)
			return newMore
		return more
	return more

def filTest():
	items = Log.query.all()
	return jsonify(logs=[item.serialize() for item in items])

def logister(log):

	logs.put(log)

	db.session.add(log)
	db.session.commit()

def user(idUser):
	log = Log(idUser, "subscribe", 1)

	logister(log)

def like(idUser, idPin, posneg):
	action = ""
	if  int(posneg) > 0:
		action = "Like"
	elif int(posneg) < 0:
		action = "Dislike"
	else :
		action = "Unlike"
	log = Log(idUser, action, idPin)

	logister(log)

def add(idUser, idPin):
	log = Log(idUser, "add", idPin)

	logister(log)

def delete(idUser, idPin):
	log = Log(idUser, "delete", idPin)

	logister(log)