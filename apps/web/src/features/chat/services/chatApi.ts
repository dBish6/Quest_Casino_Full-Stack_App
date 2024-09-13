import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type ChatMessage from "@chatFeat/typings/ChatMessage";

import type { SocketResponse } from "@typings/ApiResponse";
import type ManageChatRoomEventDto from "@qc/typescript/dtos/ManageChatRoomEventDto";
import type ManageChatRoomCallbackDto from "@chatFeat/dtos/ManageChatRoomCallbackDto";
import type TypingEventDto from "@qc/typescript/dtos/TypingEventDto";
import type TypingActivityEventDto from "@chatFeat/dtos/TypingActivityEventDto";
import type ChatMessageEventDto from "@qc/typescript/dtos/ChatMessageEventDto";

import { ChatEvent } from "@qc/constants";

import { logger } from "@qc/utils";
import { history } from "@utils/History";
import { isFetchBaseQueryError } from "@utils/isFetchBaseQueryError";

import { createApi, baseQuery } from "@services/index";
import { getSocketInstance, emitAsPromise } from "@services/socket";
import allow500ErrorsTransform from "@services/allow500ErrorsTransform";
import { ADD_TOAST, unexpectedErrorToast } from "@redux/toast/toastSlice";

let seenRestrictionMessage = false;

const socket = getSocketInstance("chat");

const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQuery("/chat"),
  endpoints: (builder) => ({
    /**
     * Joins or leaves global or private chat rooms.
     * @emitter
     */
    manageChatRoom: builder.mutation<ManageChatRoomCallbackDto, ManageChatRoomEventDto>({
      queryFn: async (data) => {
        const res = await emitAsPromise(socket)(ChatEvent.MANAGE_CHAT_ROOM, data);
        // TODO: Could put this in a util.
        return res.error
        ? {
            error: {
              ...res.error,
              data: { ...(allow500ErrorsTransform(res.error!, res.meta).data) }
            }
          }
        : res;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        queryFulfilled.catch((error) => {
          if (isFetchBaseQueryError(error.error)) {
            if (["bad request", "internal error"].includes(error.error.status as string))
              dispatch(
                unexpectedErrorToast("Unable to connect to the chat room due to an unexpected error.")
              );
          }
        })
      }
    }),

    /**
     * When the user is typing.
     * @emitter
     * TODO:
     */
    typing: builder.mutation<SocketResponse, TypingEventDto>({
      queryFn: async (data) => emitAsPromise(socket)(ChatEvent.TYPING, data)
    }),

    /**
     * Receives typing status updates from others in the room.
     * @listener
     */
    typingActivity: builder.mutation<{ resourcesLoaded?: boolean }, { resourcesLoaded?: boolean, callback: (dispatch: ThunkDispatch<any, any, UnknownAction>) => void }>({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async ({ callback }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        
        if (data.resourcesLoaded) {
          logger.debug("typingActivity listener initialized.");

          socket.on(ChatEvent.TYPING_ACTIVITY, ({ verification_token, is_typing }: TypingActivityEventDto) => {
            try {
              logger.debug("TYPING ACTIVITY", { verification_token, is_typing });

              callback(dispatch);
            } catch (error: any) {
              history.push("/error-500");
              logger.error("chatApi typingActivity error:\n", error.message);
            }
          });
        } 
      }
    }),

    /**
     * Sends a chat message.
     * @emitter
     */
    chatMessage: builder.mutation<SocketResponse, ChatMessageEventDto>({
      queryFn: async (data) => emitAsPromise(socket)(ChatEvent.CHAT_MESSAGE, data),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        if (data.status === "bad request" && !seenRestrictionMessage) {
          // Too many duplicate messages (spam).
          dispatch(
            ADD_TOAST({
              title: "Too Many Duplicate Messages",
              message: "You have been temporarily restricted due to sending too many duplicate messages. Wait for the spam cooldown to expire.",
              intent: "error",
            })
          );
          seenRestrictionMessage = true;
        }
      }
    }),

    /**
     * Receives recently sent chat messages.
     * @listener
     */
    chatMessageSent: builder.mutation<{ resourcesLoaded?: boolean }, { resourcesLoaded?: boolean, callback: (chatMessage: ChatMessage, dispatch: ThunkDispatch<any, any, UnknownAction>) => void }>({
      queryFn: (loadedObj) => ({ data: loadedObj }),
      onQueryStarted: async ({ callback }, { dispatch, queryFulfilled }) => {
         const { data } = await queryFulfilled;
  
        if (data.resourcesLoaded) {
          logger.debug("chatMessageSent listener initialized.");

          socket.on(ChatEvent.CHAT_MESSAGE_SENT, (chatMessage: ChatMessage) => {
            try {
              logger.debug("CHAT MESSAGE SENT", chatMessage);

              if (
                !chatMessage.username &&
                ["has joined", "has left"].some((str) => chatMessage.message.includes(str))
              )
                return dispatch(ADD_TOAST({ message: chatMessage.message, intent: "info" }));

              callback(chatMessage, dispatch);
            } catch (error: any) {
              history.push("/error-500");
              logger.error("chatApi chatMessageSent error:\n", error.message);
            }
          });
        }
      },
    }),
  }),
});

export const {
  endpoints: chatEndpoints,
  reducerPath: chatApiReducerPath,
  reducer: chatApiReducer,
  middleware: chatMiddleware,
  useManageChatRoomMutation,
  useTypingMutation,
  useTypingActivityMutation,
  useChatMessageMutation,
  useChatMessageSentMutation
} = chatApi;

export default chatApi;
  