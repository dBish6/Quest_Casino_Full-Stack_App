import Spinner from "../spinner/Spinner";

export interface OverlayLoaderProps {
  message?: string;
}

export default function OverlayLoader({ message }: OverlayLoaderProps) {
  return (
    <div role="status">
      <span>{message ? message : "Just a moment..."}</span>
    </div>
  );
}
