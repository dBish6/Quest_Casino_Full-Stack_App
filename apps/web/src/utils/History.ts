import { useRef, useEffect } from "react";
import type { NavigateFunction, To, NavigateOptions } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Programmatic navigation; allows the use of `useNavigate` outside react components. A custom interface that 
 * somewhat mimics the native history API, with a length variable counts their history only in this app. Also, 
 * includes a `locationReload` method to refresh the current page.
 */
class History {
  private navigate: NavigateFunction | null = null;
  public readonly length = 0;

  constructor(useNavigate: NavigateFunction) {
    this.navigate = useNavigate;
  }

  public push(target: To, options?: NavigateOptions) {
    this.navigate!(target, { ...options })
  }

  public back(options?: NavigateOptions) {
    this.navigate!(-1 as any, { ...options });
  }

  public forward(options?: NavigateOptions) {
    this.navigate!(1 as any, { ...options });
  }

  public locationReload() {
    return window.location.reload();
  }
}

export type CustomHistory = InstanceType<typeof History>;
//** Use this everywhere instead of `useNavigate` for consistency. */
export let history: CustomHistory = {} as any;

export default function HistoryProvider() {
  const navigate = useNavigate(),
    location = useLocation();

  if (typeof window !== "undefined" && !Object.hasOwn(history, "push")) 
    history = new History(navigate);
  
  const initialLoad = useRef(true);
  useEffect(() => {
    if (!initialLoad.current) (history.length as any) += 1;
    initialLoad.current = false;
  }, [location.pathname]);

  return null;
}
