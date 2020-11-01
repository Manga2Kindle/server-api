export function isNaturalNumber(x: unknown): boolean {
  const n: string = x as string; // force the value incase it is not
  const n1 = Math.abs(Number(n));
  const n2 = parseInt(n, 10);

  return !isNaN(n1) && n2 === n1 && n1.toString() == n;
}
