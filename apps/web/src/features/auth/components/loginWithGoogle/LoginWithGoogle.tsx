import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { useAppSelector } from "@redux/hooks";
import { selectUserOStateToken } from "@authFeat/redux/authSelectors";

import { Button } from "@components/common/controls";
import { Icon } from "@components/common";
import { Spinner } from "@components/loaders";

import s from "./loginWithGoogle.module.css";

import { LoginGoogleTriggerType } from "@authFeat/services/authApi";

export interface LoginWithGoogleProps {
  queryKey: "register" | "login";
  loginGoogle: LoginGoogleTriggerType;
  setGoogleLoading: React.Dispatch<React.SetStateAction<boolean>>;
  processing: {
    google: boolean;
    form: boolean;
    all: boolean;
  };
}

/**
 * Google login button with divider, including logic for the Google OAuth redirect callback.
 *
 * Meant to be used with a Form.
 */
export default function LoginWithGoogle({
  queryKey,
  loginGoogle,
  setGoogleLoading,
  processing,
}: LoginWithGoogleProps) {
  const [searchParams] = useSearchParams();

  const storedOState = useAppSelector(selectUserOStateToken),
    redirectUri = `${import.meta.env.VITE_APP_URL}/?${queryKey}=true`;

  const createGoogleOAuthUrl = () => {
    const scope = "email profile",
      state = storedOState?.original;

    return `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  };

  const handleCallback = (code: string) => {
    setGoogleLoading(true);

    const mutation = loginGoogle({
      code: code,
      state: searchParams.get("state") || "",
      secret: storedOState?.secret,
      redirect_uri: redirectUri,
    })
    mutation.finally(() => setGoogleLoading(false));
    return mutation;
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      const mutation = handleCallback(code);
      return () => mutation.abort();
    };
  }, [searchParams]);

  return (
    <>
      <div className={s.or}>
        <hr />
        <span
          id="logWit"
          aria-description="Register with other third party services."
        >
          Or Login With
        </span>
        <hr aria-hidden="true" />
      </div>
      {/* TODO: Try button asChild and use a link????? */}
      <Button
        aria-label="Google"
        aria-describedby="logWit"
        aria-live="polite"
        intent="secondary"
        size="xl"
        className={s.google}
        disabled={processing.all}
        onClick={() =>
          window.open(createGoogleOAuthUrl(), "_blank", "noopener,noreferrer")
        }
      >
        <span>
          {processing.google ? (
            <Spinner intent="primary" size="md" />
          ) : (
            <>
              <Icon aria-hidden="true" id="google-24" /> Google
            </>
          )}
        </span>
      </Button>
    </>
  );
}
