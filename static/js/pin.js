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
       var data = {
                        "idUser": userID,
                        "posneg": posnegParam
                }
        
        var url='/pin/vote/'+pinID+'/';
        console.log(data);
        rest.insert(url,data,callback);
    };                                                                                                                                                                                                                                  

  

}

