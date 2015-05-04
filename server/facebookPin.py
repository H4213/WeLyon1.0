
import facebook
import json
import datetime
import sys
import requests
import urllib2
sys.path.append("../")

from src import model
from src.model import Category, User, Pin


import service


def createFacebookTable() :

	token = 'CAACEdEose0cBAFfLB9zc5M2XQmDsTV9PzxlnK1hbo1kZCmFicst09AZCg9drafcg8mgQISJU3ZA1HnPEdJHZBabsaHuZB56xhxcDntrQmpXSwLxqwBbjPjZA0iJluz4KNCUrFlFJl1T8aHpbDvWVSj7qUK8iR6WKYusHBx7CbplAnxa3EfsWuq7EhXdHyBuCV7P8qXQA9GQ17MZBuK2rK6a'
	nbEvent=1000
	latitudeMin=45.6389404
	longitudeMin=4.7530973
	latitudeMax=46.2276655
	longitudeMax=5.0036580
	graph = facebook.GraphAPI(token)

	t=graph.request("search",{ 'q' : 'Lyon', 'type' : 'event', 'limit' : nbEvent, 'start_time' : 'currentTime'})
	events = json.dumps(t['data'],[0], indent=1)
	i=-1
	listFacebook =[]
	nbIter = nbEvent-1
	
	#add categorie (creates if not exists)
	categorie = Category.query.filter_by(nom = "Evenement Facebook").first()
		
	#add admin (creates if not exists)
	admin_user = User.query.filter_by(pseudo="admin").first()
		
	while i < nbIter:
		i+=1

		title=t['data'][i]['name']
		title=title[:19]
		title="".join([x if ord(x) < 128 else '?' for x in title])
		idEvent=t['data'][i]['id']
		try :
			Event=graph.request(idEvent)
			if 'venue' in Event:
				venue=Event['venue']
				if 'latitude' in venue:
					latitude=Event['venue']['latitude']
					longitude=Event['venue']['longitude']
					if (latitude>latitudeMin) & (longitude >longitudeMin) & (latitude <latitudeMax) & (longitude<longitudeMax) :
						if 'description' in Event:
							description = Event['description']
							#description= unicode(description,"utf-8")
							description= description[:99]

							description="".join([x if ord(x) < 128 else '?' for x in description])
						else:
							description =""
						if 'start_time' in Event:
							start_time=Event['start_time']
							if 'end_time' in Event:
							
								end_time = Event['end_time']
							else:
								 end_time = 'currentTime'

							obj = Pin('facebookPin', title, longitude, latitude, admin_user.id, [categorie], description)
							dateBegin=datetime.datetime(year=int(start_time[:4]),day=int(start_time[8:10]),month=int(start_time[5:7]))
							if (start_time[12:14]):
								dateBegin=dateBegin.replace(hour=int(start_time[11:13]))
								dateBegin=dateBegin.replace(minute=int(start_time[14:16]))
							if end_time=='currentTime':
								dateEnd=dateBegin.replace(hour=23,minute=59)
							else:
								dateEnd=datetime.datetime(year=int(start_time[:4]),day=int(start_time[8:10]),month=int(start_time[5:7]))
								if (end_time[12:14]):
									dateEnd=dateEnd.replace(hour=int(end_time[11:13]))
									dateEnd=dateEnd.replace(minute=int(end_time[14:16]))
							obj.typeSpecificID = idEvent
							obj.dateBegin=dateBegin
							obj.dateEnd=dateEnd
							listFacebook.append(obj)
						
		except (requests.ConnectionError , urllib2.URLError):
			service.errorMessage ("ConnectionError")
		
	return listFacebook

def refreshFacebookData():
	service.logMessage(".Facebook : Getting Facebook Events")
	list = createFacebookTable()
	service.logMessage(".Facebook : Updating the database")
	for v in list:
		service.updateFacebookByIdFacebook(v)
	service.logMessage(".Facebook :  I'm up to date")








