const NUM_ROWS = 3;
const NUM_COLS = 3;
const EMPTY_TILE_NUMBER = NUM_ROWS * NUM_COLS - 1;
const EMPTY_TILE_CLASSNAME = "tile" + EMPTY_TILE_NUMBER;
const FINAL_TILE_CLASSNAME = "tile" + (NUM_ROWS * NUM_COLS);

function setCompletedText(text) {
    var element = document.getElementById("puzzleComplete");
    element.innerText = text;
}

function swapStyleSheet(cssFile) {
    document.getElementById("pagestyle").setAttribute("href", cssFile);
}

// Returns the document element for the specified cell
function getCellElement(row, column) {
    var cellId = "cell" + row + column;
    return document.getElementById(cellId);
}

// Parameter is a document element as returned by getCellElement()
function isTileCellEmpty(cell) {
    return cell.className == EMPTY_TILE_CLASSNAME;
}

// Parameters are document elements as returned by getCellElement()
function swapTiles(cell1, cell2) {
    var temp = cell1.className;
    cell1.className = cell2.className;
    cell2.className = temp;
}

function isPuzzleSolved() {
    for (var row = 0; row < NUM_ROWS; row++) {
        for (var col = 0; col < NUM_COLS; col++) {
            if (getCellElement(row, col).className != "tile" + (row * NUM_COLS + col)) {
                return false;
            }
        }
    }
    return true;
}

function checkAndMarkPuzzleSolved() {
    if (!isPuzzleSolved()) {
        return;
    }
    // Replace the empty tile with the "final" tile
    getCellElement(NUM_ROWS - 1, NUM_COLS - 1).className = FINAL_TILE_CLASSNAME;
    setCompletedText("Complete!");
}

function makeNewPuzzle() {
    // Starting condition of the puzzle, cells 0..8 contain tiles 0..8
    // Cell index: upper left = 0, lower right = 8
    var tileNums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Which cell contains the empty tile initially
    var emptyCell = 8;
    // Cells that are adjacent to any cell, i.e. cells 1 & 3 are adjacent to cell 0
    // Adjacent cells can be swapped with the empty cell to make a valid move
    var adjacentCells =
        [
            [1, 3], // 0
            [0, 4, 2], // 1
            [1, 5], // 2
            [0, 4, 6], // 3
            [1, 3, 5, 7], // 4
            [2, 4, 8], // 5
            [3, 7], // 6
            [6, 4, 8], // 7
            [5, 7] // 8
        ];

    for (var t = 0; t < 300; t++) {
        // First pick a cell to move the empty cell to
        var adjacentRow = adjacentCells[emptyCell];
        var random = Math.floor(Math.random() * adjacentRow.length);
        var cellToMove = adjacentRow[random];

        // Move the tile # in cellToMove to emptyCell
        tileNums[emptyCell] = tileNums[cellToMove];
        // Make cellToMove the empty tile #
        tileNums[cellToMove] = EMPTY_TILE_NUMBER;
        emptyCell = cellToMove;
    }

    // Set all of the cells to the tile #s we just randomly moved
    for (var row = 0; row < NUM_ROWS; row++) {
        for (var col = 0; col < NUM_COLS; col++) {
            getCellElement(row, col).className = "tile" + tileNums[row * NUM_COLS + col];
        }
    }

    // Puzzle is no longer complete
    setCompletedText("");
}

function clickTile(row, column) {
    var cell1 = getCellElement(row, column);
    if (isTileCellEmpty(cell1)) {
        // Clicked on the empty tile, just return
        return;
    }

    // Checking if empty tile on the right
    if (column < NUM_COLS - 1) {
        var cell2 = getCellElement(row, column + 1);
        if (isTileCellEmpty(cell2)) {
            swapTiles(cell1, cell2);
            checkAndMarkPuzzleSolved();
            return;
        }
    }
    // Checking if empty tile on the left
    if (column > 0) {
        var cell2 = getCellElement(row, column - 1);
        if (isTileCellEmpty(cell2)) {
            swapTiles(cell1, cell2);
            checkAndMarkPuzzleSolved();
            return;
        }
    }
    // Checking if empty tile is above
    if (row > 0) {
        var cell2 = getCellElement(row - 1, column);
        if (isTileCellEmpty(cell2)) {
            swapTiles(cell1, cell2);
            checkAndMarkPuzzleSolved();
            return;
        }
    }
    // Checking if empty tile is below
    if (row < NUM_ROWS - 1) {
        var cell2 = getCellElement(row + 1, column);
        if (isTileCellEmpty(cell2)) {
            swapTiles(cell1, cell2);
            checkAndMarkPuzzleSolved();
            return;
        }
    }
}
