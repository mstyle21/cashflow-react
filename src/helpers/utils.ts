export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = MONTHS[new Date().getMonth()];
export const CURRENCY_SIGN = "RON";
export const BACKEND_URL = "http://localhost:7000";

export function arrayRange(
  start: number,
  end: number,
  step: number = 1
): number[] {
  const array = [];

  for (let i = start; i <= end; i += step) {
    array.push(i);
  }

  return array;
}

export function randomHash(length: number = 5): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let hash = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    hash += characters.charAt(randomIndex);
  }

  return hash;
}
