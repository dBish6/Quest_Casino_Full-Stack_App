import type { ViewUserProfileCredentials } from "@qc/typescript/typings/UserCredentials";

import { createContext, useState } from "react";

export interface LeaderboardContextValues {
  selectedUser: ViewUserProfileCredentials | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<ViewUserProfileCredentials | null>>
}

export const LeaderboardContext = createContext<LeaderboardContextValues | undefined>(undefined);

export function LeaderboardProvider({ children }: React.PropsWithChildren<{}>) {
  const [selectedUser, setSelectedUser] = useState<LeaderboardContextValues["selectedUser"]>(null);

  return (
    <LeaderboardContext.Provider value={{ selectedUser, setSelectedUser }}> 
      {children}
    </LeaderboardContext.Provider>
  );
}
