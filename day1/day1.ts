import { readFileSync } from 'fs';

class RotaryDialNumber {
  value: number;
  next: RotaryDialNumber | null;
  prev: RotaryDialNumber | null;

  constructor(value: number) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class RotaryDial {
  currentNumber: RotaryDialNumber | null = null;
  numberOfTimesLandingOnZero: number = 0;
  numberOfTimesPassingZero: number = 0;

  constructor(numbers: number[], startingNumber: number) {
    // for each number, create a RotaryDialNumber and link them
    const nodes: RotaryDialNumber[] = numbers.map(num => {
      const dialNumber = new RotaryDialNumber(num);
      if (num === startingNumber) {
        // starting position of dial
        this.currentNumber = dialNumber;
      }
      return dialNumber;
    });

    // link the nodes into a circle
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].next = nodes[(i + 1) % nodes.length];
      nodes[i].prev = nodes[(i - 1 + nodes.length) % nodes.length];
    }
  }

  // input will be a string like "R31" or "L15"
  processInput(input: string): void {
    const direction = input.charAt(0) as 'L' | 'R';
    const steps = parseInt(input.slice(1));
    this.rotate(direction, steps);
    if (this.currentNumber?.value === 0) {
      this.numberOfTimesLandingOnZero++;
    }
  } 

  rotate(direction: 'L' | 'R', steps: number): void {
    if (direction === 'R') {
      for (let i = 0; i < steps; i++) {
        if (this.currentNumber?.value === 0) {
          this.numberOfTimesPassingZero++;
        }
        this.currentNumber = this.currentNumber?.next || null;
      }
    } else if (direction === 'L') {
      for (let i = 0; i < steps; i++) {
        if (this.currentNumber?.value === 0) {
          this.numberOfTimesPassingZero++;
        }
        this.currentNumber = this.currentNumber?.prev || null;
      }
    }
  }
}

// initialize dial with numbers 0-99 and starting at 50
const numbers = [];
for (let i = 0; i < 100; i++) {
  numbers.push(i);
}
const dial = new RotaryDial(numbers, 50);

// read input from file
const input: string[] = readFileSync('day1-input.txt', 'utf-8')
  .trim()
  .split('\n');

// run it
for (const rotationInput of input) {
  dial.processInput(rotationInput);
}

console.log(`Number of times landing zero: ${dial.numberOfTimesLandingOnZero}`);
console.log(`Number of times passing zero: ${dial.numberOfTimesPassingZero}`);