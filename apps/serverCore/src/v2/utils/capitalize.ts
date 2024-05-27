/**
 * Capitalizes each word in a string that is in snake case.
 */
export default function capitalize(txt: string) {
  return txt
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
