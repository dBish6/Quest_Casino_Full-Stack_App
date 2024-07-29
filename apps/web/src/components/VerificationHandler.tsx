import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import { useEmailVerifyMutation } from "@authFeat/services/authApi";

import { OverlayLoader } from "@components/loaders";

export default function VerificationHandler() {
  const [searchParams] = useSearchParams();

  const user = useAppSelector(selectUserCredentials),
    [verify, { isLoading }] = useEmailVerifyMutation();

  useEffect(() => {
    if (user?.email_verified === false) {
      const token = searchParams.get("verify");

      if (token) {
        const mutation = verify(undefined);
        return () => mutation.abort();
      }
    }
  }, []);

  return isLoading ? <OverlayLoader message="Verifying..." /> : null;
}
