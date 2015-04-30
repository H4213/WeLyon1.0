function Pin() {
    var rest = new RESTful();
    var self = this;

    self.path = URL+'/pins/';

    self.getPins = function() {
        var result = rest.get(self.path, null);
        if ((result.response) && (result.data !== undefined)) {
           return result.data.pins;
        }
        return null;
    };

    self.updatePin = function(idPin,data) {
        var result = rest.update(self.path+'vote/'+idPin, data);
        if ((result.response) && (result.data !== undefined)) {
           return result.data.pins;
        }
        return null;
    };
}