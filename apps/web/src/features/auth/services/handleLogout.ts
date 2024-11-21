import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { Socket } from "socket.io-client";

import { logger } from "@qc/utils";

import { getSocketInstance } from "@services/socket";
import { CLEAR_USER } from "@authFeat/redux/authSlice";
import { CLEAR_CHAT } from "@chatFeat/redux/chatSlice";
import { ADD_TOAST } from "@redux/toast/toastSlice";

export default async function handleLogout(
  dispatch: ThunkDispatch<any, any, UnknownAction>, socket: Socket
) {
  try {
    dispatch(CLEAR_USER());
    dispatch(CLEAR_CHAT());

    socket.disconnect();
    getSocketInstance("chat").disconnect();

    // alert("User login session timed out.");
    dispatch(
      ADD_TOAST({
        message: "User login session timed out.",
        intent: "info",
        duration: 6500
      })
    );
  } catch (error: any) {
    logger.error("handleLogout error:\n", error.message);
  }
}
