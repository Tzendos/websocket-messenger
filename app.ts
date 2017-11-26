import {MessageServer} from "./messenger/messenger";


new MessageServer().run(8585);
console.log('Сервер запущен...');