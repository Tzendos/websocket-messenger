interface ActionInterface {
    handle(socket, messageObj);

    getEventType();
}