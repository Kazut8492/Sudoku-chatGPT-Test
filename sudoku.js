
const puzzle = [
    [0,0,0,0,0,0,0,0,9],
    [0,0,0,0,0,0,0,8,0],
    [0,0,0,0,0,0,7,0,0],
    [0,0,0,0,0,6,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
];

const board = document.getElementById("board");

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (puzzle[i][j] !== 0) {
            cell.textContent = puzzle[i][j];
            cell.classList.add("given");
        } else {
            cell.addEventListener("click", () => selectCell(i, j));
        }

        board.appendChild(cell);
    }
}

let selectedCell = null;

function selectCell(row, col) {
    if (selectedCell !== null) selectedCell.classList.remove("selected");

    selectedCell = board.children[row * 9 + col];
    selectedCell.classList.add("selected");

    highlightCells(row, col);
}

function highlightCells(row, col) {
    const cells = document.getElementsByClassName("cell");

    for (let i = 0; i < cells.length; i++) cells[i].classList.remove("highlight");

    for (let i = 0; i < 9; i++) {
        const cell = cells[row * 9 + i];
        cell.classList.add("highlight");
        cells[i * 9 + col].classList.add("highlight");
        cells[Math.floor(row / 3) * 27 + Math.floor(col / 3) * 3 + i % 3 + Math.floor(i / 3) * 9].classList.add("highlight");
    }
}

document.addEventListener("keydown", (event) => {
    if (selectedCell !== null && !selectedCell.classList.contains("given")) {
        const key = event.key;

        if (/^[1-9]$/.test(key)) {
            selectedCell.textContent = key;
            checkBoard();
        } else if (key === "Backspace" || key === "Delete") {
            selectedCell.textContent = "";
            checkBoard();
        }
    }
});

function checkBoard() {
    const cells = document.getElementsByClassName("cell");

    for (let i = 0; i < 9; i++) {
        const row = [], col = [], sub = [];

        for (let j = 0; j < 9; j++) {
            row.push(cells[i * 9 + j].textContent);
            col.push(cells[j * 9 + i].textContent);

            const subRowIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            const subColIndex = (i % 3) * 3 + (j % 3);
            sub.push(cells[subRowIndex * 9 + subColIndex].textContent);
        }

        if (!checkArray(row) || !checkArray(col) || !checkArray(sub)) {
            return false;
        }
    }

    return true;
}


function checkArray(array) {
    return [...Array(10).keys()].slice(1).every(num => array.includes(num.toString()));
}

function showError() {
    alert("Invalid solution!");
}

function showSuccess() {
    alert("Congratulations, you solved the puzzle!");
}




function solve() {
    const cells = document.getElementsByClassName("cell");

    if (!checkBoard()) {
        alert("Invalid puzzle, cannot be solved!");
        return;
    }

    if (isSolved()) {
        alert("Puzzle already solved!");
        return;
    }

    solveRecursive(cells, 0);
}

function solveRecursive(cells, index) {
    if (index >= cells.length) return true;

    const cell = cells[index];

    if (cell.classList.contains("given")) {
        return solveRecursive(cells, index + 1);
    }

    for (let i = 1; i <= 9; i++) {
        if (isValid(cell, i.toString())) {
            cell.textContent = i.toString();

            if (solveRecursive(cells, index + 1)) {
                return true;
            }
        }
    }

    cell.textContent = "";
    return false;
}

function isSolved() {
    const cells = document.getElementsByClassName("cell");

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === "") return false;
    }

    return checkBoard();
}

function isValid(cell, value) {
    const cells = document.getElementsByClassName("cell");
    const row = [], col = [], sub = [];

    const index = Array.prototype.indexOf.call(cells, cell);
    const rowNumber = Math.floor(index / 9);
    const colNumber = index % 9;
    const subRow = Math.floor(rowNumber / 3);
    const subCol = Math.floor(colNumber / 3);

    for (let i = 0; i < 9; i++) {
        row.push(cells[rowNumber * 9 + i].textContent);
        col.push(cells[i * 9 + colNumber].textContent);
        sub.push(cells[(subRow * 3 + Math.floor(i / 3)) * 9 + subCol * 3 + i % 3].textContent);
    }

    return checkArray(row.concat(col, sub).filter(num => num !== value));
}

function checkBoard() {
    const cells = document.getElementsByClassName("cell");

    for (let i = 0; i < 9; i++) {
        const row = [], col = [], sub = [];

        for (let j = 0; j < 9; j++) {
            row.push(cells[i * 9 + j].textContent);
            col.push(cells[j * 9 + i].textContent);

            const subRowIndex = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            const subColIndex = (i % 3) * 3 + (j % 3);
            sub.push(cells[subRowIndex * 9 + subColIndex].textContent);
        }

        if (!checkArray(row) || !checkArray(col) || !checkArray(sub)) {
            return false;
        }
    }

    return true;
}

function checkArray(array) {
    return [...Array(10).keys()].slice(1).every(num => array.includes(num.toString()));
}

function reset() {
    const cells = document.getElementsByClassName("cell");

    // Clear all cell values and remove any highlights or selections
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = "";
        cells[i].classList.remove("selected", "highlight");
    }

    // Reset the selected cell
    selectedCell = null;
}
