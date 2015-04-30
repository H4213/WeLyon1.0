
import facebook
import json
import datetime
import sys
import requests
sys.path.append("../")

import service

from src.model import FacebookPin

def createFacebookTable() :
	# FACEBOOK_APP_ID     = '1620948188142851'
	# FACEBOOK_APP_SECRET = '52762f86fefa57c8f828617d15625169'
	FACEBOOK_APP_ID     = '1620948188142851'
	FACEBOOK_APP_SECRET = '52762f86fefa57c8f828617d15625169'


	# payload = {'grant_type': 'client_credentials', 'client_id': FACEBOOK_APP_ID, 'client_secret': FACEBOOK_APP_SECRET }
	# file = requests.post('https://graph.facebook.com/oauth/access_token?', params = payload)
	# #print file.text #to test what the FB api responded with    
	token = 'CAACEdEose0cBAKpzSWaR0KzdW4ZCzMGJ56ZCBM3OehDhcikUmxYqUKJyAwMkKxQ3t5n3hu0yutvBsjmvu9SkeoNdnxaRQbs1WJKQ0r8oiSZBQIT8vpqSitUljKZC2DT9Kj5Rmo9WsSLZAZBd27QS752fRhJWCrOnhmQ4VUh34o5uxAfZBzob9pHZCQ9cZCtosvx30wuPqHZC52Ex0h9FZBR2K68'


	# # Trying to get an access token. Very awkward.
	# oauth_args = dict(client_id     = FACEBOOK_APP_ID, client_secret = FACEBOOK_APP_SECRET, grant_type    = 'client_credentials')
	# oauth_curl_cmd = ['curl','https://graph.facebook.com/oauth/access_token?' + urllib.urlencode(oauth_args)]
	# oauth_response = subprocess.Popen(oauth_curl_cmd,stdout = subprocess.PIPE,stderr = subprocess.PIPE).communicate()[0]

	# try:
	#     token = urlparse.parse_qs(str(oauth_response))['access_token'][0]
	# except KeyError:
	#     print('Unable to grab an access token!')
	#     exit()

	#token = 'CAACEdEose0cBAPfoaH5UtoC3nt4KYqNShODlAJyOh71QPX4FLKFldn1Tw44wu95CdtMm96gnvPkUkJGPIhsuUtzvNDncxmLrcWGA64ZCULx0GYOGmbZBS9s1jjLqg7ZB9PAaxK26XwtEgIPvciuJySZAF93FLzuBvjNUU4ANB2rQm8VnhNZCOoDjb8JDKjYiU6Q8yMMaNGoQuKFpFx8Q1'

	nbEvent=100
	latitudeMin=45.6389404
	longitudeMin=4.7530973
	latitudeMax=46.2276655
	longitudeMax=5.0036580
	graph = facebook.GraphAPI(token)

	t=graph.request("search",{ 'q' : 'Villeurbanne', 'type' : 'event', 'limit' : nbEvent, 'start_time' : 'currentTime'})
	events = json.dumps(t['data'],[0], indent=1)
	i=-1
	listFacebook =[]
	nbIter = nbEvent-1
	
	#add categorie (creates if not exists)
	categorie = Category.query.filter_by(nom = "Facebook Event").first()
	
	if not(categorie):
		init_databases.init_categories()
		categorie = Category.query.filter_by(nom = "Facebook Event").first()
		
	#add admin (creates if not exists)
	admin_user = User.query.filter_by(pseudo="admin").first()
	if admin_user==None:
		init_databases.init_admin_user()
		admin_user = User.query.filter_by(pseudo="admin").first()
		
	while i < nbIter:
		
		i+=1

		title=t['data'][i]['name']

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
						else:
							description =""
						if 'start_time' in Event:
							start_time=Event['start_time']
							if 'end_time' in Event:
							
								end_time = Event['end_time']
							else:
								 end_time = 'currentTime'
							#image=graph.request(idEvent+'/picture?redirect=false')
							#linkpicture=image['data']['url']

							obj = FacebookPin(title, longitude, latitude, admin_user.id, [categorie], description)
							obj.dateBegin = start_time
							obj.dateEnd = end_time
							obj.idFacebook = idEvent
							listFacebook.append(obj)
							#print("Ok")

		except (requests.ConnectionError , urllib2.URLError):
			service.errorMessage ("ConnectionError")
		
			


	return listFacebook

def refreshFacebookData():
	list = createFacebookTable()
	service.logMessage(".Updating the database")
	for v in list:
		service.updateFacebookByIdFacebook(v)
	service.logMessage(".Facebook  is up to date")








	# if "location" in t['data'][i] :
	# 	location = t['data'][i]['location']
	# 	locationTab=graph.request("search",{ 'q' : location,'type' : 'page'})
	# 	locationJson = json.dumps(locationTab['data'],[0], indent=1)
	# 	with open("C:\Test\Test2"+str(i)+".txt", 'w+') as myfile:
	# 		myfile.write(locationJson)
	# 		myfile.close()
	# 	json_size = len(locationJson)
	# 	j=-1
	# 	while j<json_size:
	# 		j+=1
	# 		locationName=locationTab['data'][j]['name']
	# 		if locationName == location:
	# 			truc=locationTab['data'][j]
	# 			break
	# 	idLocation = locationTab['data'][j]['id']

	# 	placeTab=graph.request(idLocation)
	# 	latitude=placeTab['location']['latitude']
	# 	longitude=placeTab['location']['longitude']

	# 	placeJson=json.dumps(placeTab)
	# 	with open("C:\Test\Test2"+str(i)+"1.txt", 'w+') as myfile:
	# 		myfile.write(placeJson)
	# 		myfile.close()

		