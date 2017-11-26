import WebSocket = require("ws");
import {connection} from "../../common/databases/connection";

/**
 * Отправляет пользователю пропущенные им сообщения. (то бишь unread)
 */
export class MissAction implements ActionInterface {

    private eventType;
    private wss: WebSocket.Server;

    constructor(wss: WebSocket.Server) {
        this.eventType = 'miss';
        this.wss = wss;
    }

    async handle(socket, messageObj) {

        if (!socket.isAuth) {
            socket.send(JSON.stringify({
                'typeMessage': messageObj.typeMessage,
                'success': false,
                'message': 'Вы не авторизованы'
            }));
            return;
        }

        if (!socket.hasOwnProperty('user') || !socket['user'].hasOwnProperty('id')) {
            socket.send(JSON.stringify({
                'typeMessage': messageObj.typeMessage,
                'success': false,
                'message': 'Неизвестная ошибка'
            }));
            return;
        }

        let messages = await this.getUnreadMessage(socket.user.id);

        socket.send(
            JSON.stringify({
                'typeMessage': messageObj.typeMessage,
                'success': true,
                'messages': messages
            })
        );
    }

    getUnreadMessage(userId) {
        return new Promise(((resolve, reject) => {
            connection.query(
                'SELECT * FROM `messages` \n' +
                'WHERE messages.user_id = ? AND messages.read = 0',
                [userId],
                function (error, results, fields) {
                    if (error) {
                        console.log('Не удалось получить список непрочитанных сообщений. UserID: ' + userId);
                        reject(error);
                    }

                    resolve(results);
                });
        }));
    }

    getEventType() {
        return this.eventType;
    }
}