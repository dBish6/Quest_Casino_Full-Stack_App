// import * as Accordion from "@radix-ui/react-accordion";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { Button } from "@components/common/controls";
import { Icon } from "@components/common";

import s from "./chat.module.css";

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.has("pm") && !searchParams.has("aside", "enlarged")) {
      setSearchParams((params) => {
        params.set("aside", "enlarged");
        return params;
      });
    }
  }, [searchParams]);

  return (
    <div id="chat" className={s.chat}>
      <Button
        aria-label={searchParams.get("") ? "Shrink Chat" : "Enlarge Chat"}
        aria-controls="chat"
        aria-expanded={!searchParams.get("")}
        size="lrg"
        iconBtn
      >
        <Icon id="expand-35" />
      </Button>

      <hgroup className={s.head}>
        <Icon aria-hidden="true" id="speech-bubble-24" />
        <h3>Chat</h3>
      </hgroup>
    </div>
  );
}
