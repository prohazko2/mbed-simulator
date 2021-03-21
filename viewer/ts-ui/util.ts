export function delay(ms = 10) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
