var Messages = (function() {
    var MessageType = {
        SUCCESS: {value: 0, description: 'Sucesso'},
        INFO: {value: 1, description: 'Informação'},
        WARNING: {value: 2, description: 'Alerta'},
        ERROR: {value: 3, description: 'Erro'}
    };

    var RESTful = {
        SERVER_COMMUNICATION_ERROR: {value: 0, description: 'Un problème de connexion au serveur est surevenue.', type: MessageType.ERROR}
    };

    var Login = {
        INVALID_CREDENTIALS: {value: 0, description: "L'authentification à échoué.<br><b>Erreur: </b>Informations invalides.", type: MessageType.ERROR},
        LOGIN_ERROR: {value: 1, description: "Il n'a pas été possible de vous authentifier.<br><b>Motivo: </b>%s", type: MessageType.ERROR}
    };

    var ApplicationProvider = {
        LIST_LINKED_ERROR: {value: 0, description: 'Não foi possível carregar a lista de configução dos providers terceiros vinculados a este aplicativo.<br><b>Motivo: </b> %s.', type: MessageType.ERROR},
        LIST_UNLINKED_ERROR: {value: 1, description: 'Não foi possível carregar a lista dos providers terceiros para possivel vinculação.<br><b>Motivo: </b> %s.', type: MessageType.ERROR},
        DELETE_SUCCESS: {value: 2, description: 'O provider <b>%s</b> foi excluido com sucesso. <a href="#" id="rollback" title="rollback"> Desfazer</a>', type: MessageType.SUCCESS},
        DELETE_ERROR: {value: 3, description: 'Não foi possível excluir o provider <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        INSERT_SUCCESS: {value: 4, description: 'O provider <b>%s</b> foi adicionado com sucesso.', type: MessageType.SUCCESS},
        INSERT_ERROR: {value: 5, description: 'Não foi possível adicionar o provider <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        UPDATE_SUCCESS: {value: 6, description: 'O provider <b>%s</b> foi editado com sucesso.', type: MessageType.SUCCESS},
        UPDATE_ERROR: {value: 7, description: 'Não foi possível editar o provider <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        UNDO_SUCCESS: {value: 8, description: 'A deleção do provider <b>%s</b> foi desfeita com sucesso.', type: MessageType.SUCCESS},
        UNDO_ERROR: {value: 9, description: 'Não foi possível desfazer a deleção do provider <b>%s</b>.<br> <b>Motivo:</b> %s ', type: MessageType.ERROR}
    };

    var Provider = {
        LIST_ERROR: {value: 0, description: 'Não foi possível carregar a lista de providers.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        EDIT_ERROR: {value: 1, description: 'Não foi possível abrir edição do provider <b>%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UPDATE_ERROR: {value: 2, description: 'Não foi possível salvar as alterações do provider <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UPDATE_SUCCESS: {value: 3, description: 'O provider <b>%s</b> foi alterado com sucesso.', type: MessageType.SUCCESS},
        ACTIVATE_SUCCESS: {value: 4, description: 'O provider <b>%s</b> foi ativado com sucesso.', type: MessageType.SUCCESS},
        ACTIVATE_ERROR: {value: 5, description: 'Não foi possível ativar o provider <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        DEACTIVATE_SUCCESS: {value: 6, description: 'O provider <b>%s</b> foi desativado com sucesso.', type: MessageType.SUCCESS},
        DEACTIVATE_ERROR: {value: 7, description: 'Não foi possível desativar o provider <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR}
    };

    var SystemLog = {
        LIST_ERROR: {value: 0, description: 'Não foi possível carregar a lista de logs.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        GET_ERROR: {value: 1, description: 'Não foi possível carregar o log <b>%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UNDO_ERROR: {value: 2, description: 'Não foi possível desfazer o log <b>#%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UNDO_SUCCESS: {value: 3, description: 'O log <b>#%s</b> foi desfeito com sucesso.', type: MessageType.SUCCESS},
        MORE_FILTER_ERROR: {value: 4, description: 'Não foi possível carregar os filtros adicionais', type: MessageType.ERROR},
        LIST_USERS_ERROR: {value: 5, description: 'Não foi possível carregar os logs de <b>usuários</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        LIST_PROVIDERS_ERROR: {value: 6, description: 'Não foi possível carregar os logs de <b>providers</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        LIST_APPLICATIONS_ERROR: {value: 7, description: 'Não foi possível carregar os logs de <b>aplicativos</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR}
    };

    var Register = {
        REGISTER_ERROR: {value: 15, description: 'Não foi possível efetuar o cadastro.<br> <b>Motivo: </b>%s', type: MessageType.ERROR}
    };

    var Validator = {
        INVALID_Le: {value: 0, description: "Le %s est invalide.", type: MessageType.ERROR},
        INVALID_La: {value: 1, description: "La %s est invalide.", type: MessageType.ERROR},
        REQUIRED_O: {value: 2, description: "Le %s est requis et ne peut être vide.", type: MessageType.ERROR},
        REQUIRED_A: {value: 3, description: "La %s est requis et ne peut être vide.", type: MessageType.ERROR},
        LENGTH_ERROR_O: {value: 4, description: "Le %s doit contenir au minimum %s caractère et au maximym %s.", type: MessageType.ERROR},
        LENGTH_ERROR_A: {value: 5, description: "La %s doit contenir au minimum %s caractère et au maximym %s", type: MessageType.ERROR},
        VALIDATION_ERROR: {value: 6, description: "Verifique os campos em destaque.", type: MessageType.ERROR},
        INVALID_URL: {value: 7, description: "A URL é inválida", type: MessageType.ERROR},
        INVALID_IMAGE: {value: 8, description: "Somente é permitido selecionar imagens.", type: MessageType.ERROR}
    };

    var Application = {
        LIST_ERROR: {value: 0, description: 'Não foi possível carregar a lista de aplicativos.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        GET_ERROR: {value: 1, description: 'Não foi possível carregar o aplicativo <b>%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        OPEN_EDIT_ERROR: {value: 2, description: 'Não foi possível abrir a edição do aplicativo <b>%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        OPEN_CONFIG_ERROR: {value: 3, description: 'Não foi possível abrir as configurações do aplicativo <b>%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UPDATE_ERROR: {value: 4, description: 'Não foi possível salvar as alterações  do aplicativo <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UPDATE_SUCCESS: {value: 5, description: 'O aplicativo <b>%s</b> foi alterado com sucesso.', type: MessageType.SUCCESS},
        ACTIVATE_SUCCESS: {value: 6, description: 'O aplicativo <b>%s</b> foi ativado com sucesso.', type: MessageType.SUCCESS},
        ACTIVATE_ERROR: {value: 7, description: 'Não foi possível ativar o aplicativo <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        DEACTIVATE_SUCCESS: {value: 8, description: 'O aplicativo <b>%s</b> foi desativado com sucesso.', type: MessageType.SUCCESS},
        DEACTIVATE_ERROR: {value: 9, description: 'Não foi possível desativar o aplicativo <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        INSERT_SUCCESS: {value: 10, description: 'O aplicativo <b>%s</b> foi adicionado com sucesso.', type: MessageType.SUCCESS},
        INSERT_ERROR: {value: 11, description: 'Não foi possível adicionar o aplicativo <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        CONFIG_SUCCESS: {value: 12, description: 'O aplicativo <b>%s</b> foi configurado com sucesso.', type: MessageType.SUCCESS},
        CONFIG_ERROR: {value: 13, description: 'Não foi possível configurar o aplicativo <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        DELETE_SUCCESS: {value: 14, description: 'O aplicativo <b>%s</b> foi deletado com sucesso.  <a href="#" id="rollback" title="rollback"> Desfazer</a>', type: MessageType.SUCCESS},
        DELETE_ERROR: {value: 15, description: 'Não foi possível deletar o aplicativo <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        LINK_SUCCESS: {value: 16, description: 'O usuário <b>%s</b> foi vinculado com sucesso.', type: MessageType.SUCCESS},
        LINK_ERROR: {value: 17, description: 'Não foi possível vincular o usuário <b>%s</b>.<br> <b>Motivo:</b> %s ', type: MessageType.ERROR},
        UNLINK_SUCCESS: {value: 18, description: 'O usuário <b>%s</b> foi desvinculado com sucesso.', type: MessageType.SUCCESS},
        UNLINK_ERROR: {value: 19, description: 'Não foi possível desvincular o usuário <b>%s</b>.<br> <b>Motivo:</b> %s', type: MessageType.ERROR},
        LINK_ALL_SUCCESS: {value: 20, description: 'Todos os usuários foram vinculados com sucesso.', type: MessageType.SUCCESS},
        UNLINK_ALL_SUCCESS: {value: 21, description: 'Todos os usuários foram desvinculados com sucesso.', type: MessageType.SUCCESS},
        UNDO_SUCCESS: {value: 22, description: 'A deleção do aplicativo <b>%s</b> foi desfeita com sucesso.', type: MessageType.SUCCESS},
        UNDO_ERROR: {value: 23, description: 'Não foi possível desfazer a deleção do aplicativo <b>%s</b>.<br> <b>Motivo:</b> %s ', type: MessageType.ERROR}
    };

    var User = {
        LIST_ERROR: {value: 0, description: 'Não foi possível carregar a lista de usuários.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        GET_ERROR: {value: 1, description: 'Não foi possível carregar o usuário <b>%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        OPEN_EDIT_ERROR: {value: 2, description: 'Não foi possível abrir a edição do usuário <b>%s</b>.<br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UPDATE_ERROR: {value: 3, description: 'Não foi possível salvar as alterações  do usuário <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        UPDATE_SUCCESS: {value: 4, description: 'O usuário <b>%s</b> foi alterado com sucesso.', type: MessageType.SUCCESS},
        ACTIVATE_SUCCESS: {value: 5, description: 'O usuário <b>%s</b> foi ativado com sucesso.', type: MessageType.SUCCESS},
        ACTIVATE_ERROR: {value: 6, description: 'Não foi possível ativar o usuário <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        DEACTIVATE_SUCCESS: {value: 7, description: 'O usuário <b>%s</b> foi desativado com sucesso.', type: MessageType.SUCCESS},
        DEACTIVATE_ERROR: {value: 8, description: 'Não foi possível desativar o usuário <b>%s</b><br><b>Motivo: </b>%s', type: MessageType.ERROR},
        INSERT_SUCCESS: {value: 9, description: 'O usuário <b>%s</b> foi adicionado com sucesso.', type: MessageType.SUCCESS},
        INSERT_ERROR: {value: 10, description: 'Não foi possível adicionar o usuário <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        DELETE_SUCCESS: {value: 11, description: 'O usuário <b>%s</b> foi deletado com sucesso. <a href="#" id="rollback" title="rollback"> Desfazer</a>', type: MessageType.SUCCESS},
        DELETE_ERROR: {value: 12, description: 'Não foi possível deletar o usuário <b>%s</b><br> <b>Motivo: </b>%s', type: MessageType.ERROR},
        LINK_SUCCESS: {value: 13, description: 'O aplicativo <b>%s</b> foi vinculado com sucesso.', type: MessageType.SUCCESS},
        LINK_ERROR: {value: 14, description: 'Não foi possível vincular o aplicativo <b>%s</b>.<br> <b>Motivo:</b> %s ', type: MessageType.ERROR},
        UNLINK_SUCCESS: {value: 15, description: 'O aplicativo <b>%s</b> foi desvinculado com sucesso.', type: MessageType.SUCCESS},
        UNLINK_ERROR: {value: 16, description: 'Não foi possível desvincular o aplicativo <b>%s</b>.<br> <b>Motivo:</b> %s', type: MessageType.ERROR},
        UNDO_SUCCESS: {value: 17, description: 'A deleção do usuário <b>%s</b> foi desfeita com sucesso.', type: MessageType.SUCCESS},
        UNDO_ERROR: {value: 18, description: 'Não foi possível desfazer a deleção do usuário <b>%s</b>.<br> <b>Motivo:</b> %s ', type: MessageType.ERROR},
        LINK_ALL_SUCCESS: {value: 20, description: 'Todos os aplicativos foram vinculados com sucesso.', type: MessageType.SUCCESS},
        UNLINK_ALL_SUCCESS: {value: 21, description: 'Todos os aplicativos foram desvinculados com sucesso.', type: MessageType.SUCCESS},
        TOKEN_ERROR: {value: 22, description: 'O token de usuário informado é invalido.', type: MessageType.ERROR},
        CHANGE_PASSWORD_ERROR: {value: 23, description: 'Não foi possível alterar a senha. Motivo: <b>Senha atual inválida.</b>', type: MessageType.ERROR}
    };

    return {
        MessageType: MessageType,
        RESTful: RESTful,
        Login: Login,
        ApplicationProvider: ApplicationProvider,
        Validator: Validator,
        Provider: Provider,
        SystemLog: SystemLog,
        Application: Application,
        User: User,
        Register: Register
    };

})();