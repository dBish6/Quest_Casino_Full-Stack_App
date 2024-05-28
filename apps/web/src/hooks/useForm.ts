import { useState } from "react";

export interface FormState<T = Partial<Record<string, string>>> {
  error: Partial<T>;
  processing: boolean;
}

/**
 * A hook to manage form state, including error handling and processing status.
 *
 * @template T The type of the error object. Defaults to a partial record of strings.
 *
 * @example
 * // Basic usage with default error type.
 * const { form, setLoading, setErrors } = useForm();
 *
 * @example
 * // Custom usage with a specific error type.
 * interface CustomError {
 *   username: string;
 *   password: string;
 * }
 * const { form, setLoading, setErrors } = useForm<CustomError>();
 */
export default function useForm<T = Partial<Record<string, string>>>() {
  const [form, setForm] = useState<FormState<T>>({
    error: {},
    processing: false,
  });

  const setLoading = (bool: boolean) =>
    setForm((prev) => ({ ...prev, processing: bool }));

  const setErrors = (errors: Partial<T>) =>
    setForm((prev) => ({
      ...prev,
      error: errors,
    }));
  const setError = (key: keyof T, value: string) =>
    setForm((prev) => ({
      ...prev,
      error: {
        ...prev.error,
        [key]: value,
      },
    }));

  return { form, setLoading, setError, setErrors };
}
