import { useRef, useState } from "react";

export interface FormState<T = Partial<Record<string, string>>> {
  error: Partial<T & { global: string }>;
  processing: boolean;
}

/**
 * A hook to manage form state, including error handling and processing status.
 *
 * @template T The type of the error object. Defaults to a partial record of strings.
 *
 * @example
 * // Basic usage with default error type.
 * const { form, setLoading, setErrors, setError } = useForm();
 *
 * @example
 * // Custom usage with a specific error type.
 * interface CustomError {
 *   username: string;
 *   password: string;
 * }
 * const { form, setLoading, setErrors, setError } = useForm<CustomError>();
 */
export default function useForm<T = Partial<Record<string, string>>>() {
  const formRef = useRef<HTMLFormElement>(null),
    [form, setForm] = useState<FormState<T>>({
      error: {},
      processing: false
    });

  type TForm = T & { global: string };

  const setLoading = (bool: boolean) =>
    setForm((prev) => ({ ...prev, processing: bool }));

  const setErrors = (errors: Partial<TForm>) =>
    setForm((prev) => ({
      ...prev,
      error: errors
    }));
  const setError = (key: keyof TForm, value: string) =>
    setForm((prev) => ({
      ...prev,
      error: {
        ...prev.error,
        [key]: value
      }
    }));

  return { formRef, form, setLoading, setError, setErrors };
}
