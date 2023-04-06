import { useState } from "react";

const useButtonFilter = () => {
  const [selectedBtn, setSelectedBtn] = useState({
    selected: false,
    type: "",
    text: "All",
  });

  const filterContent = (btnType, content) => {
    if (selectedBtn.selected && btnType === selectedBtn.type) {
      setSelectedBtn({ ...selectedBtn, selected: false, type: "" });
      return content;
    }

    if (btnType === "cards" && selectedBtn.type !== btnType) {
      setSelectedBtn({ ...selectedBtn, selected: true, type: btnType });
      return content.filter((detail) => detail.tag === "cards");
    } else if (btnType === "slots" && selectedBtn.type !== btnType) {
      setSelectedBtn({ ...selectedBtn, selected: true, type: btnType });
      return content.filter((detail) => detail.tag === "slots");
    } else if (btnType === "other" && selectedBtn.type !== btnType) {
      setSelectedBtn({ ...selectedBtn, selected: true, type: btnType });
      return content.filter((detail) => detail.tag === "other");
    }
  };

  return [filterContent, selectedBtn];
};

export default useButtonFilter;
