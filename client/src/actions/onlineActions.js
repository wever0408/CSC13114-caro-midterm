import {ActionConstant} from "../utils/constants";

export const joinNewGame = (room) => {
    return {
        type: ActionConstant.JOIN_NEW_GAME,
        room
    }
};

export const leaveRoom = () => {
    return {
        type: ActionConstant.LEAVE_ROOM,
    }
};

export const onNewTurnPlayed = (data) => {
    return {
        type: ActionConstant.NEW_TURN_PLAYED,
        data
    }
};

export const onNewMessage = (messages) => {
    return {
        type: ActionConstant.NEW_MESSAGE,
        messages
    }
};

export const onGameEnded = (data) => {
    return {
        type: ActionConstant.GAME_ENDED,
        data
    }
};

export const onGameDraw = (data) => {
    return {
        type: ActionConstant.GAME_DRAW,
        data
    }
};