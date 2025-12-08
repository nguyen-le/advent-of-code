import { readFileSync } from "fs";

function determineHighestJolts(input: string, digits: number): string {
  const joltDigits = [];

  let workingArray = input.split('');

  while (joltDigits.length < digits) {
    const windowForNextValue = workingArray.slice(0, workingArray.length - (digits - joltDigits.length) + 1);

    let highestDigit = -1;
    let highestDigitIndex = -1;
    for (let i = 0; i < windowForNextValue.length; i++) {
      const currentDigit = parseInt(windowForNextValue[i]);
      if (currentDigit > highestDigit) {
        highestDigit = currentDigit;
        highestDigitIndex = i;
      }
    }
    workingArray = workingArray.slice(highestDigitIndex + 1);
    joltDigits.push(highestDigit);
  }

  return joltDigits.join('');
}

// read input from file
const input: string[] = readFileSync('day3-input.txt', 'utf-8')
  .trim()
  .split('\n');

const result = [];
for (const line of input) {
  result.push(determineHighestJolts(line, 12));
}

const finalResult = result.reduce((acc, val) => acc + parseInt(val), 0);
console.log(`Final Result: ${finalResult}`);