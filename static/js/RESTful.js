function RESTful() {
    var self = this;

    self.fillResult = function(data, response) {
        var result = {};
        result.data = data;
        result.response = response;
        return result;
    };

    self.get = function(url, data) {
        var result = {};
        try {
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                data: data,
                async: false
            }).done(function(data) {
                result = self.fillResult(data, true);
            }).fail(function() {
                result = self.fillResult(null, false);
            });
        } catch (e) {
            result = self.fillResult(null, false);
        }
        return result;
    };

    self.insert = function(url, data) {
        var result = {};
        try {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: url,
                data: data,
                async: false
            }).done(function(data) {
                result = self.fillResult(data, true);
            }).fail(function() {
                result = self.fillResult(null, false);
            });
        } catch (e) {
            result = self.fillResult(null, false);
        }
        return result;
    };

    self.update = function(url, data) {
        var result = {};
        try {
            $.ajax({
                type: 'PUT',
                dataType: 'json',
                url: url,
                data: data,
                async: false
            }).done(function(data) {
                result = self.fillResult(data, true);
            }).fail(function() {
                result = self.fillResult(null, false);
            });
        } catch (e) {
            result = self.fillResult(null, false);
        }
        return result;
    };

    self.delete = function(url) {
        var result = {};
        try {
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: url,
                data: data,
                async: false
            }).done(function(data) {
                result = self.fillResult(data, true);
            }).fail(function() {
                result = self.fillResult(null, false);
            });
        } catch (e) {
            result = self.fillResult(null, false);
        }
        return result;
    };
}