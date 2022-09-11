const NUM_ROWS = 3;
const NUM_COLS = 3;
const EMPTY_TILE_NUMBER = NUM_ROWS * NUM_COLS;
const EMPTY_TILE_CLASSNAME = "tile" + EMPTY_TILE_NUMBER;

// When the puzzle is "scrambled", this will keep track of which cell was initially empty
var initialEmptyCellIndex = -1;

function setSolvedText(text) {
    var element = document.getElementById("puzzleSolved");
    element.innerText = text;
}

// Switch the style sheet that defines the active puzzle
function swapStyleSheet(cssFile) {
    document.getElementById("pagestyle").setAttribute("href", cssFile);
}

// Returns the document element for the specified cell
function getCellElement(row, column) {
    var cellId = "cell" + row + column;
    return document.getElementById(cellId);
}

// Parameter is a document element as returned by getCellElement()
function isCellEmptyTile(cell) {
    return cell.className == EMPTY_TILE_CLASSNAME;
}

// Parameter is the (integer) tile number
function makeTileClassName(tileNum) {
    return "tile" + tileNum;
}

// See if the puzzle is solved, checks that each cell has the correct tile class name
function isPuzzleSolved() {
    for (var row = 0; row < NUM_ROWS; row++) {
        for (var col = 0; col < NUM_COLS; col++) {
            var cell = getCellElement(row, col);
            // Cell is solved if it is the empty tile OR it is the expected tile
            if (!isCellEmptyTile(cell) && cell.className != makeTileClassName(row * NUM_COLS + col)) {
                return false;
            }
        }
    }
    return true;
}

// Helper function to update the display when the puzzle is solved
function checkAndMarkPuzzleSolved() {
    if (!isPuzzleSolved()) {
        return;
    }
    // Replace the initial empty cell with its tile
    var row = Math.floor(initialEmptyCellIndex / NUM_COLS);
    var col = initialEmptyCellIndex % NUM_COLS;
    getCellElement(row, col).className = makeTileClassName(initialEmptyCellIndex);
    setSolvedText("Solved!");
}

// Check if 'possiblyEmptyCell' is empty
//   if empty move 'cell' to it, check if puzzle is solved, return true
//   if not empty (not a valid move), return false
// Parameters are document elements as returned by getCellElement()
function moveTileIfValid(cell, possiblyEmptyCell) {
    if (!isCellEmptyTile(possiblyEmptyCell)) {
        // Not a valid move
        return false;
    }
    // Move them
    possiblyEmptyCell.className = cell.className;
    cell.className = EMPTY_TILE_CLASSNAME;
    checkAndMarkPuzzleSolved();
    return true;
}

function clickTile(row, column) {
    var cell1 = getCellElement(row, column);
    if (isCellEmptyTile(cell1)) {
        // Clicked on the empty tile, just return
        return;
    }

    // Checking if empty tile on the right
    if (column < NUM_COLS - 1) {
        var cell2 = getCellElement(row, column + 1);
        if (moveTileIfValid(cell1, cell2)) {
            return;
        }
    }
    // Checking if empty tile on the left
    if (column > 0) {
        var cell2 = getCellElement(row, column - 1);
        if (moveTileIfValid(cell1, cell2)) {
            return;
        }
    }
    // Checking if empty tile is above
    if (row > 0) {
        var cell2 = getCellElement(row - 1, column);
        if (moveTileIfValid(cell1, cell2)) {
            return;
        }
    }
    // Checking if empty tile is below
    if (row < NUM_ROWS - 1) {
        var cell2 = getCellElement(row + 1, column);
        if (moveTileIfValid(cell1, cell2)) {
            return;
        }
    }
}

// Make an array of length n, initialized to 0..n-1
function makeSequentialArray(n) {
    var val = 0;
    return Array.from({ length: n }, () => val++);
}

function makeNewPuzzle() {
    // Starting condition of the puzzle, contains tiles 0..n
    // Indexed by cells: upper left = 0, lower right = n-1
    var tileNums = makeSequentialArray(NUM_ROWS * NUM_COLS);

    // Which cell index contains the empty tile initially
    initialEmptyCellIndex = NUM_ROWS * NUM_COLS - 1; // Lower right (last cell)
    var emptyCellIndex = initialEmptyCellIndex;
    tileNums[emptyCellIndex] = EMPTY_TILE_NUMBER;

    // Cell indexs that are adjacent to any cell, i.e. cell indexs 1 & 3 are adjacent to cell index 0
    // Adjacent cell indexs can be swapped with the empty cell index to make a valid move
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

    // Scramble the puzzle by randomly moving the cell with the empty tile to an adjacent cell 300 times
    for (var t = 0; t < 300; t++) {
        // First pick an adjacent cell index to move the empty tile to
        var adjacentRow = adjacentCells[emptyCellIndex];
        var random = Math.floor(Math.random() * adjacentRow.length);
        var cellIndexToMove = adjacentRow[random];

        // Move the tile # in cellIndexToMove to emptyCellIndex
        tileNums[emptyCellIndex] = tileNums[cellIndexToMove];
        // Make cellIndexToMove the empty tile #
        tileNums[cellIndexToMove] = EMPTY_TILE_NUMBER;
        emptyCellIndex = cellIndexToMove;
    }

    // Set all of the cells to the tile #s we just randomly moved
    for (var row = 0; row < NUM_ROWS; row++) {
        for (var col = 0; col < NUM_COLS; col++) {
            getCellElement(row, col).className = makeTileClassName(tileNums[row * NUM_COLS + col]);
        }
    }

    // Puzzle is no longer solved
    setSolvedText("");
}
