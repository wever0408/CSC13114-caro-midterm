const redis = require('../utilities/redis');
const gameUtil = require('../utilities/gameUtil');

module.exports.initGame = (roomID) => {

    const initialRoomState = {
        squares: Array(20).fill(Array(20).fill(null)),
        isXNext: true,
        totalChecked: 0,
        win: false,
        historyMoves: [],
        historySquares: []
    };

    const initialChat = [];

    redis.set('GAME_' + roomID, JSON.stringify(initialRoomState));
    redis.set('MESSAGE_' + roomID, JSON.stringify(initialChat));
};

module.exports.playTurn = (io, data) => {
    return redis.get('GAME_' + data.roomID, (err, raw) => {
        if (!raw || err) {
            console.error('Null Game Data for room: ' + data.roomID);
            io.in(data.roomID).emit('kickRoom', '');
            return;
        }

        const gameState = JSON.parse(raw);

        const currentSymbol = data.isPlayer1 ? 'X' : 'O';
        const elementClicked = {
            key: gameState.totalChecked + 1,
            id: gameState.totalChecked + 1,
            symbol: currentSymbol,
            row: data.i + 1,
            column: data.j + 1
        };

        gameState.historyMoves.push(elementClicked);
        gameState.squares[data.i][data.j] = currentSymbol;
        gameState.historySquares.push(gameState.squares);
        gameState.totalChecked = gameState.totalChecked + 1;
        gameState.isXNext = !gameState.isXNext;

        const checkWin = gameUtil.checkWinCondition(gameState.squares, data.i, data.j);
        if (checkWin) {
            gameState.winArray = checkWin.winArray;
            gameState.winPlayer = currentSymbol;
            gameState.win = true;
        } else {
            gameState.win = false;
        }

        redis.set('GAME_' + data.roomID, JSON.stringify(gameState));
        io.in(data.roomID).emit('newTurn', gameState);
    })
};

module.exports.sendMessage = (io, data) => {
    return redis.get('MESSAGE_' + data.roomID, (err, raw) => {
        if (!raw || err) {
            console.error('Null Message Data for room: ' + data.roomID);
            return;
        }

        const messages = JSON.parse(raw);
        messages.push(data);
        redis.set('MESSAGE_' + data.roomID, JSON.stringify(messages));
        io.in(data.roomID).emit('newMessage', messages);
    })
};

module.exports.handleUndo = (socket, data) => {
    socket.to(data.roomID).emit('otherPlayerRequestUndo', '');
};

module.exports.handleReplyUndoRequest = (io, socket, data) => {
    if (data.answer) {
        return redis.get('GAME_' + data.roomID, (err, raw) => {
            if (!raw || err) {
                console.error('Null Game Data for room: ' + data.roomID);
                return;
            }

            const gameState = JSON.parse(raw);
            let length = gameState.historyMoves.length;

            const currentSymbol = data.isPlayer1 ? 'O' : 'X';
            gameState.historyMoves.pop();
            gameState.historySquares.pop();

            length = gameState.historyMoves.length;
            if (length >= 1 && gameState.historyMoves[length - 1].symbol === currentSymbol) {
                gameState.historySquares.pop();
            }

            length = gameState.historyMoves.length;
            if (length >= 1)
                gameState.squares = gameState.historySquares[length - 1];
            else {
                gameState.squares = Array(20).fill(Array(20).fill(null));
            }
            gameState.totalChecked = length;
            gameState.isXNext = !data.isPlayer1;
            gameState.win = false;

            redis.set('GAME_' + data.roomID, JSON.stringify(gameState));
            io.in(data.roomID).emit('resetTurn', gameState);
        })
    } else {
        socket.to(data.roomID).emit('requestRejected', '');
    }
};

module.exports.handleRequestDraw = (socket, data) => {
    socket.to(data.roomID).emit('otherPlayerRequestDraw', '');
};

module.exports.handleReplyDrawRequest = (io, socket, data) => {
    if (data.answer) {
        const state = {
            totalChecked: 400
        };

        io.in(data.roomID).emit('gameDraw', state);
        redis.del('GAME_' + data.roomID);
    } else {
        socket.to(data.roomID).emit('requestRejected', '');
    }
};

module.exports.handleSurrender = (io, socket, data) => {
    return redis.get('GAME_' + data.roomID, (err, raw) => {
        if (!raw || err) {
            console.error('Null Game Data for room: ' + data.roomID);
            return;
        }
        const gameState = JSON.parse(raw);

        socket.to(data.roomID).emit('otherPlayerSurrender', '');

        gameState.win = true;
        gameState.winPlayer = (data.isPlayer1) ? 'O' : 'X';
        io.in(data.roomID).emit('gameEnded', gameState);

        redis.del('GAME_' + data.roomID);
    })
};