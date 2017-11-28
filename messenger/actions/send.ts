import WebSocket = require("ws");
import {connection} from "../../common/databases/connection";

export class SendAction implements ActionInterface {

    private eventType;
    private wss: WebSocket.Server;

    constructor(wss: WebSocket.Server) {
        this.eventType = 'send';
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

        let chat = await this.checkChatExists(
            [
                socket.user.id,
                messageObj.to_user_id
            ]
        );

        let chat_id = 0;

        if (chat.length == 1) {
            chat_id = chat[0].id;
        } else {
            chat_id = await this.createChat();

            try {
                await this.addUserInChat(chat_id, socket.user.id);
                await this.addUserInChat(chat_id, messageObj.to_user_id);
            } catch (ex) {
                console.log('Ошибка при добавлении пользователей в чат. ' + ex);
            }
        }

        if (chat_id == 0) {
            socket.send(JSON.stringify({
                'typeMessage': messageObj.typeMessage,
                'success': false,
                'message': 'Чат не был создан'
            }));
            return;
        }

        try {
            // Добавление сообщение в БД
            let messageId = await this.sendMessage(chat_id, socket.user.id, messageObj.message);

            // Отправка сообщения на сокет

            let toSocket = null;

            this.wss.clients.forEach((currentSocket) => {
                if (currentSocket.user.id == messageObj.to_user_id) {
                    toSocket = currentSocket;
                }
            });

            let sentUser = socket.user;

            if (toSocket) {
                console.log(JSON.stringify(toSocket));

                toSocket.send(JSON.stringify({
                    'typeMessage': 'newMessage',
                    'success': true,
                    'sentUser': {
                        'userId': sentUser.id,
                        'username': sentUser.username,
                        'first_name': sentUser.first_name,
                        'second_name': sentUser.second_name,
                        'avatar_link': sentUser.avatar_link
                    },
                    'message': messageObj.message,
                    'created_at': new Date().toISOString().slice(0, 19).replace('T', ' '),
                }));
            }

            socket.send(JSON.stringify({
                'typeMessage': messageObj.typeMessage,
                'success': true,
                'messageId': messageId
            }));
        } catch (ex) {
            console.log('Обработанная ошибка. ' + ex);
        }
    }

    /**
     * Добавляет пользователя в чат
     *
     * @param {number} chatId
     * @param {number} userId
     * @returns {number}
     */
    async addUserInChat(chatId, userId) {
        return new Promise(((resolve, reject) => {
            connection.query(
                'INSERT INTO `user_chats` (`id`, `user_id`, `chat_id`, `created_at`, `updated_at`) VALUES (NULL, \'?\', \'?\', \'' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '\', \'' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '\')',
                [userId, chatId],
                function (errors, result) {
                    if (errors) {
                        reject(errors);
                    }

                    // Возвращаем id пользователя в чате
                    resolve(result.insertId);
                }
            );
        }));
    }

    /**
     * Отправляет сообщение
     *
     * @param {number} chatId
     * @param {number} userId
     * @param {string} message
     * @returns {number}
     */
    async sendMessage(chatId, userId, message) {
        return new Promise(((resolve, reject) => {
            connection.query(
                'INSERT INTO `messages` (`id`, `chat_id`, `user_id`, `to_user_id`, `message`, `read`, `created_at`, `updated_at`) VALUES (NULL, \'?\', \'?\', NULL, ?, \'0\', \'' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '\', \'' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '\')',
                [chatId, userId, message],
                function (errors, result, fields) {
                    if (errors) {
                        reject(errors);
                    }

                    // Возвращаем id нового сообщения
                    resolve(result.insertId);
                }
            );
        }));
    }

    /**
     * Создает чат
     *
     * @returns {number}
     */
    async createChat() {
        return new Promise(((resolve, reject) => {
            connection.query(
                'INSERT INTO `chats` (`id`, `title`, `PM`, `created_at`, `updated_at`) VALUES (NULL, \'Title\', \'1\', \'' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '\', \'' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '\')',
                function (errors, result) {
                    if (errors) {
                        reject(errors);
                    }

                    // Возвращаем id созданного чата
                    resolve(result.insertId);
                }
            );
        }));
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
                        reject(error);
                    }

                    //Возвращаем id найденного чата
                    resolve(results);
                });
        });
    }

    getEventType() {
        return this.eventType;
    }
}