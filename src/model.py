# model.py

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

from sqlalchemy import Table, Column, create_engine
from sqlalchemy import Integer, ForeignKey, String, Unicode, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import backref, relation

app = Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://tmucotknskzdvn:B5Hyna3G7I1xIhPj3i_CSdl-GS@ec2-54-163-238-96.compute-1.amazonaws.com:5432/d6fisokcj01ulm'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://H4213:SabreESS32@82.241.33.248:3306/WeLyon-dev'
db = SQLAlchemy(app)
 
########################################################################
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

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    #------------------------------------------------------------------

association_table = Table('associationPinCategory', db.Model.metadata,
    Column('pin_id', Integer, ForeignKey('pins.id')),
    Column('category_id', Integer, ForeignKey('categories.id'))
)

class Category(db.Model):

    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key = True)
    nom = db.Column(db.String(50))
    description = db.Column(db.String(50))
    #categoryFather = db.Column(db.Integer, db.ForeignKey("categories.id"))
    #categoriesChild = db.relationship('Category',lazy='dynamic')

    def __init__(self, nom, description):
        self.nom = nom
        self.description = description

    def serialize(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'description': self.description,
            'pins' : [item.serializeSmall() for item in self.pins]
        }

    def serializeSmall(self):
        return {
            'id': self.id,
            'nom': self.nom,
        }

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    #------------------------------------------------------------------

class Pin(db.Model):
    __tablename__ = 'pins'
    id = db.Column(db.Integer, primary_key = True)
    type = db.Column(db.String(30))
    idUser = db.Column(db.Integer, db.ForeignKey("users.id"))
    title = db.Column(db.String(100))
    categories = db.relationship("Category",
                    secondary=association_table)
					
    description = db.Column(db.String(400)) 
    lng = db.Column(db.Float)
    lat = db.Column(db.Float)

    def __init__(self, title, lng, lat, idUser = 1, categories = [], description = ""):
        self.idUser = idUser
        self.title = title
        self.categories = categories
        self.description = description
        self.lng = lng
        self.lat = lat

    def serialize(self):
        return {
            'id': self.id,
            'user': self.idUser,
            'title': self.title,
            'category': [item.serializeSmall() for item in self.categories],
            'description': self.description,
            'lng': self.lng,
            'lat': self.lat,
        }

    def serializeSmall(self):
        return {
            'id': self.id,
            'title': self.title,
        }

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    __mapper_args__ = {
        'polymorphic_on':type,
        'polymorphic_identity':'employee'
    }

class DynPin(Pin):
    __tablename__ = 'dynpins'

    id = Column(db.Integer, db.ForeignKey('pins.id'), primary_key=True)
    dateBegin = Column(db.DateTime)
    dateEnd = Column(db.DateTime)

    def serialize(self):
        return {
            'id': self.id,
            'user': self.idUser,
            'title': self.title,
            'category': [item.serializeSmall() for item in self.categories],
            'description': self.description,
            'lng': self.lng,
            'lat': self.lat,
            'DateDebut': self.dateBegin,
            'DateFin': self.dateEnd,
        }

    def serializeSmall(self):
        return {
            'id': self.id,
            'title': self.title,
        }

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    __mapper_args__ = {
        'polymorphic_identity':'dynpin',
    }

class Velov(Pin):
    __tablename__ = 'velovs'

    id = Column(db.Integer, db.ForeignKey('pins.id'), primary_key=True)
    libre = Column(db.Integer)
    velo = Column(db.Integer)
    idVelov = Column(db.Integer)

    def serialize(self):
        return {
            'id': self.id,
            'type' : 'velov',
            'idVelov': self.idVelov,
            'user': self.idUser,
            'title': self.title,
            'category': [item.serializeSmall() for item in self.categories],
            'description': self.description,
            'lng': self.lng,
            'lat': self.lat,
            'libre': self.libre,
            'velo': self.velo,
        }

    def serializeSmall(self):
        return {
            'id': self.id,
            'title': self.title,
        }
		
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    __mapper_args__ = {
        'polymorphic_identity':'velov',	
    }

class FacebookPin(DynPin):
    __tablename__ = 'facebookpins'

    id = Column(db.Integer, db.ForeignKey('dynpins.id'), primary_key=True)
    idFacebook = Column(db.BigInteger)

    def serialize(self):
        return {
            'id': self.id,
            'type' : 'facebook',
            'idFacebook': self.idFacebook,
            'user': self.idUser,
            'title': self.title,
            'category': [item.serializeSmall() for item in self.categories],
            'description': self.description,
            'lng': self.lng,
            'lat': self.lat,
        }

    def serializeSmall(self):
        return {
            'id': self.id,
            'title': self.title,
        }
        
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    __mapper_args__ = {
        'polymorphic_identity':'facebook',
        
        
        
    }

db.create_all()