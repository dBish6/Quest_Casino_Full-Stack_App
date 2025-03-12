import { StateUser } from "@authFeat/redux/authSlice";

export interface LogoutResponseDto {
  oState: StateUser["token"]["oState"];
}
