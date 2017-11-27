import WebSocket = require("ws");
import {checkToken} from "../auth";

export class AuthAction implements ActionInterface {

    private eventType;
    private wss: WebSocket.Server;

    constructor(wss: WebSocket.Server) {
        this.eventType = 'auth';
        this.wss = wss;
    }

    async handle(socket, messageObj) {

        if (socket.isAuth) {
            socket.send(JSON.stringify({
                'typeMessage': this.getEventType(),
                'success': false,
                'message': 'Вы уже авторизованы'
            }));
        }

        if (!messageObj.hasOwnProperty('token')) {
            socket.send(JSON.stringify({
                'typeMessage': this.getEventType(),
                'success': false,
                'message': 'Не указан токен пользователя'
            }));
        }

        let token = messageObj['token'];

        try {
            let user = await checkToken(token);

            if (user) {
                socket.isAuth = true;
                socket.user = user;
                socket.send(JSON.stringify({'typeMessage': messageObj.typeMessage, 'success': true}));
            } else {
                socket.send(JSON.stringify({
                    'typeMessage': messageObj.typeMessage,
                    'success': false,
                    'message': 'Ошибка авторизации. Возможно неверный токен'
                }));
            }
        } catch (ex) {
            console.log('Обработанная ошибка. ' + ex);
        }
    }

    getEventType() {
        return this.eventType;
    }
}