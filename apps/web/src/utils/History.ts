import { useRef, useEffect } from "react";
import type { NavigateFunction, To, NavigateOptions } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

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

  public reload() {
    return window.location.reload();
  }
}

export type CustomHistory = InstanceType<typeof History>;
export let history: CustomHistory; 

export default function HistoryProvider() {
  const navigate = useNavigate(),
    location = useLocation();

  if (typeof window !== "undefined" && !history) 
    history = new History(navigate);
  
  const initialLoad = useRef(true);
  useEffect(() => {
    if (!initialLoad.current) (history.length as any) += 1;
    initialLoad.current = false;
  }, [location.pathname]);

  return null;
}
