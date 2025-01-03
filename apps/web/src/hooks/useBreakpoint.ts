import { useContext } from "react";
import { BreakpointContext } from "@components/dashboard";

export default function useBreakpoint() {
  const context = useContext(BreakpointContext);
  if (!context)
    throw new Error("useBreakpointContext must be used within a BreakpointProvider.");

  return context;
}
