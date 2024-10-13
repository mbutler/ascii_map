// example.js

const AsciiMap = require('./AsciiMap');

// Create a drawable map of width 20 and height 10
// Total map dimensions will be 22x12 (including borders)
const map = new AsciiMap(80, 40);

// Define multiple placements
const placements = [
    { x: 0, y: 0, char: 'A' },   // Top-left corner
    { x: 19, y: 0, char: 'B' },  // Top-right corner
    { x: 0, y: 9, char: 'C' },   // Bottom-left corner
    { x: 19, y: 9, char: 'D' },  // Bottom-right corner
    { x: 10, y: 5, char: 'E' },  // Center
    { x: 5, y: 2, char: 'F' },   // Additional character
    { x: 15, y: 7, char: 'ʆ' }   // Another character
];

// Place multiple characters on the map
map.placeMultiple(placements);

// Display the initial map
console.log("Initial Map:");
console.log(map.toString());

/*
Initial Output:
----------------------
|A                 B|
|                    |
|     F              |
|                    |
|                    |
|          E         |
|                    |
|               G    |
|                    |
|C                 D|
----------------------
*/

// Move character 'E' from (10,5) to (10,4)
try {
    map.move(10, 5, 10, 4);
    console.log("\nMoved 'E' from (10,5) to (10,4).");
} catch (error) {
    console.error(error.message);
}

// Delete character 'F' at (5,2)
try {
    map.delete(5, 2);
    console.log("Deleted character at (5,2).");
} catch (error) {
    console.error(error.message);
}

// Attempt to move a non-existent character from (8,8) to (9,9)
try {
    map.move(8, 8, 9, 9);
} catch (error) {
    console.error("\n" + error.message);
}

// Place multiple new characters
const newPlacements = [
    { x: 3, y: 3, char: 'H' },
    { x: 7, y: 6, char: 'I' },
    { x: 12, y: 8, char: 'J' }
];

map.placeMultiple(newPlacements);
console.log("\nPlaced new characters using placeMultiple.");
map.placeRandom('ɵ');

// Display the updated map
console.log("\nUpdated Map:");
console.log(map.toString());

// Optionally, write the updated map to a file
map.writeToFile('ascii_map_updated.txt');
