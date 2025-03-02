import { useSearchParams, useNavigate } from "react-router-dom"
import { useMemo } from "react";

export type SetStableSearchParams = (callback?: (params: URLSearchParams) => void) => void;

/**
 * Tries to mimic `useSearchParams` from react-router, providing a stateless alternative 
 * that prevents re-renders on search parameter changes. 
 */
export default function useStableSearchParams() {
  const [searchParams] = useSearchParams(),
    navigate = useNavigate();

  // Stable instance of `URLSearchParams` based on `searchParams`
  const stableSearchParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const setStableSearchParams = (callback?: (params: URLSearchParams) => void) => {
      if (callback) callback(stableSearchParams);
      navigate({ search: `?${stableSearchParams.toString()}` }, { replace: true });
  };

  return [stableSearchParams, setStableSearchParams] as const;
}
