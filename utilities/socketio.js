const sockIO = require('../app').sockIO;
const RoomHandler = require('../realtime/RoomHandler');
const GameHandler = require('../realtime/GameHandler');

sockIO.on('connection', function (socket) {

    socket.on('findPlayer', function (data) {
        RoomHandler.findPlayer(sockIO, socket, data);
    });

    socket.on('leaveRoom', function (data) {
        RoomHandler.kickRoom(sockIO, socket, data);
    });

    socket.on('leaveRoomUnmount', function (data) {
        RoomHandler.leaveRoomUnmount(sockIO, socket, data);
    });

    socket.on('playTurn', function (data) {
        GameHandler.playTurn(sockIO, data);
    });

    socket.on('sendMessage', function (data) {
        GameHandler.sendMessage(sockIO, data);
    });

    socket.on('requestUndo', function (data) {
        GameHandler.handleUndo(socket, data);
    });

    socket.on('replyUndoRequest', function (data) {
        GameHandler.handleReplyUndoRequest(sockIO, socket, data);
    });

    socket.on('requestDraw', function (data) {
        GameHandler.handleRequestDraw(socket, data);
    });

    socket.on('replyDrawRequest', function (data) {
        GameHandler.handleReplyDrawRequest(sockIO, socket, data);
    });

    socket.on('requestSurrender', function (data) {
        GameHandler.handleSurrender(sockIO, socket, data);
    });
});

module.exports = sockIO;