import { readFileSync } from "fs";

class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  static mergeRanges(ranges: Range[]): Range[] {
    let i = 0;
    while (i < ranges.length) {
      let hasMerged = false;
      for (let j = i + 1; j < ranges.length; j++) {
        if (ranges[i].overlapsWith(ranges[j])) {
          const mergedRange = ranges[i].mergeWith(ranges[j]);
          ranges.splice(j, 1);
          ranges[i] = mergedRange;
          hasMerged = true;
          break;
        }
      }
      if (!hasMerged) {
        i++;
      }
    }
    return ranges;
  }

  overlapsWith(other: Range): boolean {
    return this.start <= other.end && other.start <= this.end;
  }

  mergeWith(other: Range): Range {
    return new Range(Math.min(this.start, other.start), Math.max(this.end, other.end));
  }
}

function parseInput (input: string[]) {
  const freshIngredientRanges: Range[] = [];
  const ingredients = [];

  let parsingFreshIngredients = true;
  for (const line of input) {
    if (line.trim() === '') {
      parsingFreshIngredients = false;
      continue;
    }

    if (parsingFreshIngredients) {
      const [start, end] = line.split('-').map(num => parseInt(num));
      const newRange = new Range(start, end);
      freshIngredientRanges.push(newRange);
    } else {
      const ingredientId = parseInt(line);
      for (const range of freshIngredientRanges) {
        if (ingredientId >= range.start && ingredientId <= range.end) {
          ingredients.push(ingredientId);
          break;
        }
      }
    }
  }
  return { freshIngredientRanges, ingredients };
}

// read input from file
const input: string[] = readFileSync('input.txt', 'utf-8')
  .trim()
  .split('\n');

const result = parseInput(input);
const mergedRanges = Range.mergeRanges(result.freshIngredientRanges);
console.log('Number of merged good ingredient IDs:', mergedRanges.reduce((acc, val) => acc + (val.end - val.start + 1), 0));
console.log(`Final Result: ${result.ingredients.length}`);