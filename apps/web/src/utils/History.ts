import { useNavigate, NavigateFunction } from "react-router-dom";

// Allows the use of useNavigate outside react components.
export const history: {
  navigate: NavigateFunction | null;
  push: (page: string | -1, ...rest: any[]) => void;
} = {
  navigate: null,
  push: (page, ...rest) => history.navigate!(page as string, ...rest),
};

export default function HistoryProvider() {
  history.navigate = useNavigate();
  return null;
}
