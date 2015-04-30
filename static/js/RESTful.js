function RESTful() {
    var self = this;
    var URL = "http://127.0.0.1:5000";

    self.get = function(path, data , callback) {
        try {
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: URL + path,
                data: data,
                async: true,
            }).done(function(data) {
                callback(data);
            }).fail(function(err) {
                console.log(err);
            });
        } catch (e) {
           console.log(e);
        }
    };

    this.insert = function(url, data , callback) {
        try {
            $.ajax({
                type: 'POST',
                dataType: 'jsonp',
                url: URL + path,
                data: data,
                async: true
            }).done(function(data) {
                callback(data);
            }).fail(function(err) {
                console.log(err);
            });
        } catch (e) {
            console.log(e);
        }
    };


   this.update = function(url, data , callback) {
        try {
            $.ajax({
                type: 'PUT',
                dataType: 'jsonp',
                url: URL + path,
                data: data,
                async: true
            }).done(function(data) {
                callback(data);
            }).fail(function(err) {
                console.log(err);
            });
        } catch (e) {
            console.log(e);
        }
    };



    this.delete = function(url, data , callback) {
        try {
            $.ajax({
                type: 'DELETE',
                dataType: 'jsonp',
                url: URL + path,
                data: data,
                async: true
            }).done(function(data) {
                callback(data);
            }).fail(function(err) {
                console.log(err);
            });
        } catch (e) {
            console.log(e);
        }
    };
}