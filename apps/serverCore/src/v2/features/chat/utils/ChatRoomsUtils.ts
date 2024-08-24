import { COUNTRIES_MAP } from "@qc/constants";
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

  isRoom(id: string | null, type?: "global" | "private") {
    const validate = {
      global: !!this.AVAILABLE_GLOBAL_CHAT_ROOM[id as keyof typeof this.AVAILABLE_GLOBAL_CHAT_ROOM],
      private: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id || "")
    };

    if (type === "global") return validate.global;
    else if (type === "private") return validate.private;
    else return validate.global || validate.private;
  }

  /**
   * Gets the corresponding global chat room by country.
   * @throws `SocketError forbidden` when not a valid country.
   */
  getGlobalChatRoom(country: string) {
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
