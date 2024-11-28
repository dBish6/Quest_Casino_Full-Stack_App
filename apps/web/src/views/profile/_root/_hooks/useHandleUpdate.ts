import type { UserProfileCredentials } from "@qc/typescript/typings/UserCredentials";
import type { ParsedPhone } from "../_components/edit/Personal";
import type { UpdateProfileBodyDto } from "@qc/typescript/dtos/UpdateUserDto";
import type { MutationResponse } from "@authFeat/hooks/useHandleUserValidationResponse";

import { useRef } from "react";
import { useFetcher } from "react-router-dom";

import useForm from "@hooks/useForm";
import useHandleUserValidationResponse from "@authFeat/hooks/useHandleUserValidationResponse";

import { useAppDispatch } from "@redux/hooks";
import { ADD_TOAST } from "@redux/toast/toastSlice";

export function useHandleUpdate(
  user: Partial<Omit<UserProfileCredentials, "phone_number"> & ParsedPhone>,
  mutationTrigger: { postUpdateProfile: any; postSendConfirmPasswordEmail?: any },
  updateReset: () => void,
  onSuccess?: (data: NonNullable<MutationResponse["data"]>) => void
) {
  const fetcher = useFetcher(),
    form = useForm<
      UpdateProfileBodyDto & { calling_code: string } & {
        old_password: string;
        new_password: string;
      }
    >(),
    password = useRef<{ old_password?: string; new_password?: string } | null>(null);

  const dispatch = useAppDispatch();

  const handlePassword = async (password: { old?: string; new?: string }) => {
    mutationTrigger.postSendConfirmPasswordEmail({ password })
      .then((res: MutationResponse) => {
        if (res.data?.message?.includes("successfully")) form.formRef.current!.reset();
      })
      .finally(() => form.setLoading(false));
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user.email_verified)
      return form.setError(
        "global",
        "Your profile hasn't been verified yet, please verify to update your profile."
      );

    form.setLoading(true);
    form.setError("global", "");
    password.current = null
    updateReset();

    const fields = e.currentTarget.querySelectorAll<HTMLInputElement>("input, textarea, select");
    let formData = new FormData();

    for (const field of fields) {
      if (field.name === "bot") {
        formData.append(field.name, field.value);
        continue;
      } else if (["old_password", "new_password"].includes(field.name)) {
        password.current = { ...(password.current || {}), [field.name]: field.value };
        continue;
      }
      let credential;

      if (["first_name", "last_name"].includes(field.name)) credential = user.legal_name![field.name.split("_")[0]! as keyof typeof user["legal_name"]];
      else if (field.name === "calling_code") credential = user.callingCode;
      else if (field.name === "phone_number") credential = user.number;
      else credential = user[field.name as keyof typeof user];

      if (field.value.length && field.value !== credential) {
        if (["calling_code", "phone_number"].includes(field.name)) {
          formData.append("calling_code", fields[1].value);
          formData.append("phone_number", fields[2].value);
        } else {
          formData.append(field.name, field.value);
        }
      }
    }
    if (password.current?.old_password || password.current?.new_password)
      Object.entries(password.current).forEach(([key, value]) => formData.append(key, value));

    const formDataLength = Array.from(formData.values()).length;
    if (formDataLength <= 1) {
      form.setError(
        "global",
        "Nothing was changed. Change at least one field below to update."
      );
      form.setLoading(false);
    } else {
      formData.append("isProfile", "true");
      fetcher.submit(formData, {
        method: "post",
        action: "/action/user/validate"
      });
    }
  };

  useHandleUserValidationResponse(
    fetcher,
    {
      setErrors: form.setErrors,
      setLoading: form.setLoading
    },
    mutationTrigger.postUpdateProfile,
    {
      success: (data, meta) => {
        if (onSuccess) onSuccess(data);
        
        if (password.current?.old_password && password.current?.new_password) {
          if (meta.request.body.email) {
            dispatch(
              ADD_TOAST({
                title: "Conflict",
                message: "Your email has been changed and other fields if provided. However, you must verify your new email before attempting to change your password. When verified, come back and change your password.",
                intent: "error"
              })
            );
          } else {
            dispatch(
              ADD_TOAST({
                title: "Processing Password",
                message: "Because you updated your password also, we are now processing the password reset. Please stay on this page and hang tight...",
                intent: "info",
                duration: 6500
              })
            );
            const { old_password, new_password } = password.current;
            handlePassword({ old: old_password!, new: new_password! });
          }
        }
      },
      error: (error) => {
        if (error.status === 429) form.setError("global", error.data!.ERROR);
      },
    },
    { extraBody: { password: undefined } }
  );

  return { fetcher, useForm: form, handleSubmit };
}
