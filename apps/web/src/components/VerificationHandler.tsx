import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";

import { useEmailVerifyMutation } from "@authFeat/services/authApi";

import { OverlayLoader } from "@components/loaders";

export default function VerificationHandler() {
  const [searchParams] = useSearchParams(),
    [loading, setLoading] = useState(false);

  const user = useAppSelector(selectUserCredentials),
    [verify] = useEmailVerifyMutation();

  useEffect(() => {
    if (user?.email_verified === false) {
      const token = searchParams.get("verify");

      if (token) {
        setLoading(true);
        verify(undefined).finally(() => setLoading(false));
      }
    }
  }, []);

  return loading ? <OverlayLoader message="Verifying..." /> : null;
}
