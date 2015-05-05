import sys
sys.path.append("../")
from src import model
from src.model import User, Pin, Category
from flask import Flask, flash, render_template, request, session
from flask.ext.jsonpify import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time
import service
sys.setdefaultencoding("utf-8")

def init_admin_user():
	admin_user = User.query.filter_by(pseudo="admin").first()
	
	if admin_user == None:
		service.logMessage(".INIT : Ajout de l'admin")
		u = User("admin", "pass")
		service.addObject(u)
		service.logMessage(".INIT : Ajout de l'utilisateur 'admin'")
	else:
		service.logMessage(".INIT : Admin OK")

def try_push_category(name, descr , idFather ):
	categorie = Category.query.filter_by(nom = name).first()
	if categorie == None:
		service.logMessage(".INIT : Ajout de la categorie" + name)
		c = Category(name, descr , idFather)
		return service.addObject(c)

		
def init_categories():
	#Pere
	rootLieu = try_push_category("Lieux", "Lieux presents sur la carte" , None)
	#Fils
	if rootLieu != None :
		try_push_category("Bar/Cafe", "Bar" , rootLieu.id)
		try_push_category("Hopital", "Hopital" , rootLieu.id)
		try_push_category("Musee", "Musee" , rootLieu.id)
		try_push_category("Oeuvre d'art", "Oeuvre d'art" , rootLieu.id)
		try_push_category("Monument", "Monument" , rootLieu.id)
		try_push_category("Police", "Police" , rootLieu.id)
		try_push_category("Autre", "Autres Lieux" , rootLieu.id)
		try_push_category("Restaurant", "Restaurant" , rootLieu.id)
		try_push_category("Night Club", "Night Club" , rootLieu.id)
		rootTrans = try_push_category("Transport", "Transport" , rootLieu.id)
		try_push_category("Velo'v", "Station Velov" , rootTrans.id)
		try_push_category("Parking", "Parking" , rootTrans.id)
		try_push_category("Tcl", "Transport en commun lyonnais" , rootTrans.id)


		rootEvent = try_push_category("Evenement" , "Evenements presents sur la carte" , None)
		rootEventUser = try_push_category("Evenement utilisateur", "Evenements ajoutes par des utilisateurs" , rootEvent.id)
		try_push_category("Evenement Facebook", "Evenements collectes sur Facebook" , rootEvent.id)
		try_push_category("Soiee", "Soiree divers" , rootEventUser.id)
		try_push_category("Concert", "Concert Divers" , rootEventUser.id)
		try_push_category("Spectacle", "Scpectacle divers" , rootEventUser.id)
		try_push_category("Associatif", "Evenements associatif" , rootEventUser.id)
		try_push_category("Sport", "Evenements sportifs" , rootEventUser.id)
		try_push_category("Etudiant", "Evenement Etudiant" , rootEventUser.id)
		try_push_category("Conference", "Soiree divers" , rootEventUser.id)
		try_push_category("Autre", "Autre Evenment" , rootEventUser.id)

	else :
		service.logMessage(".INIT : Categories OK")
	
def init_all():
	init_admin_user()
	init_categories()