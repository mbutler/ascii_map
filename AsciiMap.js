// AsciiMap.js

const fs = require('fs');

class AsciiMap {
    /**
     * Creates an instance of AsciiMap.
     * @param {number} drawableWidth - The width of the drawable area (number of columns).
     * @param {number} drawableHeight - The height of the drawable area (number of rows).
     */
    constructor(drawableWidth, drawableHeight) {
        if (!Number.isInteger(drawableWidth) || !Number.isInteger(drawableHeight)) {
            throw new Error("Drawable width and height must be integers.");
        }

        if (drawableWidth < 1 || drawableHeight < 1) {
            throw new Error("Drawable width and height must be at least 1.");
        }

        this.drawableWidth = drawableWidth;
        this.drawableHeight = drawableHeight;

        // Total dimensions include borders
        this.width = drawableWidth + 2;
        this.height = drawableHeight + 2;

        // Initialize the 2D map with spaces and borders
        this.map = [];
        for (let row = 0; row < this.height; row++) {
            let currentRow = [];
            for (let col = 0; col < this.width; col++) {
                // Set borders
                if (row === 0 || row === this.height - 1) {
                    currentRow.push('-');
                } else if (col === 0 || col === this.width - 1) {
                    currentRow.push('|');
                } else {
                    currentRow.push(' ');
                }
            }
            this.map.push(currentRow);
        }
    }

    /**
     * Places a character at the specified (x, y) coordinates.
     * @param {number} x - The x-coordinate (column index, 0-based).
     * @param {number} y - The y-coordinate (row index, 0-based).
     * @param {string} char - The ASCII character to place.
     */
    place(x, y, char) {
        if (typeof char !== 'string' || char.length !== 1) {
            throw new Error("Only single ASCII characters are allowed.");
        }

        // Validate coordinates
        if (
            !Number.isInteger(x) || !Number.isInteger(y) ||
            x < 0 || x >= this.drawableWidth ||
            y < 0 || y >= this.drawableHeight
        ) {
            throw new Error(
                `Coordinates out of bounds. Provided (x, y): (${x}, ${y}). Valid ranges - x: 0 to ${this.drawableWidth - 1}, y: 0 to ${this.drawableHeight - 1}.`
            );
        }

        // Adjust coordinates to account for borders
        const mapX = x + 1;
        const mapY = y + 1;

        this.map[mapY][mapX] = char;
    }

    /**
     * Moves a character from one set of coordinates to another.
     * @param {number} startX - The starting x-coordinate (column index, 0-based).
     * @param {number} startY - The starting y-coordinate (row index, 0-based).
     * @param {number} endX - The ending x-coordinate (column index, 0-based).
     * @param {number} endY - The ending y-coordinate (row index, 0-based).
     */
    move(startX, startY, endX, endY) {
        // Validate starting coordinates
        if (
            !Number.isInteger(startX) || !Number.isInteger(startY) ||
            startX < 0 || startX >= this.drawableWidth ||
            startY < 0 || startY >= this.drawableHeight
        ) {
            throw new Error(
                `Starting coordinates out of bounds. Provided (x, y): (${startX}, ${startY}). Valid ranges - x: 0 to ${this.drawableWidth - 1}, y: 0 to ${this.drawableHeight - 1}.`
            );
        }

        // Validate ending coordinates
        if (
            !Number.isInteger(endX) || !Number.isInteger(endY) ||
            endX < 0 || endX >= this.drawableWidth ||
            endY < 0 || endY >= this.drawableHeight
        ) {
            throw new Error(
                `Ending coordinates out of bounds. Provided (x, y): (${endX}, ${endY}). Valid ranges - x: 0 to ${this.drawableWidth - 1}, y: 0 to ${this.drawableHeight - 1}.`
            );
        }

        // Adjust coordinates to account for borders
        const mapStartX = startX + 1;
        const mapStartY = startY + 1;
        const mapEndX = endX + 1;
        const mapEndY = endY + 1;

        const charToMove = this.map[mapStartY][mapStartX];

        if (charToMove === ' ') {
            throw new Error(`No character to move at starting coordinates (${startX}, ${startY}).`);
        }

        // Move the character
        this.map[mapStartY][mapStartX] = ' ';
        this.map[mapEndY][mapEndX] = charToMove;
    }

    /**
     * Places a character at a random position.
     * @param {string} char - The ASCII character to place.
     */
    placeRandom(char) {
        const x = Math.floor(Math.random() * this.drawableWidth);
        const y = Math.floor(Math.random() * this.drawableHeight);
        this.place(x, y, char);
    }

    /**
     * Generates the string representation of the ASCII map.
     * @returns {string} The ASCII map as a string with proper newlines.
     */
    toString() {
        return this.map.map(row => row.join('')).join('\n');
    }

    /**
     * Writes the ASCII map to a specified file path using Node.js fs module.
     * @param {string} filePath - The path to the file where the map will be written.
     */
    writeToFile(filePath) {
        fs.writeFileSync(filePath, this.toString(), 'utf8');
    }

    /**
     * Deletes a character at the specified (x, y) coordinates by placing a space.
     * @param {number} x - The x-coordinate (column index, 0-based).
     * @param {number} y - The y-coordinate (row index, 0-based).
     */
    delete(x, y) {
        this.place(x, y, ' ');
    }

    /**
     * Clears all characters from the drawable area, resetting to spaces.
     */
    clear() {
        for (let row = 1; row < this.height - 1; row++) {
            for (let col = 1; col < this.width - 1; col++) {
                this.map[row][col] = ' ';
            }
        }
    }

    /**
     * Places multiple characters on the map.
     * @param {Array} placements - An array of placement objects with x, y, and char properties.
     */
    placeMultiple(placements) {
        placements.forEach(({ x, y, char }) => {
            this.place(x, y, char);
        });
    }

    /**
     * Reads an ASCII map from a file and returns an AsciiMap instance.
     * @param {string} filePath - The path to the ASCII map file.
     * @returns {AsciiMap} A new AsciiMap instance representing the map from the file.
     */
    static readFromFile(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const lines = data.trim().split(/\r?\n/);
            const height = lines.length;

            if (height < 3) {
                throw new Error("Map must have at least 3 lines (including borders).");
            }

            const width = lines[0].length;

            if (width < 3) {
                throw new Error("Map must have at least 3 characters per line (including borders).");
            }

            // Ensure all lines have the same length
            for (let i = 0; i < height; i++) {
                if (lines[i].length !== width) {
                    throw new Error(`Line ${i + 1} length (${lines[i].length}) does not match expected width (${width}).`);
                }
            }

            // Verify top and bottom borders consist only of '-'
            const borderLine = '-'.repeat(width);
            if (lines[0] !== borderLine || lines[height - 1] !== borderLine) {
                throw new Error("Top and bottom borders must consist only of '-' characters.");
            }

            // Verify side borders consist only of '|'
            for (let i = 1; i < height - 1; i++) {
                if (lines[i][0] !== '|' || lines[i][width - 1] !== '|') {
                    throw new Error(`Line ${i + 1} side borders must consist only of '|' characters.`);
                }
            }

            // Initialize AsciiMap with drawable dimensions
            const drawableWidth = width - 2;
            const drawableHeight = height - 2;
            const mapInstance = new AsciiMap(drawableWidth, drawableHeight);

            // Populate the internal map with characters from the file
            for (let y = 0; y < drawableHeight; y++) {
                const line = lines[y + 1];
                for (let x = 0; x < drawableWidth; x++) {
                    const char = line[x + 1];
                    mapInstance.map[y + 1][x + 1] = char;
                }
            }

            return mapInstance;
        } catch (err) {
            throw new Error(`Failed to read from file: ${err.message}`);
        }
    }
}

module.exports = AsciiMap;
