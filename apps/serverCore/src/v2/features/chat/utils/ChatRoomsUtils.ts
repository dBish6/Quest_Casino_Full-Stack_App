import type ChatRoomAccessType from "@qc/typescript/typings/ChatRoomAccessType";

import { COUNTRIES_MAP } from "@qc/constants";
import isUuidV4 from "@utils/isUuidV4";
import { SocketError } from "@utils/handleError";

class ChatRoomUtils {
  AVAILABLE_GLOBAL_CHAT_ROOM = Object.freeze({
    "North America": "North America",
    "South America": "North America",
    Europe: "Europe",
    Asia: "Asia",
    Africa: "Europe",
    Oceania: "Asia",
    Antarctica: "North America"
  });

  isRoomId(id: string | null, type?: ChatRoomAccessType) {
    const validate = {
      global: !!this.AVAILABLE_GLOBAL_CHAT_ROOM[id as keyof typeof this.AVAILABLE_GLOBAL_CHAT_ROOM],
      private: () => {
        const ids = id?.split("_");
        return ids?.length === 2 && ids.every((id) => isUuidV4(id));
      }
    };

    if (type === "global") return validate.global;
    else if (type === "private") return validate.private();
    else return validate.global || validate.private();
  }

  /**
   * Gets the corresponding global chat room by country.
   * @throws `SocketError forbidden` when not a valid country.
   */
  getGlobalChatRoomId(country: string) {
    let continent = COUNTRIES_MAP.get(country)?.continent as keyof typeof this.AVAILABLE_GLOBAL_CHAT_ROOM | undefined;
    if (!continent) {
      throw new SocketError("Access Denied; Invalid credentials.", "forbidden");
    } else {
      continent = this.AVAILABLE_GLOBAL_CHAT_ROOM[continent];
    }
  
    return continent;
  }
}

const chatRoomUtils = new ChatRoomUtils();
export default chatRoomUtils;
