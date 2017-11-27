import WebSocket = require("ws");
import {connection} from "../../common/databases/connection";

export class ChatsAction implements ActionInterface {

    private eventType;
    private wss: WebSocket.Server;

    constructor(wss: WebSocket.Server) {
        this.eventType = 'chats';
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

        try {
            let chats = await this.getChats(socket.user.id);

            for (let i = 0; i < chats.length; i++) {
                let users = await this.getUsersFromChat(chats[i].id, socket.user.id);
                chats[i]['users'] = users;
            }

            socket.send(
                JSON.stringify({
                    'typeMessage': messageObj.typeMessage,
                    'success': true,
                    'chats': chats
                })
            );

        } catch (ex) {
            console.log('Обработанная ошибка. ' + ex);
        }
    }

    /**
     *
     * @param  {number} chatId
     * @param {number} currentUserId
     * @returns {Promise<any>}
     */
    async getUsersFromChat(chatId: number, currentUserId: number) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT users.id, users.first_name, users.second_name, users.avatar_link FROM chats\n' +
                'LEFT JOIN user_chats on user_chats.chat_id = chats.id\n' +
                'LEFT JOIN users on users.id = user_chats.user_id\n' +
                'WHERE chats.id = ? AND users.id <> ?',
                [chatId, currentUserId],
                function (error, results, fields) {
                    if (error) {
                        console.log('Не удалось получить список пользователей в чатах. UserID: ' + currentUserId + '; ChatID: ' + chatId);
                        reject(error);
                    }

                    resolve(results);
                });
        });
    }

    async getChats(userId) {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT chats.id, chats.PM FROM user_chats\n' +
                'LEFT JOIN chats on chats.id = user_chats.chat_id\n' +
                'WHERE user_chats.user_id = ?',
                [userId],
                function (error, results, fields) {
                    if (error) {
                        console.log('Не удалось получить список чатов пользователя. UserID: ' + userId);
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