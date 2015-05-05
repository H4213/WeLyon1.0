function MessageView() {
    var self = this;
    this.messages = [];
    this.messagesSuccess = [];
    this.messagesInfo = [];
    this.messagesWarning = [];
    this.messagesError = [];
    this.message = '';
    this.container = null;

    this.append = function(message, params) {
        self.messages.push([message, params]);
    };

    this.clear = function() {
        self.messages = [];
        self.messagesSuccess = [];
        self.messagesInfo = [];
        self.messagesWarning = [];
        self.messagesError = [];
        self.message = '';
    };

    this.getPrint = function(message) {
        var print = null;
        if (typeof message === 'string') {
            print = sprintf;
        } else {
            print = vsprintf;
        }
        return print;
    };

    this.appendMessage = function(message, message_type) {
        switch (message_type) {
            case Messages.MessageType.SUCCESS:
                self.messagesSuccess.push(message);
                break;
            case Messages.MessageType.INFO:
                self.messagesInfo.push(message);
                break;
            case Messages.MessageType.WARNING:
                self.messagesWarning.push(message);
                break;
            case Messages.MessageType.ERROR:
                self.messagesError.push(message);
                break;
            default:
                break;
        }
    };

    this.buildMessages = function() {
        var message_type = null;
        var message = '';
        var print = null;
        for (var i = 0; i < self.messages.length; i++) {
            if ((message_type === null) && (i === 0)) {
                message_type = self.messages[i][0].type;
            }
            if ((message_type !== null) && (self.messages[i][0].type !== message_type)) {
                message_type = null;
            }
            print = self.getPrint(self.messages[i][1]);
            message = print(self.messages[i][0].description + '<br/>', self.messages[i][1] !== undefined ? self.messages[i][1] : '');
            self.appendMessage(message, self.messages[i][0].type);
        }
        return message_type;
    };

    this.scrollMessage = function() {
        if ($(self.container).closest('.modal').length === 1) {
            $('.modal').animate({
                scrollTop: $(self.container).offset().top
            }, 1300);
        } else {
            $('html, body').animate({
                scrollTop: $('body').offset().top
            }, 1300);
        }
    };

    this.show = function() {
        self.hide();
        var message_type = self.buildMessages();

        switch (message_type) {
            case null:
                if (self.messagesSuccess.length > 0) {
                    self.message += '<strong>' + Messages.MessageType.SUCCESS.description + '</strong><br/>';
                    self.message += self.messagesSuccess.toString().replace(/,/g, '');
                }
                if (self.messagesInfo.length > 0) {
                    self.message += '<strong>' + Messages.MessageType.INFO.description + '</strong><br/>';
                    self.message += self.messagesInfo.toString().replace(/,/g, '');
                }
                if (self.messagesWarning.length > 0) {
                    self.message += '<strong>' + Messages.MessageType.WARNING.description + '</strong><br/>';
                    self.message += self.messagesWarning.toString().replace(/,/g, '');
                }
                if (self.messagesError.length > 0) {
                    self.message += '<strong>' + Messages.MessageType.ERROR.description + '</strong><br/>';
                    self.message += self.messagesError.toString().replace(/,/g, '');
                }
                $(self.container + ' > .alert').addClass('alert-warning').removeClass('alert-success').removeClass('alert-danger').removeClass('alert-info');
                $(self.container + ' > .alert > .icon > i').addClass('fa-warning').removeClass('fa-check').removeClass('fa-times-circle').removeClass('fa-info-circle');
                break;
            case Messages.MessageType.SUCCESS:
                self.message += self.messagesSuccess.toString().toString().replace(/,/g, '');
                $(self.container + ' > .alert').addClass('alert-success').removeClass('alert-warning').removeClass('alert-danger').removeClass('alert-info');
                $(self.container + ' > .alert > .icon > i').addClass('fa-check').removeClass('fa-warning').removeClass('fa-times-circle').removeClass('fa-info-circle');
                break;
            case Messages.MessageType.INFO:
                self.message += self.messagesInfo.toString().toString().replace(/,/g, '');
                $(self.container + ' > .alert').addClass('alert-info').removeClass('alert-warning').removeClass('alert-danger').removeClass('alert-success');
                $(self.container + ' > .alert > .icon > i').addClass('fa-info-circle').removeClass('fa-warning').removeClass('fa-times-circle').removeClass('fa-check');
                break;
            case Messages.MessageType.WARNING:
                self.message += self.messagesWarning.toString().toString().replace(/,/g, '');
                $(self.container + ' > .alert').addClass('alert-warning').removeClass('alert-info').removeClass('alert-danger').removeClass('alert-success');
                $(self.container + ' > .alert > .icon > i').addClass('fa-warning').removeClass('fa-info-circle').removeClass('fa-times-circle').removeClass('fa-check');
                break;
            case Messages.MessageType.ERROR:
                self.message += self.messagesError.toString().toString().replace(/,/g, '');
                $(self.container + ' > .alert').addClass('alert-danger').removeClass('alert-info').removeClass('alert-warning').removeClass('alert-success');
                $(self.container + ' > .alert > .icon > i').addClass('fa-times-circle').removeClass('fa-info-circle').removeClass('fa-warning').removeClass('fa-check');
                break;
            default:
                break;
        }
        $(self.container + ' > .alert p').html(self.message);
        $(self.container + ' > .alert').fadeIn(1000);

        self.scrollMessage();

        self.clear();
    };


    this.install = function(container) {
        self.container = '#' + container;
        self.uninstall();
        var alert = '';
        alert += '<div class="alert alert-white" style="display:none;">';
        alert += '<p></p>';
        alert += '</div>';
        $(self.container).append(alert);
    };

    this.uninstall = function() {
        $(self.container + ' > .alert').remove();
    };

    this.hide = function() {
        $(self.container + ' > .alert').hide();
    };

    this.count = function() {
        return self.messages.length;
    };
}