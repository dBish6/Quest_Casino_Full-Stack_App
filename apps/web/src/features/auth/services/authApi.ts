import type { SuccessResponse } from "@typings/ApiResponse";

import { createApi, baseQuery } from "@services/index";
// import { SET_TOKEN } from "../redux/authSlice";

import { logger } from "@qc/utils";

const authApi = createApi({
  reducerPath: "authApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "/api/v2" }),
  baseQuery: baseQuery(),
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      // TODO: User type.
      query: (user) => ({
        url: `/register`,
        method: "POST",
        body: user,
        // validateStatus: (response, result) =>
        //   response.status === 200 && !result.isError,
        // responseHandler: (res) => {
        //   res.ok
        // },
        // responseHandler(response) {
        //   return;
        // },
      }),
      // invalidatesTags: [{ type: "User", id: "?" }],
    }),

    login: builder.mutation<any, any>({
      // TODO: User type.
      query: (credentials: { email: string; password: string }) => ({
        url: `/login`,
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data, meta } = await queryFulfilled;

          console.log("data", data);
          console.log("meta", meta);

          if (meta?.response?.ok) {
            console.log("Hi");
            // dispatch(SET_TOKEN(data.body.token));
          }
        } catch (error: any) {
          logger.error("authApi login onQueryStarted error:\n", error.message);
          // dispatch(SET_TOKEN(null));
        }
      },
    }),

    getUsers: builder.query<any, any>({
      query: () => ({
        url: `/users`,
        method: "GET",
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),

    getUser: builder.query<any, any>({
      query: () => ({
        url: `/current-user`,
        method: "GET",
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
    }),

    // login:
    // getUser:
    // getUser:
  }),
});

export const {
  endpoints: authEndpoints,
  reducerPath: authApiReducerPath,
  reducer: authApiReducer,
  middleware: authMiddleware,
  useRegisterMutation,
  useLoginMutation,
  useGetUsersQuery,
  useGetUserQuery,
} = authApi;

export default authApi;
