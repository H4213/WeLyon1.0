function Category() {
    var rest = new RESTful();
    var self = this;

    this.path = '/categories';

//TODO a verifier
    this.getCategories = function() {
        var result = rest.get(URL+self.path, null);
        if ((result.response) && (result.data !== undefined)) {
            for(var i in result.data){
                self.categoryList.push(self.fillObject(result.data[i]));
            }
        }
        return self.categoryList;
    };
}
