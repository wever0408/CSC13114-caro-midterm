const NO_OF_ROW = 20;
const NO_OF_COL = 20;

const NUM_TO_WIN = 5;

function highlight(arr, currentSymbol) {
    let color = null;
    if (currentSymbol === "X")
        color = "#fd4138";
    else
        color = "#000000";

    for (let i = 0; i < arr.length; i++) {
        const key = `${arr[i].row}_${arr[i].col}`;
        document.getElementById(key).style.backgroundColor = color;
    }
}

function resetColor() {
    const cells = document.getElementsByClassName('square');

    for (let i = 0; i < cells.length; i++)
        cells[i].style.backgroundColor = '#eff1bc';
}

function checkWinCondition(squares, i, j) {

    const currentSymbol = squares[i][j];

    function checkRow() {
        let res = 0;
        let curr = 0;
        let endIndex = 0;

        for (let col = 0; col < NO_OF_COL; col++) {
            if (squares[i][col] === currentSymbol) {
                curr++;
            } else {
                curr = 0;
            }

            if (curr > res) {
                res = curr;
                endIndex = col;
            }
        }

        if (res >= NUM_TO_WIN) {
            let startIndex = endIndex;
            const row = squares[i];
            const winArr = [];
            while (row[startIndex] === currentSymbol) {
                startIndex--;

                if (startIndex < 0) break;
            }

            startIndex++;

            for (let winInd = startIndex; winInd <= endIndex; winInd++) {
                winArr.push({row: i, col: winInd});
            }

            // at start or end square
            if (startIndex === 0 || endIndex === NO_OF_COL - 1)
                return winArr;

            // empty next square
            if (row[startIndex - 1] == null || row[endIndex + 1] == null)
                return winArr;

            // block head & tail
            if (row[startIndex - 1] === row[endIndex + 1] && row[startIndex - 1] !== currentSymbol)
                return null;

            return winArr;
        }

        return null;
    }

    function checkColumn() {
        let res = 0;
        let curr = 0;
        let endIndex = 0;
        for (let row = 0; row < NO_OF_ROW; row++) {
            if (squares[row][j] === currentSymbol) {
                curr++;
            } else {
                curr = 0;
            }

            if (curr > res) {
                res = curr;
                endIndex = row;
            }
        }

        if (res >= NUM_TO_WIN) {
            let startIndex = endIndex;
            const winArr = [];

            while (squares[startIndex][j] === currentSymbol) {
                startIndex--;

                if (startIndex < 0)
                    break;
            }

            startIndex++;

            for (let winInd = startIndex; winInd <= endIndex; winInd++) {
                winArr.push({row: winInd, col: j});
            }

            // at start or end square
            if (startIndex === 0 || endIndex === NO_OF_ROW - 1)
                return winArr;

            // empty next square
            if (squares[startIndex - 1][j] == null || squares[endIndex + 1][j] == null)
                return winArr;

            // block head & tail
            if (squares[startIndex - 1][j] === squares[endIndex + 1][j] && squares[startIndex - 1][j] !== currentSymbol)
                return null;

            return winArr;
        }

        return null;
    }

    function checkDiag() {
        let res = 0;
        let curr = 0;

        let row = i;
        let col = j;

        while (row > 0 && col > 0) {
            row--;
            col--;
        }

        let endIndex = [row, col];

        while (row < NO_OF_ROW && col < NO_OF_COL) {
            if (squares[row][col] === currentSymbol) {
                curr++;
            } else {
                curr = 0;
            }

            if (curr > res) {
                res = curr;
                endIndex = [row, col];
            }
            row++;
            col++;
        }

        if (res >= NUM_TO_WIN) {
            const winArr = [];
            const startIndex = [...endIndex];

            while (squares[startIndex[0]][startIndex[1]] === currentSymbol) {
                startIndex[0]--;
                startIndex[1]--;

                if (startIndex[0] < 0 || startIndex[1] < 0)
                    break;
            }
            startIndex[0]++;
            startIndex[1]++;

            for (let winInd = startIndex[0], winInd2 = startIndex[1];
                 winInd <= endIndex[0] && winInd2 <= endIndex[1];
                 winInd++ && winInd2++) {
                winArr.push({row: winInd, col: winInd2})
            }

            // at start or end square
            if (startIndex[0] === 0 || startIndex[1] === 0 || endIndex[0] === NO_OF_ROW - 1 || endIndex[1] === NO_OF_ROW - 1)
                return winArr;

            // empty next square
            if (squares[startIndex[0] - 1][startIndex[1] - 1] == null || squares[endIndex[0] + 1][endIndex[1] + 1] == null)
                return winArr;

            // block head & tail
            if (squares[startIndex[0] - 1][startIndex[1] - 1] === squares[endIndex[0] + 1][endIndex[1] + 1]
                && squares[startIndex[0] - 1][startIndex[1] - 1] !== currentSymbol)
                return null;

            return winArr;
        }

        return null;
    }

    function checkAntiDiag() {
        let res = 0;
        let curr = 0;

        let row = i;
        let col = j;

        while (row > 0 && col < NO_OF_COL - 1) {
            row--;
            col++;
        }

        let endIndex = [row, col];

        while (row < NO_OF_ROW && col >= 0) {
            if (squares[row][col] === currentSymbol) {
                curr++;
            } else {
                curr = 0;
            }

            if (curr > res) {
                res = curr;
                endIndex = [row, col];
            }
            row++;
            col--;
        }

        if (res >= NUM_TO_WIN) {
            const winArr = [];
            const startIndex = [...endIndex];

            while (squares[startIndex[0]][startIndex[1]] === currentSymbol) {
                startIndex[0]--;
                startIndex[1]++;

                if (startIndex[0] < 0 || startIndex[1] === NO_OF_COL)
                    break;
            }
            startIndex[0]++;
            startIndex[1]--;

            for (let winInd = startIndex[0], winInd2 = startIndex[1];
                 winInd <= endIndex[0] && winInd2 >= endIndex[1];
                 winInd++ && winInd2--) {
                winArr.push({row: winInd, col: winInd2})
            }

            // at start or end square
            if (startIndex[0] === 0 || startIndex[1] === NO_OF_COL - 1 ||
                endIndex[0] === NO_OF_ROW - 1 || endIndex[1] === 0)
                return winArr;

            // empty next square
            if (squares[startIndex[0] - 1][startIndex[1] + 1] == null || squares[endIndex[0] + 1][endIndex[1] - 1] == null)
                return winArr;

            // block head & tail
            if (squares[startIndex[0] - 1][startIndex[1] + 1] === squares[endIndex[0] + 1][endIndex[1] - 1]
                && squares[startIndex[0] - 1][startIndex[1] + 1] !== currentSymbol)
                return null;

            return winArr;
        }

        return null;
    }

    const nRow = checkRow();
    if (nRow != null) {
        highlight(nRow, currentSymbol);
        return currentSymbol;
    }

    const nCol = checkColumn();
    if (nCol != null) {
        highlight(nCol, currentSymbol);
        return currentSymbol;
    }

    const nDiag = checkDiag();
    if (nDiag != null) {
        highlight(nDiag, currentSymbol);
        return currentSymbol;
    }

    const nAntiDiag = checkAntiDiag();
    if (nAntiDiag != null) {
        highlight(nAntiDiag, currentSymbol);
        return currentSymbol;
    }

    return null;
}

function isBoardFull(totalChecked) {
    return totalChecked >= NO_OF_ROW * NO_OF_COL;
}

export {checkWinCondition, resetColor, isBoardFull, highlight};