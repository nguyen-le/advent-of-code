import { uniq } from "lodash";
import { readFileSync } from "fs";

const finalResult: string[] = [];

const splitIntervalsByMagnitude = (start: string, end: string): [string, string][] => {
  if (start.length === end.length) {
    return [[start, end]];
  }
  
  // Split at the next power of 10
  const nextPowerMinus1 = '9'.repeat(start.length);
  const nextPower = '1' + '0'.repeat(start.length);
  
  return [[start, nextPowerMinus1], ...splitIntervalsByMagnitude(nextPower, end)];
};

const generateNewId = (segment: string, repeats: number) => segment.repeat(repeats);
const generateInvalidIds = (lowerBoundAsStr: string, upperBoundAsStr: string, maxRepeatingSegments?: number) => {
  const invalidIds = [];
  const numDigits = lowerBoundAsStr.length;

  let numberOfRepeatingSegments = 2;

  while (numberOfRepeatingSegments <= (maxRepeatingSegments || numDigits)) {
    if (numDigits % numberOfRepeatingSegments !== 0) {
      numberOfRepeatingSegments++;
      continue;
    }

    const segmentLength = numDigits / numberOfRepeatingSegments;
    let segment = lowerBoundAsStr.slice(0, segmentLength);

    while (parseInt(generateNewId(segment, numberOfRepeatingSegments)) <= parseInt(upperBoundAsStr)) {
      invalidIds.push(generateNewId(segment, numberOfRepeatingSegments));

      segment = (parseInt(segment) + 1).toString();
    }
    numberOfRepeatingSegments++;
  }

  return uniq(invalidIds).filter(id => parseInt(id) >= parseInt(lowerBoundAsStr) && parseInt(id) <= parseInt(upperBoundAsStr));
};

const processInterval = (interval: string, maxRepeatingSegments?: number) => {
  const [lowerBound, upperBound] = interval.split('-');

  // Turn main interval 50 - 1500 into sub-intervals [50-99], [100-999], [1000-1500]
  const subIntervals = splitIntervalsByMagnitude(lowerBound, upperBound);

  for (const [start, end] of subIntervals) {
    const invalidIds = generateInvalidIds(start, end, maxRepeatingSegments);
    finalResult.push(...invalidIds);
  }
}

// read input from file
const input: string[] = readFileSync('./day2-input.txt', 'utf-8')
  .trim()
  .split(',');

for (const interval of input) {
  processInterval(interval);
}

console.log(`There are ${finalResult.length} invalid IDs.`);
console.log('Invalid IDs:', finalResult);
console.log(`The sum of all invalid IDs is ${finalResult.reduce((sum, id) => sum + parseInt(id), 0)}`);