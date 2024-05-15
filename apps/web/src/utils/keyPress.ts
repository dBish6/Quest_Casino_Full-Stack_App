export default function keyPress(
  e: React.KeyboardEvent<HTMLElement>,
  callback: () => void
) {
  if (e.key === "Enter" || e.key === " ") callback();
}
