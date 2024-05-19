export default function preventScroll(
  bool: boolean,
  elem: HTMLElement | undefined = document.documentElement
) {
  if (typeof window !== "undefined") {
    const elemStyle = elem.style;

    bool ? (elemStyle.overflow = "hidden") : (elemStyle.overflow = "initial");
  }
}
