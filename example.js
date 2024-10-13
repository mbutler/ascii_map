// readMap.js

const AsciiMap = require('./AsciiMap');

// Read the map from the file
try {
    const map = AsciiMap.readFromFile('ascii_map.txt');
    console.log("Map successfully read from 'ascii_map.txt':\n");
    console.log(map.toString());
    console.log("\n");
    console.log(map)
} catch (error) {
    console.error("Error reading map:", error.message);
}
