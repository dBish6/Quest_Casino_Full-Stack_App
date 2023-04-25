import { useState } from "react";

const usePhoneFormat = () => {
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePhoneFormat = (input) => {
    if (input) {
      let phoneNumber = input.target.value.replace(/[^\d]/g, "");
      phoneNumber =
        phoneNumber.length < 4
          ? phoneNumber
          : phoneNumber.length < 7
          ? `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
          : `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
              3,
              6
            )}-${phoneNumber.slice(6, 10)}`;

      setInputValue(phoneNumber);
    }
  };

  const handlePhoneErrorMsg = (e) => {
    /^[0-9()-\s]*$/.test(e.target.value)
      ? setErrorMsg("")
      : setErrorMsg("Must only include numbers.");
  };

  return { handlePhoneFormat, inputValue, handlePhoneErrorMsg, errorMsg };
};

export default usePhoneFormat;
