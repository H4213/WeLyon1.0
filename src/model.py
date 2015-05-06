# model.py

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from sqlalchemy import Table, Column, create_engine
from sqlalchemy import Integer, ForeignKey, String, Unicode, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import backref, relation
import datetime
#pour test
from random import randint
app = Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://tmucotknskzdvn:B5Hyna3G7I1xIhPj3i_CSdl-GS@ec2-54-163-238-96.compute-1.amazonaws.com:5432/d6fisokcj01ulm'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)
 
########################################################################


comments_table = Table('comments', db.Model.metadata,
    Column('pin_id', Integer, ForeignKey('pins.id')),
    Column('text', db.String(400)),
    Column('date', db.DateTime, default=datetime.datetime.utcnow)
)


class User(db.Model):

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    pseudo = db.Column(db.String(50))
    passw = db.Column(db.String(50))

    def __init__(self, username, passw):
        self.pseudo = username
        self.passw = passw

    def serialize(self):
        return {
            'id': self.id,
            'pseudo': self.pseudo,
            'passw': self.passw,
        }


    # ceci est un service !!!!!!!     
    # def delete(self):
    #     db.session.delete(self)
    #     db.session.commit()

    #---------------------------------------------------------------

class Category(db.Model):

    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key = True)
    nom = db.Column(db.String(50))
    description = db.Column(db.String(50))
    IdCategoryFather = db.Column(db.Integer, db.ForeignKey("categories.id"))
    categoryFather = db.relationship('Category', remote_side=[id], backref="categoriesChild")



    def __init__(self, nom, description, idFather = id ):
        self.nom = nom
        self.description = description
        self.IdCategoryFather = idFather

    def serialize(self):
        if self.IdCategoryFather:
            return {
                'id': self.id,
                'nom': self.nom,
                'description': self.description,
                'idFather': self.IdCategoryFather
            }
        return {
            'id': self.id,
            'nom': self.nom,
            'description': self.description
        }

    def serializeSmall(self):
        return {
            'id': self.id,
            'nom': self.nom
        }

    #------------------------------------------------------------------

class Pin(db.Model):
    __tablename__ = 'pins'
    id = db.Column(db.Integer, primary_key = True)
    type = db.Column(db.String(30))
    idUser = db.Column(db.Integer, db.ForeignKey("users.id"))
    title = db.Column(db.String(100))
    categories = db.Column(db.String(100))
    score = db.Column(db.Integer)		
    description = db.Column(db.String(400)) 
    lng = db.Column(db.Float)
    lat = db.Column(db.Float)
    staticHotVisibility =db.Column(db.Boolean)
    dateCreation = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    dateBegin = db.Column(db.DateTime)
    dateEnd = db.Column(db.DateTime)

    typeSpecificID = Column(db.BigInteger)
    data1 = db.Column(db.String(30))
    data2 = db.Column(db.String(30))
    data3 = db.Column(db.String(30))

    def __init__(self, type, title, lng, lat, idUser = 1, categories = [], description = "", score = 0, staticHotVisibility = False):
        self.type = type
        self.idUser = idUser
        self.title = title
        self.categories = ","
        self.score = score
        #pour test
        self.score = randint(0,100)
        for i in categories:
            self.categories = str(self.categories)+str(i.id)+","
        self.description = description
        self.lng = lng
        self.lat = lat
        self.staticHotVisibility=staticHotVisibility

    def serialize(self):

        liste = self.categories.strip(",").split(",")
        if liste[0] == "":
            liste = []
        return {
            'id': self.id,
            'type':self.type,
            'dateCreation':self.dateCreation,
            'dateBegin':self.dateBegin,
            'dateEnd':self.dateEnd,
            'user': self.idUser,
            'title': self.title,
            'category': liste,
            'description': self.description,
            'lng': self.lng,
            'lat': self.lat,
            'score': self.score,
            'data1': self.data1,
            'data2': self.data2,
            'data3': self.data3,
            'typeSpecificID': self.typeSpecificID
        }

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Vote(db.Model):
    __tablename__ = "votes"
    id= db.Column(db.Integer, primary_key = True)
    idUser= db.Column(db.Integer,db.ForeignKey('users.id'))
    idPin = db.Column(db.Integer,db.ForeignKey('pins.id'))
    posneg = db.Column(db.Integer)
    def __init__(self, idUser, idPin, posneg=0):
        self.idUser = idUser
        self.idPin  = idPin

    def serialize(self):
        return {
            'id': self.id,
            'idUser': self.idUser,
            'idPin': self.idPin,
        }

class Log(db.Model):
    __tablename__= "logs"
    id= db.Column(db.Integer, primary_key = True)
    action = db.Column(db.String(10))
    dateTime = db.Column(db.DateTime, default=datetime.datetime.now)
    idUser= db.Column(db.Integer,db.ForeignKey('users.id'))
    idPin = db.Column(db.Integer,db.ForeignKey('pins.id'))

    def __init__(self, idUser, action, idPin):
        self.idUser = idUser
        self.action = action
        self.idPin = idPin

    def serialize(self):
        return {
            'id':self.id,
            'idPin': self.idPin,
            'idUser': self.idUser,
            'action': self.action,
            'time': self.dateTime,
        }



#db.reflect()
#db.drop_all()
db.create_all()
