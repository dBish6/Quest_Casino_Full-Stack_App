import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { useAppSelector } from "@redux/hooks";
import { selectUserOStateToken } from "@authFeat/redux/authSelectors";

import { Button } from "@components/common/controls";
import { Icon } from "@components/common/icon";
import { Spinner } from "@components/loaders";

import s from "./loginWithGoogle.module.css";

import { LoginGoogleTriggerType } from "@authFeat/services/authApi";

export interface LoginWithGoogleProps {
  query: "register" | "login";
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
  query,
  loginGoogle,
  setGoogleLoading,
  processing,
}: LoginWithGoogleProps) {
  const [searchParams] = useSearchParams();

  const storedOState = useAppSelector(selectUserOStateToken),
    redirectUri = `${import.meta.env.VITE_APP_URL}/?${query}=true`;

  const createGoogleOAuthUrl = () => {
    const scope = "email profile",
      state = storedOState?.original;

    return `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  };

  const handleCallback = (code: string) => {
    setGoogleLoading(true);

    loginGoogle({
      code: code,
      state: searchParams.get("state") || "",
      secret: storedOState?.secret,
      redirect_uri: redirectUri,
    }).finally(() => setGoogleLoading(false));
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) handleCallback(code);
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
      <Button
        aria-label="Google"
        aria-describedby="logWit"
        aria-live="polite"
        intent="secondary"
        size="xl"
        className={s.google}
        disabled={processing.all}
        style={{ opacity: processing.form ? 0.48 : 1 }}
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
