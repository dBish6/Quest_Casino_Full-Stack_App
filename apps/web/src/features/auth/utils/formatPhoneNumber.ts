import { useState } from "react";

export default function useFormatPhoneNumber() {
  const [phoneValue, setPhoneValue] = useState("");

  const handlePhoneFormat = (val: string) => {
    if (!val) return setPhoneValue("");

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

    setPhoneValue(format);
  };

  return { handlePhoneFormat, phoneValue };
}
