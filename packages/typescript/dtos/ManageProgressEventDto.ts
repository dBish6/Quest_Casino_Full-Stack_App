import type { UserCredentials } from "../typings/UserCredentials";

export interface ManageProgressEventDto {
  type: "quest" | "bonus";
  action: "activate" | "progress";
  title: string;
}

export interface ManageProgressResponseDto {
  progress: Partial<UserCredentials["statistics"]["progress"]>;
}
