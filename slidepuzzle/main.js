const NUM_ROWS = 3;
const NUM_COLS = 3;

function swapTiles(cell1, cell2) {
    var temp = document.getElementById(cell1).className;
    document.getElementById(cell1).className = document.getElementById(cell2).className;
    document.getElementById(cell2).className = temp;
}

function shuffle() {
    // Use nested loops to access each cell of the grid
    for (var row = 0; row < NUM_ROWS; row++) { // For each row of the grid
        for (var column = 0; column < NUM_COLS; column++) { // For each column in this row

            var row2 = Math.floor(Math.random() * NUM_ROWS); // Pick a random row from 0 to NUM_ROWS
            var column2 = Math.floor(Math.random() * NUM_COLS); // Pick a random column from 0 to NUM_COLS

            swapTiles("cell" + row + column, "cell" + row2 + column2); // Swap the look & feel of both cells
        }
    }
}

function clickTile(row, column) {
    var cell = document.getElementById("cell" + row + column);
    var tile = cell.className;
    if (tile != "tile8") {
        // Checking if white tile on the right
        if (column < NUM_COLS - 1) {
            if (document.getElementById("cell" + row + (column + 1)).className == "tile8") {
                swapTiles("cell" + row + column, "cell" + row + (column + 1));
                return;
            }
        }
        // Checking if white tile on the left
        if (column > 0) {
            if (document.getElementById("cell" + row + (column - 1)).className == "tile8") {
                swapTiles("cell" + row + column, "cell" + row + (column - 1));
                return;
            }
        }
        // Checking if white tile is above
        if (row > 0) {
            if (document.getElementById("cell" + (row - 1) + column).className == "tile8") {
                swapTiles("cell" + row + column, "cell" + (row - 1) + column);
                return;
            }
        }
        // Checking if white tile is below
        if (row < NUM_ROWS - 1) {
            if (document.getElementById("cell" + (row + 1) + column).className == "tile8") {
                swapTiles("cell" + row + column, "cell" + (row + 1) + column);
                return;
            }
        }
    }
}
