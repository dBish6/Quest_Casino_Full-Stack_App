import { useSearchParams, Navigate } from "react-router-dom";
import { useMemo } from "react";

import { useAppDispatch } from "@redux/hooks";
import { unexpectedErrorToast } from "@redux/toast/toastSlice";

const isJwtString = (token: string) => /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)$/.test(token);

export default function verTokenRequiredView<TProps extends object>(
  Component: React.ComponentType<TProps>,
  param: string
) {
  return function (props: TProps) {
    const [searchParams] = useSearchParams(),
      token = searchParams.get(param) || ""
    const dispatch = useAppDispatch();

    const isTokenValid = useMemo(() => isJwtString(token), [token]);

    if (token && !isTokenValid) {
      dispatch(
        unexpectedErrorToast(
          `It seems the ${param} link is invalid. Please ensure you accessed this page through the link provided in your email.`,
          false
        )
      );
      return <Navigate to="/error-401" replace />;
    }

    return <Component {...props} />;
  };
}
