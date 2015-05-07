var Messages = (function() {
    var MessageType = {
        SUCCESS: {value: 0, description: 'Succès'},
        INFO: {value: 1, description: 'Info'},
        WARNING: {value: 2, description: 'Alert'},
        ERROR: {value: 3, description: 'Error'}
    };

    var RESTful = {
        SERVER_COMMUNICATION_ERROR: {value: 0, description: 'Ocorreu um erro de comunicação com o servidor.', type: MessageType.ERROR}
    };

    var Login = {        
        LOGIN_SUCCESS: {value: 0, description: 'Vous êtes bien connecté, <b>%s</b>', type: MessageType.SUCCESS}        
    };

    var Register = {
        REGISTER_SUCCESS: {value: 0, description: 'Bienvenu(e) à WeLyon <b>%s</b>!', type: MessageType.SUCCESS}
    };

    var Navigator = {
        WEB_STORAGE_ERROR: {value: 0, description: 'WebStorage n\'est pas supporté par votre navigateur, il ne sera pas possible de se connecter', type: MessageType.ERROR}
    };

    var Point = {
        NEW_POINT_INFO:  {value: 0, description: '<b>Choisir l\'emplacement sur la carte</b>', type: MessageType.INFO},
        NEW_POINT_SUCCESS: {value: 1, description: 'Le point <b>%s</b> a bien était crée', type: MessageType.SUCCESS},
        NEW_EVENT_SUCCESS: {value: 2, description: 'L\'évenement <b>%s</b> a bien était crée', type: MessageType.SUCCESS},
        NEW_PLACE_SUCCESS: {value: 3, description: 'Le lieu <b>%s</b> a bien était crée', type: MessageType.SUCCESS}
    };

//TODO: prevoir les messages
    var Validator = {
        INVALID_O: {value: 0, description: "O %s é inválido.", type: MessageType.ERROR},
        INVALID_A: {value: 1, description: "A %s é inválida.", type: MessageType.ERROR},
        REQUIRED_O: {value: 2, description: "O %s é requirido e não pode ser vazio.", type: MessageType.ERROR},
        REQUIRED_A: {value: 3, description: "A %s é requirida e não pode ser vazia.", type: MessageType.ERROR},
        LENGTH_ERROR_O: {value: 4, description: "O %s deve conter ao menos %s caractere e no máximo %s.", type: MessageType.ERROR},
        LENGTH_ERROR_A: {value: 5, description: "A %s deve conter ao menos %s caractere e no máximo %s.", type: MessageType.ERROR},
        VALIDATION_ERROR: {value: 6, description: "Verifique os campos em destaque.", type: MessageType.ERROR},
        INVALID_URL: {value: 7, description: "A URL é inválida", type: MessageType.ERROR},
        INVALID_IMAGE: {value: 8, description: "Somente é permitido selecionar imagens.", type: MessageType.ERROR}
    };

    return {
        Point: Point,
        MessageType: MessageType,
        RESTful: RESTful,
        Validator: Validator,
        Login: Login,
        Register: Register
    };

})();