const NUM_ROWS = 3;
const NUM_COLS = 3;
const EMPTY_TILE_CLASSNAME = "tile" + (NUM_ROWS * NUM_COLS - 1);

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
function swapTileCells(cell1, cell2) {
    var temp = cell1.className;
    cell1.className = cell2.className;
    cell2.className = temp;
}

function swapTiles(row1, col1, row2, col2) {
    var cell1 = getCellElement(row1, col1);
    var cell2 = getCellElement(row2, col2);
    swapTileCells(cell1, cell2);
}

function shuffle() {
    // Use nested loops to access each cell of the grid
    for (var row = 0; row < NUM_ROWS; row++) { // For each row of the grid
        for (var column = 0; column < NUM_COLS; column++) { // For each column in this row

            var row2 = Math.floor(Math.random() * NUM_ROWS); // Pick a random row from 0 to NUM_ROWS
            var column2 = Math.floor(Math.random() * NUM_COLS); // Pick a random column from 0 to NUM_COLS

            swapTiles(row, column, row2, column2); // Swap the look & feel of both cells
        }
    }
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
            swapTileCells(cell1, cell2);
            return;
        }
    }
    // Checking if empty tile on the left
    if (column > 0) {
        var cell2 = getCellElement(row, column - 1);
        if (isTileCellEmpty(cell2)) {
            swapTileCells(cell1, cell2);
            return;
        }
    }
    // Checking if empty tile is above
    if (row > 0) {
        var cell2 = getCellElement(row - 1, column);
        if (isTileCellEmpty(cell2)) {
            swapTileCells(cell1, cell2);
            return;
        }
    }
    // Checking if empty tile is below
    if (row < NUM_ROWS - 1) {
        var cell2 = getCellElement(row + 1, column);
        if (isTileCellEmpty(cell2)) {
            swapTileCells(cell1, cell2);
            return;
        }
    }
}
