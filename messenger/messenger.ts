import * as WebServer from 'ws';
import * as auth from './auth';
import {ChatsAction} from "./actions/chats";
import {ReceiveAction} from "./actions/receive";
import {MissAction} from "./actions/miss";
import {SendAction} from "./actions/send";
import {AuthAction} from "./actions/auth";

export class MessageServer {

    protected wss: WebServer.Server;

    private actions = {};

    async run(port: number) {

        this.wss = new WebServer.Server({port: port});
        this.registerActions(this.wss);

        this.wss.on('connection', function connection(socket) {

            socket.isAuth = false;

            socket.on('message', function incoming(message: string) {
                try {
                    let messageObj = JSON.parse(message);

                    if (this.actions[messageObj.typeMessage] != null)
                        this.actions[messageObj.typeMessage](socket, messageObj);
                    else {
                        socket.send({'error': 'Неверный тип сообщения'});
                    }
                } catch (ex) {
                    console.log('Обработанная ошибка. ' + ex);
                }
            }.bind(this));
        }.bind(this));
    }

    registerActions(ws) {

        let authAction = new AuthAction(this.wss);
        this.actions[authAction.getEventType()] = authAction.handle
            .bind(authAction);

        let chatsAction = new ChatsAction(this.wss);
        this.actions[chatsAction.getEventType()] = chatsAction.handle
            .bind(chatsAction);

        let missAction = new MissAction(this.wss);
        this.actions[missAction.getEventType()] = missAction.handle
            .bind(missAction);

        let receiveAction = new ReceiveAction(this.wss);
        this.actions[receiveAction.getEventType()] = receiveAction.handle
            .bind(receiveAction);

        let sendAction = new SendAction(this.wss);
        this.actions[sendAction.getEventType()] = sendAction.handle
            .bind(sendAction);
    }
}