import {ActionConstant} from "../utils/constants";

const initialState = {
    squares: Array(20).fill(Array(20).fill(null)),
    historyMoves: [],
    roomID: '',
    otherPlayer: {},
    mySymbol: '',
    isMyTurn: true,
    isPlayer1: true,
    totalChecked: 0,
    win: false,
    winPlayer: '',
    messages: []
};

export default function onlineReducer(state = initialState, action) {

    switch (action.type) {

        case ActionConstant.JOIN_NEW_GAME:
            return {
                ...state,
                roomID: action.room.roomID,
                otherPlayer: (action.room.isPlayer1) ? action.room.player2 : action.room.player1,
                mySymbol: action.room.isPlayer1 ? "X" : "O",
                isMyTurn: action.room.isPlayer1,
                isPlayer1: action.room.isPlayer1
            };

        case ActionConstant.NEW_TURN_PLAYED:
            return {
                ...state,
                squares: action.data.squares,
                historyMoves: action.data.historyMoves,
                totalChecked: action.data.totalChecked,
                isMyTurn: (action.data.isXNext && state.mySymbol === 'X') ||
                    (!action.data.isXNext && state.mySymbol === 'O'),
                win: action.data.win,
                winPlayer: action.data.winPlayer,
            };

        case ActionConstant.GAME_DRAW:
            return {
                ...state,
                totalChecked: action.data.totalChecked
            };

        case ActionConstant.GAME_ENDED:
            return {
                ...state,
                win: action.data.win,
                winPlayer: action.data.winPlayer,
            };

        case ActionConstant.NEW_MESSAGE:
            return {
                ...state,
                messages: action.messages
            };

        case ActionConstant.LEAVE_ROOM:
            return initialState;

        default :
            return state;
    }
}