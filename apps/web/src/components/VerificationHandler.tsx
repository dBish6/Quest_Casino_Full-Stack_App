import { useSearchParams } from "react-router-dom";

import useResourcesLoadedEffect from "@hooks/useResourcesLoadedEffect";

import { useAppSelector } from "@redux/hooks";
import { selectUserCredentials } from "@authFeat/redux/authSelectors";
import { useEmailVerifyMutation } from "@authFeat/services/authApi";

import { OverlayLoader } from "@components/loaders";

export default function VerificationHandler() {
  const [searchParams] = useSearchParams();

  const user = useAppSelector(selectUserCredentials),
    [postEmailVerify, { isLoading }] = useEmailVerifyMutation();

  // They'll be redirected when still signed in from the email.
  useResourcesLoadedEffect(() => {
    if (user?.email_verified === false) {
      const token = searchParams.get("verify");

      if (token) {
        const mutation = postEmailVerify(undefined);

        return () => mutation.abort();
      }
    }
  }, []);

  return isLoading ? <OverlayLoader message="Verifying..." /> : null;
}
