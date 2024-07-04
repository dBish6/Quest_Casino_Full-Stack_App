import type { UserCredentials } from "@qc/typescript/typings/UserCredentials";

import { useRef, useState, useEffect, useLayoutEffect } from "react";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

/**
 * Use this custom hook to avoid server and client mismatches; loads the user on the client.
 */
export default function useUser() {
  // const userRef = useRef<UserCredentials | null>(null),
  const [user, setUser] = useState<UserCredentials | null>(null),
    storedUser = useAppSelector(selectUserCredentials);

  if (typeof window !== "undefined") {
    useLayoutEffect(() => {
      setUser(storedUser);
    }, [storedUser]);
  }

  return user;
}
