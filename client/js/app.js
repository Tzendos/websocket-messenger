let ws = new WebSocket('ws://localhost:8585');

// Без bearer. Bearer подставляется автоматически
let token = '';

/**
 * Callback на отрытие сокета
 */
ws.onopen = function () {
    console.log('Сокет готов к работе!');
};

/**
 * handler хранит в себе объекты типа key => value,
 * где key в данном случае это названия события, а value это callback на ответ от сервера
 * @type {{}}
 */
let handler = {};

/**
 * Callback на прием всех сообщений
 * @param evt
 */
ws.onmessage = function (evt) {
    let received_msg = JSON.parse(evt.data);
    /**
     * Достаем нужный handler по ключу из переменной typeMessage и сразу же вызываем callback с (received_msg.success, received_msg.message, received_msg)
     */
    handler[received_msg.typeMessage](received_msg.success, received_msg.message, received_msg);
};


/**
 * Handler на авторизацию
 * @param {boolean} success
 * @param message
 * @param body
 */
handler['auth'] = (success, message, body = null) => {
    if (!success) {
        console.log('Описание ошибки: ' + message);
    }

    console.log('Успешная авторизация');
};

/**
 * Handler на получение списка чатов
 * @param {boolean} success
 * @param message
 * @param body
 */
handler['chats'] = (success, message, body = null) => {
    if (!success) {
        console.log('Описание ошибки: ' + message);
    }

    console.log('Получили список чатов!');
    console.log('Вот сам список:');
    console.log(body);
};

/**
 * Handler на получение сообщений пользователя
 * @param {boolean} success
 * @param message
 * @param body
 */
handler['receive'] = (success, message, body = null) => {
    if (!success) {
        console.log('Описание ошибки: ' + message);
    }

    console.log('Получены сообщения!');
    console.log('Содержимое: ');
    console.log(body);
};

/**
 * Handler срабатывающий после отправки сообщение. Сервер оповещает о успешной отправки и позволяет получить проверочный messageId
 * @param success
 * @param message
 * @param body
 */
handler['send'] = (success, message, body = null) => {
    if (!success) {
        console.log('Описание ошибки: ' + message);
    }

    console.log('Отправлено сообщение!');
    console.log('Содержимое: ');
    console.log(body);
};

/**
 * Получаем от пользователей новые сообщения!
 *
 * @param success
 * @param message
 * @param body
 */
handler['newMessage'] = (success, message, body = null) => {
    if (!success) {
        console.log('Описание ошибки: ' + message);
    }

    console.log('Получено новое сообщение!');
    console.log('Содержимое: ');
    console.log(body);
};

/**
 * Отправить сообщение пользователю с определенным Id. 2 - это для примера
 * @param text
 * @param toUserId
 */
function sendExampleMessage(text, toUserId) {
    /**
     * Отправить сообщение пользователю с ID - toUserId
     */
    ws.send(JSON.stringify({
        'token': token,
        'typeMessage': 'send',
        'message': text,
        'to_user_id': toUserId
    }));

    console.log('Send done');
}

/**
 * Получить список сообщений от пользователя с определенным Id
 * @param userId
 */
function receiveExampleMessage(userId) {
    /**
     * Принять ВСЕ сообщения от пользователя с ID - userId
     */
    ws.send(JSON.stringify({
        'typeMessage': 'receive',
        'token': token,
        'userId': 2,
    }));

    console.log('Receive done');
}

/**
 * Авторизует по токену
 *
 * @param token
 */
function authExample(token) {
    ws.send(JSON.stringify({
        'typeMessage': 'auth',
        'token': token
    }));

    console.log('Попытак авторизоваться');
}

/**
 * Получить список чатов текущего пользователя
 */
function chatsExample() {
    ws.send(JSON.stringify({
        'typeMessage': 'chats',
        'token': token
    }));
}