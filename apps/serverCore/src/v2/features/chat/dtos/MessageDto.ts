import { Rooms } from "@chatFeat/typings/Rooms";

export default interface MessageDto {
  username: string;
  room_id: Rooms;
  message: string;
}
