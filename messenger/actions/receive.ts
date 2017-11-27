import WebSocket = require("ws");
import {connection} from "../../common/databases/connection";

export class ReceiveAction implements ActionInterface {

    private eventType;
    private wss: WebSocket.Server;

    constructor(wss: WebSocket.Server) {
        this.eventType = 'receive';
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

        let isChatExists = await this.checkChatExists([socket.user.id, messageObj.userId]);

        if (isChatExists.length == 1) {
            let messages = await this.getMessageFromChat(isChatExists[0].id);

            socket.send(JSON.stringify({
                'typeMessage': messageObj.typeMessage,
                'success': true,
                'messages': messages
            }));
        } else {
            socket.send(JSON.stringify({
                'typeMessage': messageObj.typeMessage,
                'success': true,
                'message': []
            }));
        }
    }

    /**
     * Получаем все сообщения из чата
     *
     * @param {number} chatId
     * @returns {Promise<any>}
     */
    async getMessageFromChat(chatId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT users.id as userId, users.username, users.first_name, users.second_name, users.avatar_link, messages.* FROM messages\n' +
                'LEFT JOIN users on users.id = messages.user_id\n' +
                'WHERE messages.chat_id = ?\n' +
                'ORDER BY `id` ASC',
                [chatId],
                function (error, results, fields) {
                    if (error) {
                        console.log('Не удалось получить сообщения из чата');
                        reject(error);
                    }

                    resolve(results);
                });
        });
    }

    /**
     * Проверяем, есть ли чат у данных пользователей
     *
     * @param {[]} users
     * @returns {Promise<any>}
     */
    async checkChatExists(users) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT chats.id FROM chats\n' +
                'LEFT JOIN user_chats on user_chats.chat_id = chats.id\n' +
                'LEFT JOIN user_chats as user_chats2 on user_chats2.chat_id = chats.id\n' +
                'WHERE user_chats.user_id = ? AND user_chats2.user_id = ?',
                [users[0], users[1]],
                function (error, results, fields) {
                    if (error) {
                        // console.log('Не удалось получить список пользователей в чатах. UserID: ' + currentUserId + '; ChatID: ' + chatId);
                        reject(error);
                    }

                    resolve(results);
                });
        });
    }

    getEventType() {
        return this.eventType;
    }
}