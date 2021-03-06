function Pin() {
    var rest = new RESTful();
    var self = this;

    self.path = '/pins/';

    self.getPins = function(callback) {
        rest.get(self.path, null , callback );
    };

    self.updatePin = function(idPin,data) {
        var result = rest.update(self.path+'vote/'+idPin, data);
        if ((result.response) && (result.data !== undefined)) {
           return result.data.pins;
        }
        return null;
    };

    self.vote =function(userID,pinID,posnegParam,callback){
       if (userID==-1){
        alert("Veuillez vous connecter")
       }
       else{
        var data = {
                        "idUser": userID,
                        "posneg": posnegParam
                }
        
        var url='/pin/vote/'+pinID+'/';
        rest.insert(url,data,callback);
       } 
    };   

    self.addDynPin=function(title,description,user,jour_debut,mois_debut,annee_debut,heure_debut,minute_debut,jour_fin,mois_fin,annee_fin,heure_fin,minute_fin,lat,lng,idCategorie,callback){
        if (title=="")
            {alert("Donnez un titre à votre évènement")}
        else if (user==-1)
            {alert("veuillez vous connecter")}
        else{
            var data = {
                        "titre": title,
                        "description": description,
                        "idUser": user,
                        "jour_debut": jour_debut,
                        "mois_debut": mois_debut,
                        "annee_debut": annee_debut,
                        "heure_debut": heure_debut,
                        "minute_debut": minute_debut,
                        "jour_fin": jour_fin,
                        "mois_fin": mois_fin,
                        "annee_fin": annee_fin,
                        "heure_fin": heure_fin,
                        "minute_fin": minute_fin,
                        "lat": lat,
                        "lng": lng,
                        "category": idCategorie


                }
            var url="/add/dynPin/"
            rest.insert(url,data,callback);
        }
    }
    self.addStaticPin=function(title,description,user,lat,lng,idCategorie,callback){
         if (title=="")
            {alert("Donnez un titre à votre évènement")}
        else if (user==-1)
            {alert("veuillez vous connecter")}
        else{
            var data = {
                        "titre": title,
                        "description": description,
                        "idUser": user,
                        "lat": lat,
                        "lng": lng,
                        "category": idCategorie
            }
            var url="/add/pin/"
            rest.insert(url,data,callback);
        }
    };

    self.getPinVisibilite=function(visibilite,callback)
    {
        var data = {
            "visibilite": visibilite
        }
        rest.get(self.path,data,callback)
    }
    self.getPinBySearch=function(search,callback)
    {
        var data = {
            "search": search
        }
        rest.get(self.path+"search/",data,callback);
    }

    self.getComments=function(idPin,callback)
    {
        var data = {
            "pin_id": idPin
        }
        rest.get("/comments/"+idPin+"/",data,callback)
    }
    self.addComment=function(text, currentUser, nameUser, idPin, callback){
        

        
        if (currentUser==-1)

            {alert("veuillez vous connecter")}
        else if (text=="")
            {alert("Commentaire vide")}
        else{
            var data = {
                        "username": nameUser,
                        "text": text,
                        "pin_id": idPin
                }
            console.log(data)
            rest.insert("/comments/"+0+"/",data,callback);
        }
       }

}

