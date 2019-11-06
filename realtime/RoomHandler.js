const redis = require('../utilities/redis');const GameHandler = require('./GameHandler');

module.exports.findPlayer = (io, socket, data) => {
    if (!data) {
        console.error('Null Player Object');
        return;
    }

    return redis.get("ROOM", (err, rawRoom) => {

        if (rawRoom) {
            let roomEntity = JSON.parse(rawRoom);

            if (io.sockets.connected[roomEntity.socketID] == null ||
                !io.sockets.connected[roomEntity.socketID].connected) {

                const roomID = new Date().getTime();
                const newRoom = {
                    roomID: roomID,
                    player1: data,
                    socketID: socket.id
                };

                socket.join(roomID);
                roomEntity = newRoom;
            }

            socket.join(roomEntity.roomID);

            socket.to(roomEntity.roomID).emit('newGame', {
                roomID: roomEntity.roomID,
                player1: roomEntity.player1,
                player2: data,
                isPlayer1: true
            });

            socket.emit('newGame', {
                roomID: roomEntity.roomID,
                player1: roomEntity.player1,
                player2: data,
                isPlayer1: false
            });

            redis.del("ROOM");

            GameHandler.initGame(roomEntity.roomID);
        } else {
            const roomID = new Date().getTime();
            const newRoom = {
                roomID: roomID,
                player1: data,
                socketID: socket.id
            };

            socket.join(roomID);
            redis.set("ROOM", JSON.stringify(newRoom));
        }
    })
};

module.exports.kickRoom = (io, socket, data) => {
    socket.leave(data, null);
    socket.to(data).emit('kickRoom', '');
};

module.exports.leaveRoomUnmount = (io, socket, data) => {
    socket.leave(data, null);
};