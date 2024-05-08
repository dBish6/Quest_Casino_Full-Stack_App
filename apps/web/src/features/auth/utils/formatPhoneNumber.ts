export default function formatPhoneNumber(target: HTMLInputElement) {
  const val = target.value;

  let format = val.replace(/[^\d]/g, "");
  format =
    format.length < 4
      ? format
      : format.length < 7
        ? `(${format.slice(0, 3)}) ${format.slice(3)}`
        : `(${format.slice(0, 3)}) ${format.slice(3, 6)}-${format.slice(
            6,
            10
          )}`;

  target.value = format;
}
