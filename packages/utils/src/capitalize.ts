/**
 * Capitalizes each word in a string that could also be in snake case.
 */
export function capitalize(txt: string) {
  return txt
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
