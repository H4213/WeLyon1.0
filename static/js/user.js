function User() {
	var rest = new RESTful();
    var self = this;

    self.path = '/user/';

    self.addUser =function(pseudo, password, callback){
       var data = {
                        "pseudo": pseudo,
                        "password": password
                   }
        var url=self.path;
        rest.insert(url,data,callback);
    };                                    
  

}