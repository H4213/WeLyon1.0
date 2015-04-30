function Category() {
    var rest = new RESTful();
    var self = this;

    this.path = '/categories/';

//TODO a verifier
    this.getCategories = function(callback) {
        rest.get(self.path, null, callback);
    };
}
