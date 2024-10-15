import type { NavigateFunction, To, NavigateOptions } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Allows the use of useNavigate outside react components.
export const history: {
  navigate: NavigateFunction | null;
  push: (page: To, options?: NavigateOptions) => void;
} = {
  navigate: null,
  push: (page, options) => history.navigate!(page as string, options),
};

export default function HistoryProvider() {
  history.navigate = useNavigate();
  return null;
}
