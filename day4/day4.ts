import { readFileSync } from "fs";

function formShelf(input: string[]) {
  const shelf = [];
  for (let row = 0; row < input.length; row++) {
    shelf.push(input[row].split(''));
  }

  return shelf;
};

function countRollsInRow(row: string[], colIndexes: number[]) {
  let count = 0;
  for (const colIndex of colIndexes) {
    if (row[colIndex] === '@') {
      count++ ;
    }
  }

  return count;
}

function countRemoveableRolls(shelf: string[][], shouldRemoveRolls = false) {
  let removeableRolls = 0;
  const rollsToRemove: [number, number][] = [];

  for (let row = 0; row < shelf.length; row++) {
    for (let col = 0; col < shelf[row].length; col++) {
      if (shelf[row][col] === '@') {
        let adjacentCount = 0;

        const aboveRow = shelf[row - 1];
        if (aboveRow) {
          adjacentCount += countRollsInRow(aboveRow, [col - 1, col, col + 1]);
        }
        
        const currentRow = shelf[row];
        adjacentCount += countRollsInRow(currentRow, [col - 1, col + 1]);

        const belowRow = shelf[row + 1];
        if (belowRow) {
          adjacentCount += countRollsInRow(belowRow, [col - 1, col, col + 1]);
        }

        if (adjacentCount < 4) {
          rollsToRemove.push([row, col]);
          removeableRolls++;
        }
      }
    }
  }

  if (shouldRemoveRolls) {
    for (const [row, col] of rollsToRemove) {
      shelf[row][col] = '.';
    }
  }

  return removeableRolls;
}

// read input from file
const input: string[] = readFileSync('day4-input.txt', 'utf-8')
  .trim()
  .split('\n');

let shelf = formShelf(input);
let finalResult = 0;
while (true) {
  const removeableRolls = countRemoveableRolls(shelf, true);
  finalResult += removeableRolls;
  if (removeableRolls === 0) {
    break;
  }
}
console.log(`Final Result: ${finalResult}`);
