//function that calculates the sum of an array of numbers
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * Calculates the square root of a non-negative number.
 *
 * @param num - The number to calculate the square root of. Must be non-negative.
 * @returns The square root of the provided number.
 * @throws {Error} If the input number is negative.
 */
export function squareRoot(num: number): number {
  if (num < 0) {
    throw new Error("Cannot calculate square root of a negative number");
  }
  return Math.sqrt(num);
}

/**
 * Calculates the factorial of a non-negative integer.
 * @param n - The non-negative integer to calculate the factorial for.
 * @returns The factorial of n.
 * @throws {Error} If n is a negative number.
 * @example
 * factorial(5); // returns 120
 * factorial(0); // returns 1
 */
export function factorial(n: number): number {
  if (n < 0) {
    throw new Error("Cannot calculate factorial of a negative number");
  }
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

export function power(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
