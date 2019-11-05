//const sockIO = require('../server').sockIO;
const sockIO = require('socket.io')();
const RoomHandler = require('../realtime/RoomHandler');


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

});

module.exports = sockIO;