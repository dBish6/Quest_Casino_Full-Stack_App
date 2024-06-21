import type { Variants } from "framer-motion";

import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { m } from "framer-motion";

import { Button, Select, Input } from "@components/common/controls";
import { Icon, Avatar, Blob } from "@components/common";
import { ScrollArea } from "@components/scrollArea";

import s from "./chat.module.css";

const shrinkInOut: Variants = {
  enlarged: {
    height: "89%",
    transition: { type: "spring", duration: 0.85 },
  },
  shrunk: {
    height: "81.2px",
    transition: { type: "spring", duration: 0.85 },
  },
};

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams(),
    asideState = searchParams.get("aside"),
    chatState = searchParams.get("chat") || "enlarged";

  useEffect(() => {
    if (searchParams.has("pm") && !searchParams.has("aside", "enlarged")) {
      setSearchParams((params) => {
        params.set("aside", "enlarged");
        return params;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("chatState", chatState);
  }, [searchParams]);

  return (
    <m.div
      id="chat"
      className={s.chat}
      variants={shrinkInOut}
      initial="default"
      animate={chatState}
    >
      <div className={s.head}>
        <div className={s.inner} data-state={chatState}>
          <Button
            aria-label={chatState === "shrunk" ? "Enlarge Chat" : "Shrink Chat"}
            aria-controls="chat"
            aria-expanded={chatState === "enlarged"}
            size="lrg"
            iconBtn
            onClick={() =>
              setSearchParams((params) => {
                params.has("chat")
                  ? params.delete("chat", "shrunk")
                  : params.set("chat", "shrunk");
                return params;
              })
            }
          >
            <Icon id="expand-35" />
          </Button>
          <hgroup>
            <Icon aria-hidden="true" id="speech-bubble-24" />
            <h3>Chat</h3>
          </hgroup>
          {chatState === "enlarged" && (
            <Select
              // Default value instead of label.
              // label="Country"
              intent="primary"
              size="lrg"
              defaultValue="Global"
            >
              <option value="Global">Global</option>
              {/* ...the list of friends (use a prop).*/}
            </Select>
          )}
        </div>
        {chatState === "enlarged" && (
          <Blob svgWidth="155.361px" svgHeight="51.866px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 155.361 51.866"
              preserveAspectRatio="xMidYMin meet"
            >
              <path
                d="M72.245 2.489c22.276 0 38.993-5.6 59.085 0s19.252 10.71 21.282 22.4 9.311 18.482-13.161 24.362-40.03 0-70.285 0c-30.018 0-49.72 4.656-60.435 0C2.931 46.739 0 44.608 0 27.129 0 8.368.875 7.923 8.731 5.287 20.114 1.464 43.51 2.489 72.245 2.489Z"
                fill="#b243b2"
              />
            </svg>
          </Blob>
        )}
      </div>

      {chatState === "enlarged" && (
        <>
          <ScrollArea orientation="vertical" className={s.messages}>
            <ul>
              {Array.from({ length: 16 }).map((_, i) => (
                <Message key={i} />
              ))}
            </ul>
          </ScrollArea>
          <div className={s.input}>
            <Input
              label="Message"
              intent="primary"
              size="lrg"
              Button={() => (
                <Button
                  intent="primary"
                  size={asideState === "enlarged" ? "xl" : "lrg"}
                  iconBtn
                >
                  <Icon
                    id={asideState === "enlarged" ? "send-24" : "send-18"}
                  />
                </Button>
              )}
            />
          </div>
        </>
      )}
    </m.div>
  );
}

function Message() {
  return (
    <li className={s.message}>
      <div>
        <div>
          <Avatar />
          <h4>VinceCarter15</h4>
        </div>

        <time datetime="01:35">01:35</time>
      </div>
      <p>You know, there are many variations of Lorem Ipsum.</p>
    </li>
  );
}
