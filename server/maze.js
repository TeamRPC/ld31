// create empty map of tiles
// while interior is not done
//     choose random x, y coord inside where the border will be
//     make the random coord a walkway
//     choose a random direction (rD)
//     assume path is not clear
//     while path is not clear
//         we'll create a new walkway tile (cX, cY) 2 spaces over in direction rD
//         is cX,cY not on a border tile?
//             is cX,cY not already a walkway tile?
//                 create cX,cY as a walkway tile
//                 create walkway tile between cX,cY and x,y
//
//                 

// Thank you http://www.roguebasin.com/index.php?title=Simple_maze for blowing my mind

var levelColumns = 27;
var levelRows = 18;
var level = [];
var randomDir;
var tilesDone = 0;
var x;
var y;
var cX;
var cY;
var row;
var col;
var attempt;
var deadEndFound;

var up =    [0, -1];
var down =  [0, 1];
var left =  [-1, 0];
var right = [1, 0];

var creationDirection = [[0, 0], [0, 0], [0, 0], [0, 0]];



var maze = {
    generate: function() {
        // create empty level
        for (row = 0; row <= levelRows; row += 1) {
            // create columns
            level[row] = [];

            for (col = 0; col <= levelColumns; col += 1) {
                // create 0s in all tiles
                level[row][col] = 0;
            }
        }


        //console.log(JSON.stringify(level));
        //while (tilesDone + 1 < ((levelRows - 1) * (levelColumns - 1)) / 4) {
        //while (tilesDone + 1 < (((levelRows - 1) * 2) * ((levelColumns - 1) * 2) / 4)) {
        //while (tilesDone + 1 < ((levelRows * levelColumns) - ((levelRows - 1) * 2) + ((levelColumns - 1) * 2))) {
        // i cant figure this^ out but there's not much time left. Hard code! :(
        while((tilesDone + 1) < 100) {

            // chose random tile inside border
            x = 2 + Math.floor(Math.random() * (levelRows - 1));
            if (x % 2 !== 0) { x -= 1; }

            y = 2 + Math.floor(Math.random() * (levelColumns - 1));
            if (y % 2 !== 0) { y -= 1; }

            //console.log('random chosen tile: (' + x + ', ' + y + ')');

            // if this is the first tile, designate it the start point
            if (tilesDone === 0) { level[x][y] = 1; }

            // if this tile is already walkway, pick a random set of directions
            if (level[x][y] === 1) {
                randomDir = Math.floor(Math.random() * 4);

                switch (randomDir) {
                case 0:
                    creationDirection = [up, down, left, right];
                    break;
                case 1:
                    creationDirection = [right, up, down, left];
                    break;
                case 2:
                    creationDirection = [left, right, up, down];
                    break;
                case 3:
                    creationDirection = [down, left, right, up];
                    break;
                }

                // make a path until we come to a dead end
                pathBlocked = 1;
                while (pathBlocked == 1) {

                    pathBlocked += 1; // assume a dead end is found, unless a path is found in the loop below.

                    // look 2 spaces ahead to find a suitable tile to use for our path.
                    // if the first direction we look isn't suitable, try the next direction.
                    // suitable tiles are not a border tile, and not already a path.
                    for (attempt = 0; attempt <= 3; attempt += 1) {
                        cX = x + creationDirection[attempt][0] * 2;
                        cY = y + creationDirection[attempt][1] * 2;
                        //console.log('attempt: ' + attempt);

                        if (cX < levelRows && cY < levelColumns && cX > 1 && cY > 1) {
                            if (level[cX][cY] !== 1) {

                                level[cX][cY] = 1; // create new walkway at suitable destination tile (it's 2 tiles away from current)
                                level[x][y] = 1;   // create new walkway at current tile
                                level[x + creationDirection[attempt][0]][y + creationDirection[attempt][1]] = 1; // create walkway on inbetween tile 
                                x = cX; // set destination location to current
                                y = cY; // set destination location to current

                                tilesDone += 1;   // increment the # of tiles we've touched
                                attempt = 4;      // stop attempting to find suitable tile
                                pathBlocked = 0; // we were able to place a pathway so it must not be a dead end
                            }
                        }
                    }
                }
            }
        }
        return level;
    //    console.log('tiles done: ' + tilesDone);
    //    console.log(JSON.stringify(level));
    }
}

module.exports = maze;