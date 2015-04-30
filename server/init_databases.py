import sys
sys.path.append("../")
from src import model
from src.model import User, Pin, Category, Velov , FacebookPin
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
		u = User("admin", "pass")
		service.addUser(u)
		service.logMessage("Ajout de l'utilisateur 'admin'")
	else:
		service.logMessage("l'utilisateur 'admin' existe deja")

def try_push_category(name, descr):
	categorie = Category.query.filter_by(nom = name).first()
	if categorie == None:
		c = Category(name, descr)
		service.addCategory(c)
		
def init_categories():
	service.logMessage("Creation des categories")
	try_push_category("Velo'v", "les stations velo'v")
	try_push_category("Facebook Event", "Un evenenement facebook")
	try_push_category("Bar", "Bar")
	try_push_category("Restaurant", "Bar")
	try_push_category("Hotel", "Hotel/Motel")
	try_push_category("Monument", "")
	try_push_category("Soiree", "")
	
def init_all():
	init_admin_user()
	init_categories()