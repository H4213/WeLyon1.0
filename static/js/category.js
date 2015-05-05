function Category() {
    var rest = new RESTful();
    var self = this;

    self.path = '/categories/';

//TODO a verifier
    self.getCategories = function(callback) {
        rest.get(self.path, null, callback);
    };

}
